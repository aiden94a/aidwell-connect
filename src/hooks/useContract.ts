import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AidWellConnect } from '../contracts/AidWellConnect';

// Contract address - this should be deployed and updated
const CONTRACT_ADDRESS = '0x...'; // Will be updated after deployment

export const useAidWellContract = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { data: hash, isPending, error } = useWriteContract();

  const registerNGO = async (name: string, description: string, website: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'registerNGO',
        args: [name, description, website],
      });
    } catch (err) {
      console.error('Error registering NGO:', err);
      throw err;
    }
  };

  const createVoucher = async (
    recipient: string,
    amount: any, // FHE encrypted amount
    expiryTime: number,
    purpose: string,
    inputProof: any
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createVoucher',
        args: [recipient, amount, expiryTime, purpose, inputProof],
      });
    } catch (err) {
      console.error('Error creating voucher:', err);
      throw err;
    }
  };

  const redeemVoucher = async (voucherId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'redeemVoucher',
        args: [voucherId],
      });
    } catch (err) {
      console.error('Error redeeming voucher:', err);
      throw err;
    }
  };

  const createDistribution = async (
    recipients: string[],
    amounts: any[], // FHE encrypted amounts
    purpose: string,
    inputProof: any
  ) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createDistribution',
        args: [recipients, amounts, purpose, inputProof],
      });
    } catch (err) {
      console.error('Error creating distribution:', err);
      throw err;
    }
  };

  return {
    registerNGO,
    createVoucher,
    redeemVoucher,
    createDistribution,
    hash,
    isPending,
    error,
  };
};

export const useNGOInfo = (ngoAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getNGOInfo',
    args: [ngoAddress],
  });

  return { data, isLoading, error };
};

export const useVoucherInfo = (voucherId: number) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getVoucherInfo',
    args: [voucherId],
  });

  return { data, isLoading, error };
};

export const useRecipientVouchers = (recipientAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getRecipientVouchers',
    args: [recipientAddress],
  });

  return { data, isLoading, error };
};

export const useNGODistributions = (ngoAddress: string) => {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: AidWellConnect.abi,
    functionName: 'getNGODistributions',
    args: [ngoAddress],
  });

  return { data, isLoading, error };
};
