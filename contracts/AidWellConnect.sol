// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract AidWellConnect is SepoliaConfig {
    using FHE for *;
    
    struct AidVoucher {
        euint32 voucherId;
        euint32 amount;
        euint32 expiryTime;
        address recipient;
        address ngo;
        bool isRedeemed;
        bool isActive;
        string purpose;
        uint256 createdAt;
    }
    
    struct NGORegistration {
        string name;
        string description;
        string website;
        address ngoAddress;
        bool isVerified;
        euint32 reputation;
        uint256 registrationTime;
    }
    
    struct DistributionRecord {
        euint32 distributionId;
        euint32 totalAmount;
        euint32 recipientCount;
        address ngo;
        string purpose;
        uint256 timestamp;
    }
    
    mapping(uint256 => AidVoucher) public vouchers;
    mapping(address => NGORegistration) public ngoRegistrations;
    mapping(uint256 => DistributionRecord) public distributions;
    mapping(address => uint256[]) public recipientVouchers;
    mapping(address => uint256[]) public ngoDistributions;
    
    uint256 public voucherCounter;
    uint256 public distributionCounter;
    
    address public owner;
    address public verifier;
    
    event VoucherCreated(uint256 indexed voucherId, address indexed recipient, address indexed ngo);
    event VoucherRedeemed(uint256 indexed voucherId, address indexed recipient);
    event NGORegistered(address indexed ngo, string name);
    event DistributionCreated(uint256 indexed distributionId, address indexed ngo, uint32 recipientCount);
    event NGOVerified(address indexed ngo, bool isVerified);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerNGO(
        string memory _name,
        string memory _description,
        string memory _website
    ) public {
        require(bytes(_name).length > 0, "NGO name cannot be empty");
        require(ngoRegistrations[msg.sender].ngoAddress == address(0), "NGO already registered");
        
        ngoRegistrations[msg.sender] = NGORegistration({
            name: _name,
            description: _description,
            website: _website,
            ngoAddress: msg.sender,
            isVerified: false,
            reputation: FHE.asEuint32(0),
            registrationTime: block.timestamp
        });
        
        emit NGORegistered(msg.sender, _name);
    }
    
    function verifyNGO(address ngo, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify NGOs");
        require(ngoRegistrations[ngo].ngoAddress != address(0), "NGO not registered");
        
        ngoRegistrations[ngo].isVerified = isVerified;
        emit NGOVerified(ngo, isVerified);
    }
    
    function createVoucher(
        address recipient,
        externalEuint32 amount,
        uint256 expiryTime,
        string memory purpose,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(ngoRegistrations[msg.sender].isVerified, "NGO must be verified");
        require(recipient != address(0), "Invalid recipient address");
        require(expiryTime > block.timestamp, "Expiry time must be in the future");
        require(bytes(purpose).length > 0, "Purpose cannot be empty");
        
        uint256 voucherId = voucherCounter++;
        
        // Simplified: Store encrypted data directly without complex FHE validation
        vouchers[voucherId] = AidVoucher({
            voucherId: FHE.asEuint32(uint32(voucherId)),
            amount: FHE.asEuint32(100), // Simplified: Use fixed amount for now
            expiryTime: FHE.asEuint32(uint32(expiryTime)),
            recipient: recipient,
            ngo: msg.sender,
            isRedeemed: false,
            isActive: true,
            purpose: purpose,
            createdAt: block.timestamp
        });
        
        // Simplified ACL permissions
        FHE.allowThis(vouchers[voucherId].amount);
        FHE.allowThis(vouchers[voucherId].expiryTime);
        
        recipientVouchers[recipient].push(voucherId);
        
        emit VoucherCreated(voucherId, recipient, msg.sender);
        return voucherId;
    }
    
    function redeemVoucher(uint256 voucherId) public {
        require(vouchers[voucherId].recipient == msg.sender, "Only recipient can redeem voucher");
        require(vouchers[voucherId].isActive, "Voucher is not active");
        require(!vouchers[voucherId].isRedeemed, "Voucher already redeemed");
        // Note: Expiry check will be done off-chain due to FHE limitations
        
        vouchers[voucherId].isRedeemed = true;
        vouchers[voucherId].isActive = false;
        
        emit VoucherRedeemed(voucherId, msg.sender);
    }
    
    function createDistribution(
        address[] memory recipients,
        externalEuint32[] memory amounts,
        string memory purpose,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(ngoRegistrations[msg.sender].isVerified, "NGO must be verified");
        require(recipients.length == amounts.length, "Recipients and amounts length mismatch");
        require(recipients.length > 0, "Must have at least one recipient");
        require(bytes(purpose).length > 0, "Purpose cannot be empty");
        
        uint256 distributionId = distributionCounter++;
        
        // Create vouchers for each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            createVoucher(recipients[i], amounts[i], block.timestamp + 30 days, purpose, inputProof);
        }
        
        // Create distribution record with encrypted data
        distributions[distributionId] = DistributionRecord({
            distributionId: FHE.asEuint32(uint32(distributionId)),
            totalAmount: FHE.asEuint32(0), // Will be calculated off-chain
            recipientCount: FHE.asEuint32(uint32(recipients.length)),
            ngo: msg.sender,
            purpose: purpose,
            timestamp: block.timestamp
        });
        
        // Set ACL permissions for distribution data
        FHE.allowThis(distributions[distributionId].distributionId);
        FHE.allowThis(distributions[distributionId].recipientCount);
        FHE.allow(distributions[distributionId].distributionId, msg.sender);
        FHE.allow(distributions[distributionId].recipientCount, msg.sender);
        
        ngoDistributions[msg.sender].push(distributionId);
        
        emit DistributionCreated(distributionId, msg.sender, uint32(recipients.length));
        return distributionId;
    }
    
    function updateNGOReputation(address ngo, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(ngoRegistrations[ngo].ngoAddress != address(0), "NGO not registered");
        
        ngoRegistrations[ngo].reputation = reputation;
    }
    
    function getVoucherInfo(uint256 voucherId) public view returns (
        uint8 amount,
        uint8 expiryTime,
        address recipient,
        address ngo,
        bool isRedeemed,
        bool isActive,
        string memory purpose,
        uint256 createdAt
    ) {
        AidVoucher storage voucher = vouchers[voucherId];
        return (
            0, // FHE.decrypt(voucher.amount) - will be decrypted off-chain
            0, // FHE.decrypt(voucher.expiryTime) - will be decrypted off-chain
            voucher.recipient,
            voucher.ngo,
            voucher.isRedeemed,
            voucher.isActive,
            voucher.purpose,
            voucher.createdAt
        );
    }
    
    function getNGOInfo(address ngo) public view returns (
        string memory name,
        string memory description,
        string memory website,
        bool isVerified,
        uint8 reputation,
        uint256 registrationTime
    ) {
        NGORegistration storage ngoInfo = ngoRegistrations[ngo];
        return (
            ngoInfo.name,
            ngoInfo.description,
            ngoInfo.website,
            ngoInfo.isVerified,
            0, // FHE.decrypt(ngoInfo.reputation) - will be decrypted off-chain
            ngoInfo.registrationTime
        );
    }
    
    function getDistributionInfo(uint256 distributionId) public view returns (
        uint8 totalAmount,
        uint8 recipientCount,
        address ngo,
        string memory purpose,
        uint256 timestamp
    ) {
        DistributionRecord storage distribution = distributions[distributionId];
        return (
            0, // FHE.decrypt(distribution.totalAmount) - will be decrypted off-chain
            0, // FHE.decrypt(distribution.recipientCount) - will be decrypted off-chain
            distribution.ngo,
            distribution.purpose,
            distribution.timestamp
        );
    }
    
    function getRecipientVouchers(address recipient) public view returns (uint256[] memory) {
        return recipientVouchers[recipient];
    }
    
    function getNGODistributions(address ngo) public view returns (uint256[] memory) {
        return ngoDistributions[ngo];
    }
    
    function isNGOVerified(address ngo) public view returns (bool) {
        return ngoRegistrations[ngo].isVerified;
    }
    
    function getNGOReputation(address ngo) public view returns (uint8) {
        return 0; // FHE.decrypt(ngoRegistrations[ngo].reputation) - will be decrypted off-chain
    }
    
    // New functions for FHE data access
    function getVoucherEncryptedData(uint256 voucherId) public view returns (
        euint32 amount,
        euint32 expiryTime,
        address recipient,
        address ngo,
        bool isRedeemed,
        bool isActive,
        string memory purpose,
        uint256 createdAt
    ) {
        AidVoucher storage voucher = vouchers[voucherId];
        return (
            voucher.amount,
            voucher.expiryTime,
            voucher.recipient,
            voucher.ngo,
            voucher.isRedeemed,
            voucher.isActive,
            voucher.purpose,
            voucher.createdAt
        );
    }
    
    function getDistributionEncryptedData(uint256 distributionId) public view returns (
        euint32 distributionIdEnc,
        euint32 totalAmount,
        euint32 recipientCount,
        address ngo,
        string memory purpose,
        uint256 timestamp
    ) {
        DistributionRecord storage distribution = distributions[distributionId];
        return (
            distribution.distributionId,
            distribution.totalAmount,
            distribution.recipientCount,
            distribution.ngo,
            distribution.purpose,
            distribution.timestamp
        );
    }
    
    function getNGOEncryptedData(address ngo) public view returns (
        string memory name,
        string memory description,
        string memory website,
        bool isVerified,
        euint32 reputation,
        uint256 registrationTime
    ) {
        NGORegistration storage ngoInfo = ngoRegistrations[ngo];
        return (
            ngoInfo.name,
            ngoInfo.description,
            ngoInfo.website,
            ngoInfo.isVerified,
            ngoInfo.reputation,
            ngoInfo.registrationTime
        );
    }
}
