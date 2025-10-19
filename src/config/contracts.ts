// Contract addresses configuration
export const CONTRACT_ADDRESSES = {
  // Main contract address
  AIDWELL_CONNECT: import.meta.env.VITE_CONTRACT_ADDRESS || '0xA3C35568CdD5D9244F32B600F1C3181579Fd2e07',
  
  // Admin address
  ADMIN_ADDRESS: import.meta.env.VITE_ADMIN_ADDRESS || '0x3C7FAe276c590a8DF81eD320851C53DB4bC39916',
  
  // Deployer address
  DEPLOYER_ADDRESS: import.meta.env.VITE_DEPLOYER_ADDRESS || '0xd24987c1eD5a09e1cA2E908f69D24230A3D135d0',
  
  // Network configuration
  NETWORK: {
    SEPOLIA: {
      CHAIN_ID: 11155111,
      RPC_URL: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://1rpc.io/sepolia',
      EXPLORER_URL: 'https://sepolia.etherscan.io'
    }
  }
} as const;

// Contract ABI imports
export { AidWellConnect } from '../contracts/AidWellConnect';

// Helper functions
export const getContractAddress = () => CONTRACT_ADDRESSES.AIDWELL_CONNECT;
export const getAdminAddress = () => CONTRACT_ADDRESSES.ADMIN_ADDRESS;
export const getDeployerAddress = () => CONTRACT_ADDRESSES.DEPLOYER_ADDRESS;
