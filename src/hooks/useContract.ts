import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AidWellConnect } from '../contracts/AidWellConnect';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';

// Contract address - deployed to Sepolia with aiden94a account
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x405cA05ddb063ea9040BA956157F234c029B263A';

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
      });
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
      // Create encrypted input
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(amount);
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
      const proof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createVoucher',
        args: [recipient, handles[0], expiryTime, purpose, proof],
      });
    } catch (err) {
      console.error('Error creating voucher:', err);
      throw err;
    }
  };

  const redeemVoucher = async (voucherId: number) => {
    try {
      await writeContractAsync({
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
      const proof = `0x${Array.from(encryptedInput.inputProof)
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: AidWellConnect.abi,
        functionName: 'createDistribution',
        args: [recipients, handles, purpose, proof],
      });
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
      
      // Create keypair for decryption
      const keypair = instance.generateKeypair();
      
      // Prepare handle-contract pairs
      const handleContractPairs = [
        { handle: encryptedData.amount, contractAddress: CONTRACT_ADDRESS },
        { handle: encryptedData.expiryTime, contractAddress: CONTRACT_ADDRESS }
      ];

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

      return {
        amount: result[encryptedData.amount]?.toString(),
        expiryTime: result[encryptedData.expiryTime]?.toString(),
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

  return {
    registerNGO,
    createVoucher,
    redeemVoucher,
    createDistribution,
    decryptVoucherData,
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
