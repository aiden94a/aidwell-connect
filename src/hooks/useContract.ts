import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AidWellConnect, getContractAddress } from '../config/contracts';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';

// Get contract address from centralized config
const CONTRACT_ADDRESS = getContractAddress();

export const useAidWellContract = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: hash, isPending, error } = useWriteContract();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const registerNGO = async (name: string, description: string, website: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'registerNGO',
        args: [name, description, website],
      } as any);
    } catch (err) {
      console.error('Error registering NGO:', err);
      throw err;
    }
  };

  const createVoucher = async (
    recipient: string,
    amount: number, // Clear amount to be encrypted
    expiryTime: number,
    purpose: string
  ) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      console.log('🚀 Starting FHE voucher creation process...');
      console.log('📊 Input parameters:', { recipient, amount, expiryTime, purpose });

      // Validate input parameters
      if (!recipient || recipient === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid recipient address');
      }
      if (amount <= 0 || amount > 4294967295) {
        throw new Error('Amount must be between 1 and 4294967295');
      }
      if (expiryTime <= Math.floor(Date.now() / 1000)) {
        throw new Error('Expiry time must be in the future');
      }
      if (!purpose || purpose.trim().length === 0) {
        throw new Error('Purpose cannot be empty');
      }

      console.log('🔄 Step 1: Creating encrypted input...');
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      
      console.log('🔄 Step 2: Adding recipient address to encrypted input...');
      input.addAddress(recipient);
      
      console.log('🔄 Step 3: Adding amount to encrypted input...');
      input.add32(BigInt(amount));
      
      console.log('🔄 Step 4: Encrypting data...');
      const encryptedInput = await input.encrypt();
      console.log('✅ Encryption completed, handles count:', encryptedInput.handles.length);


      // Convert Uint8Array handles to 32-byte hex strings for externalEaddress/externalEuint32
      const convertToBytes32 = (handle: Uint8Array): string => {
        const hex = `0x${Array.from(handle)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')}`;
        // Ensure exactly 32 bytes (66 characters including 0x)
        if (hex.length < 66) {
          return hex.padEnd(66, '0');
        } else if (hex.length > 66) {
          return hex.substring(0, 66);
        }
        return hex;
      };

      const recipientHandle = convertToBytes32(encryptedInput.handles[0]);
      const amountHandle = convertToBytes32(encryptedInput.handles[1]);
      const proof = `0x${Array.from(encryptedInput.inputProof as Uint8Array)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      console.log('🔄 Step 5: Calling contract...');
      console.log('📊 Contract call parameters:', {
        recipient,
        recipientHandle,
        amountHandle,
        expiryTime,
        purpose,
        proofLength: proof.length
      });

      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createVoucher',
        args: [recipientHandle, amountHandle, BigInt(expiryTime), purpose, proof],
      } as any);

      console.log('✅ Voucher creation successful!');
      return result;
    } catch (err) {
      console.error('❌ Error creating voucher:', err);
      throw err;
    }
  };

  const redeemVoucher = async (voucherId: number) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'redeemVoucher',
        args: [BigInt(voucherId)],
      } as any);
    } catch (err) {
      console.error('Error redeeming voucher:', err);
      throw err;
    }
  };

  const createDistribution = async (
    recipients: string[],
    amounts: number[], // Clear amounts to be encrypted
    purpose: string
  ) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      // Create encrypted input for all amounts
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      amounts.forEach(amount => input.add32(amount));
      const encryptedInput = await input.encrypt();

      // Convert handles to proper format
      const convertHex = (handle: any): string => {
        if (typeof handle === 'string') {
          return handle.startsWith('0x') ? handle : `0x${handle}`;
        } else if (handle instanceof Uint8Array) {
          return `0x${Array.from(handle).map(b => b.toString(16).padStart(2, '0')).join('')}`;
        } else if (Array.isArray(handle)) {
          return `0x${handle.map(b => b.toString(16).padStart(2, '0')).join('')}`;
        }
        return `0x${handle.toString()}`;
      };

      const handles = encryptedInput.handles.map(convertHex);
      const proof = `0x${Array.from(encryptedInput.inputProof as Uint8Array)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createDistribution',
        args: [recipients as `0x${string}`[], handles, purpose, proof],
      } as any);
    } catch (err) {
      console.error('Error creating distribution:', err);
      throw err;
    }
  };

  // FHE Decryption functions
  const decryptVoucherData = async (voucherId: number) => {
    if (!instance || !address || !signerPromise) {
      throw new Error('Missing wallet or encryption service');
    }

    try {
      // Get encrypted data from contract
      const contract = new (await import('ethers')).Contract(CONTRACT_ADDRESS, AidWellConnect.abi, await signerPromise);
      const encryptedData = await contract.getVoucherEncryptedData(voucherId);
      
      console.log('🔍 Encrypted data from contract:', encryptedData);
      
      // Create keypair for decryption
      const keypair = instance.generateKeypair();
      
      // Prepare handle-contract pairs - ensure handles are properly formatted
      // Only decrypt the amount for now, as expiryTime is not encrypted in our contract
      const handleContractPairs = [
        { 
          handle: encryptedData.amount, 
          contractAddress: CONTRACT_ADDRESS 
        }
      ];
      
      console.log('🔍 Handle-contract pairs:', handleContractPairs);

      // Create EIP712 signature
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signer = await signerPromise;
      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      // Decrypt the data
      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );

      console.log('🔍 Decryption result:', result);
      console.log('🔍 Amount handle:', encryptedData.amount);
      console.log('🔍 Decrypted amount:', result[encryptedData.amount]);

      return {
        amount: result[encryptedData.amount]?.toString() || '0',
        expiryTime: encryptedData.expiryTime?.toString() || '0', // This is not encrypted
        recipient: encryptedData.recipient,
        ngo: encryptedData.ngo,
        isRedeemed: encryptedData.isRedeemed,
        isActive: encryptedData.isActive,
        purpose: encryptedData.purpose,
        createdAt: encryptedData.createdAt
      };
    } catch (err) {
      console.error('Error decrypting voucher data:', err);
      throw err;
    }
  };

  const verifyNGO = async (ngoAddress: string, isVerified: boolean) => {
    try {
      console.log('verifyNGO called with:', { ngoAddress, isVerified });
      console.log('Contract address:', CONTRACT_ADDRESS);
      console.log('Current user address:', address);
      
      // Simple contract call without FHE dependencies
      const result = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'verifyNGO',
        args: [ngoAddress as `0x${string}`, isVerified],
        gas: 100000n, // Set explicit gas limit
      } as any);
      
      console.log('verifyNGO transaction result:', result);
      return result;
    } catch (err) {
      console.error('Error verifying NGO:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err?.message);
      console.error('Error code:', err?.code);
      throw err;
    }
  };

  return {
    registerNGO,
    createVoucher,
    redeemVoucher,
    createDistribution,
    decryptVoucherData,
    verifyNGO,
    hash,
    isPending,
    error,
  };
};

export const useNGOInfo = (ngoAddress: string) => {
  console.log('useNGOInfo Debug:');
  console.log('- ngoAddress:', ngoAddress);
  console.log('- ngoAddress type:', typeof ngoAddress);
  console.log('- ngoAddress length:', ngoAddress?.length);
  console.log('- CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
  console.log('- Contract ABI available:', !!AidWellConnect.abi);
  
  // Only call contract if ngoAddress is valid and not empty
  const isValidAddress = ngoAddress && 
                         ngoAddress.trim() !== '' && 
                         ngoAddress.length === 42 && 
                         ngoAddress.startsWith('0x');
  
  console.log('- isValidAddress:', isValidAddress);
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getNGOInfo',
    args: [ngoAddress as `0x${string}`],
    query: {
      enabled: isValidAddress
    }
  });

  console.log('useNGOInfo Result:');
  console.log('- data:', data);
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- isValidAddress:', isValidAddress);

  return { data, isLoading, error, refetch };
};

export const useVoucherInfo = (voucherId: number) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getVoucherInfo',
    args: [BigInt(voucherId)],
  });

  return { data, isLoading, error };
};

export const useRecipientVouchers = (recipientAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getRecipientVouchers',
    args: [recipientAddress as `0x${string}`],
  });

  return { data, isLoading, error };
};

export const useAllVouchers = () => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getAllVouchers',
  });

  return { data, isLoading, error };
};

export const useNGODistributions = (ngoAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getNGODistributions',
    args: [ngoAddress as `0x${string}`],
  });

  return { data, isLoading, error };
};

export const useVoucherEncryptedData = (voucherId: number) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getVoucherEncryptedData',
    args: [BigInt(voucherId)],
  });

  return { data, isLoading, error };
};
