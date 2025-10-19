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
import { getContractAddress } from "@/config/contracts";

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

    try {
      setIsVerifying(true);
      await verifyNGO(ngoAddress, isVerified);
      toast({
        title: isVerified ? "NGO Verified" : "NGO Rejected",
        description: `NGO has been ${isVerified ? 'verified' : 'rejected'} successfully.`,
      });
      setNgoAddress("");
    } catch (error) {
      console.error('Error verifying NGO:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify NGO. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLookupNGO = () => {
    if (!ngoAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter an NGO address to lookup.",
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
      
      // Test with a known address (admin address)
      const testAddress = getContractAddress();
      console.log('Testing with admin address:', testAddress);
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
