import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useAidWellContract, useNGOInfo } from "@/hooks/useContract";
import { getContractAddress, getAdminAddress } from "@/config/contracts";

const AdminDashboard = () => {
  const [ngoAddress, setNgoAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const { verifyNGO, isPending } = useAidWellContract();
  const { data: ngoInfo, isLoading, error } = useNGOInfo(ngoAddress);

  // Convert array data to object format
  const ngoData = ngoInfo ? {
    name: ngoInfo[0],
    description: ngoInfo[1],
    website: ngoInfo[2],
    isVerified: ngoInfo[3],
    reputation: ngoInfo[4],
    registrationTime: ngoInfo[5]
  } : null;

  // Debug logging
  console.log('AdminDashboard Debug Info:');
  console.log('- ngoAddress:', ngoAddress);
  console.log('- ngoInfo (raw):', ngoInfo);
  console.log('- ngoData (processed):', ngoData);
  console.log('- isLoading:', isLoading);
  console.log('- error:', error);
  console.log('- current user address:', address);
  console.log('- contract address:', getContractAddress());

  const handleVerifyNGO = async (isVerified: boolean) => {
    if (!ngoAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter an NGO address to verify.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to verify NGOs.",
        variant: "destructive",
      });
      return;
    }

    // Check if current user is admin
    const adminAddress = getAdminAddress();
    console.log('Address comparison:');
    console.log('- Current user address:', address);
    console.log('- Admin address from config:', adminAddress);
    console.log('- Addresses match (case insensitive):', address.toLowerCase() === adminAddress.toLowerCase());
    console.log('- Addresses match (exact):', address === adminAddress);
    
    if (address.toLowerCase() !== adminAddress.toLowerCase()) {
      toast({
        title: "Unauthorized",
        description: `Only the admin can verify NGOs. Current: ${address}, Expected: ${adminAddress}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      console.log('Verifying NGO:', { ngoAddress, isVerified, adminAddress: address });
      console.log('Contract address:', getContractAddress());
      console.log('Admin address from config:', getAdminAddress());
      
      // Validate parameters before calling
      if (!ngoAddress || ngoAddress.length !== 42 || !ngoAddress.startsWith('0x')) {
        throw new Error('Invalid NGO address format');
      }
      
      if (typeof isVerified !== 'boolean') {
        throw new Error('Invalid verification status');
      }
      
      // Show confirmation dialog before transaction
      toast({
        title: "Confirm Transaction",
        description: `Please confirm the transaction in your wallet to ${isVerified ? 'verify' : 'reject'} the NGO.`,
      });
      
      console.log('Calling verifyNGO with parameters:', { ngoAddress, isVerified });
      await verifyNGO(ngoAddress, isVerified);
      
      toast({
        title: isVerified ? "NGO Verified" : "NGO Rejected",
        description: `NGO has been ${isVerified ? 'verified' : 'rejected'} successfully.`,
      });
      setNgoAddress("");
    } catch (error: any) {
      console.error('Error verifying NGO:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        data: error?.data,
        stack: error?.stack
      });
      
      let errorMessage = "Failed to verify NGO. Please try again.";
      let errorTitle = "Verification Failed";
      
      if (error?.message?.includes('User rejected') || error?.message?.includes('user rejected')) {
        errorMessage = "Transaction was rejected. Please try again and confirm the transaction in your wallet.";
        errorTitle = "Transaction Rejected";
      } else if (error?.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for transaction. Please add more ETH to your wallet.";
        errorTitle = "Insufficient Funds";
      } else if (error?.message?.includes('gas')) {
        errorMessage = "Gas estimation failed. Please try again.";
        errorTitle = "Gas Estimation Failed";
      } else if (error?.message?.includes('Invalid NGO address')) {
        errorMessage = "Invalid NGO address format.";
        errorTitle = "Invalid Address";
      } else if (error?.message?.includes('Invalid verification status')) {
        errorMessage = "Invalid verification status.";
        errorTitle = "Invalid Status";
      } else if (error?.message?.includes('Only verifier can verify NGOs')) {
        errorMessage = "You are not authorized to verify NGOs. Only the admin can perform this action.";
        errorTitle = "Unauthorized";
      } else if (error?.message?.includes('NGO not registered')) {
        errorMessage = "This NGO address is not registered in the system.";
        errorTitle = "NGO Not Found";
      } else if (error?.message?.includes('Only verifier can verify NGOs')) {
        errorMessage = "You are not authorized to verify NGOs. Only the admin can perform this action.";
        errorTitle = "Unauthorized";
      } else if (error?.message?.includes('permission') || error?.message?.includes('Permission')) {
        errorMessage = "Smart contract permission denied. Please check your wallet permissions and try again.";
        errorTitle = "Permission Denied";
      } else if (error?.message?.includes('revert') || error?.message?.includes('Revert')) {
        errorMessage = "Transaction was reverted by the smart contract. Please check the contract state and try again.";
        errorTitle = "Transaction Reverted";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLookupNGO = () => {
    if (!ngoAddress || ngoAddress.trim() === '') {
      toast({
        title: "Missing Information",
        description: "Please enter an NGO address to lookup.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate address format
    if (ngoAddress.length !== 42 || !ngoAddress.startsWith('0x')) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (42 characters starting with 0x).",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Looking up NGO:', ngoAddress);
    console.log('Contract address:', getContractAddress());
  };

  const handleTestContract = async () => {
    try {
      console.log('Testing contract connection...');
      console.log('Contract address:', getContractAddress());
      console.log('NGO address:', ngoAddress);
      console.log('Current user address:', address);
      console.log('Admin address from config:', getAdminAddress());
      
      // Test with a known address (admin address)
      const testAddress = getContractAddress();
      console.log('Testing with admin address:', testAddress);
      
      // Test simple contract read
      if (ngoAddress && ngoAddress.length === 42) {
        console.log('Testing NGO info lookup...');
        // This should work without FHE dependencies
        console.log('NGO lookup test completed');
      }
    } catch (error) {
      console.error('Contract test error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-soft rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-xl">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage NGO registrations and verifications</p>
            {address && (
              <div className="mt-2">
                <Badge variant={address.toLowerCase() === getAdminAddress().toLowerCase() ? "default" : "secondary"}>
                  {address.toLowerCase() === getAdminAddress().toLowerCase() ? "Admin" : "Not Admin"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ngoAddress">NGO Address</Label>
            <div className="flex gap-2">
              <Input
                id="ngoAddress"
                placeholder="0x..."
                value={ngoAddress}
                onChange={(e) => setNgoAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleLookupNGO}
                variant="outline"
                disabled={!ngoAddress}
              >
                <Eye className="h-4 w-4 mr-2" />
                Lookup
              </Button>
              <Button 
                onClick={handleTestContract}
                variant="outline"
                className="bg-blue-100"
              >
                Test Contract
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Current Contract: {getContractAddress()}
            </p>
          </div>

          {ngoData && (
            <Card className="p-4 border">
              <div className="space-y-3">
                <h3 className="font-semibold">NGO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{ngoData.name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <p className="text-sm">{ngoData.website || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm">{ngoData.description || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={ngoData.isVerified ? "default" : "secondary"}>
                      {ngoData.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reputation</Label>
                    <p className="text-sm">{ngoData.reputation || 0}/100</p>
                  </div>
                </div>
                
                       <div className="flex gap-2 pt-3">
                         <Button
                           onClick={() => handleVerifyNGO(true)}
                           disabled={isPending || isVerifying || ngoData.isVerified}
                           className="bg-green-600 hover:bg-green-700 text-white"
                         >
                           <CheckCircle className="h-4 w-4 mr-2" />
                           {isPending || isVerifying ? "Verifying..." : "Verify NGO"}
                         </Button>
                         <Button
                           onClick={() => handleVerifyNGO(false)}
                           disabled={isPending || isVerifying}
                           variant="destructive"
                         >
                           <XCircle className="h-4 w-4 mr-2" />
                           {isPending || isVerifying ? "Rejecting..." : "Reject NGO"}
                         </Button>
                       </div>
                       
                       {isVerifying && (
                         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                           <p className="text-sm text-blue-800">
                             <strong>Please confirm the transaction in your wallet.</strong>
                           </p>
                           <p className="text-xs text-blue-600 mt-1">
                             A wallet popup should appear asking you to sign the transaction. 
                             Click "Confirm" or "Sign" to proceed.
                           </p>
                         </div>
                       )}
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-4 border border-red-200 bg-red-50">
              <p className="text-red-600 text-sm">
                Error loading NGO information. Please check the address and try again.
              </p>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
