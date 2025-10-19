export const AidWellConnect = {
  address: '0x2C71Ec0Eda008054Fe266a162133b189cf31c1Ef',
  abi: [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_verifier",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "distributionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "recipientCount",
        "type": "uint32"
      }
    ],
    "name": "DistributionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "NGORegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "NGOVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "VoucherCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "VoucherRedeemed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "externalEaddress[]",
        "name": "recipients",
        "type": "bytes32[]"
      },
      {
        "internalType": "externalEuint32[]",
        "name": "amounts",
        "type": "bytes32[]"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createDistribution",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEaddress",
        "name": "recipient",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint32",
        "name": "amount",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "expiryTime",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createVoucher",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributionCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "distributions",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "distributionId",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "totalAmount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "recipientCount",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVouchers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "distributionId",
        "type": "uint256"
      }
    ],
    "name": "getDistributionEncryptedData",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "distributionIdEnc",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "totalAmount",
        "type": "bytes32"
      },
      {
        "internalType": "euint32",
        "name": "recipientCount",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "distributionId",
        "type": "uint256"
      }
    ],
    "name": "getDistributionInfo",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "totalAmount",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "recipientCount",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "getNGODistributions",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "getNGOEncryptedData",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "euint32",
        "name": "reputation",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "registrationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "getNGOInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "reputation",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "registrationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "getNGOReputation",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "getRecipientVouchers",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      }
    ],
    "name": "getVoucherEncryptedData",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "amount",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "expiryTime",
        "type": "uint256"
      },
      {
        "internalType": "eaddress",
        "name": "recipient",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isRedeemed",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      }
    ],
    "name": "getVoucherInfo",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "amount",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "expiryTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isRedeemed",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "isNGOVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ngoDistributions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "ngoRegistrations",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "website",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "ngoAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "euint32",
        "name": "reputation",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "registrationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "recipientVouchers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      }
    ],
    "name": "redeemVoucher",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_website",
        "type": "string"
      }
    ],
    "name": "registerNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "euint32",
        "name": "reputation",
        "type": "bytes32"
      }
    ],
    "name": "updateNGOReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verifier",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "name": "verifyNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "voucherCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "vouchers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "voucherId",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "amount",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "expiryTime",
        "type": "uint256"
      },
      {
        "internalType": "eaddress",
        "name": "recipient",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isRedeemed",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
} as const;