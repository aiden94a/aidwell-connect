import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Send, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useAidWellContract, useNGOInfo, useNGODistributions } from "@/hooks/useContract";

const NGODashboard = () => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [voucherAmount, setVoucherAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [ngoDescription, setNgoDescription] = useState("");
  const [ngoWebsite, setNgoWebsite] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();
  const { registerNGO, createVoucher, isPending } = useAidWellContract();
  const { data: ngoInfo, isLoading: ngoLoading, refetch: refetchNGOInfo } = useNGOInfo(address || '');
  const { data: distributions } = useNGODistributions(address || '');

  // Convert array data to object format (same as AdminDashboard)
  const ngoData = ngoInfo ? {
    name: ngoInfo[0],
    description: ngoInfo[1],
    website: ngoInfo[2],
    isVerified: ngoInfo[3],
    reputation: ngoInfo[4],
    registrationTime: ngoInfo[5]
  } : null;

  // Debug logging
  console.log('NGODashboard Debug Info:');
  console.log('- ngoInfo (raw):', ngoInfo);
  console.log('- ngoData (processed):', ngoData);
  console.log('- isLoading:', ngoLoading);
  console.log('- error:', error);
  console.log('- current user address:', address);

  const handleRegisterNGO = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register NGO.",
        variant: "destructive",
      });
      return;
    }

    if (!ngoName || !ngoDescription || !ngoWebsite) {
      toast({
        title: "Missing Information",
        description: "Please fill in all NGO registration fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerNGO(ngoName, ngoDescription, ngoWebsite);
      toast({
        title: "NGO Registration Submitted",
        description: "Your NGO registration has been submitted for verification.",
      });
      setShowRegistrationForm(false);
      setNgoName("");
      setNgoDescription("");
      setNgoWebsite("");
      // Refresh NGO info to show updated status
      await refetchNGOInfo();
    } catch (error) {
      console.error('Error registering NGO:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register NGO. Please try again.",
        variant: "destructive",
      });
    }
  };

  const distributeVoucher = async () => {
    if (!recipientAddress || !voucherAmount || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please provide recipient address, voucher amount, and purpose.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to distribute vouchers.",
        variant: "destructive",
      });
      return;
    }

    try {
      const amount = parseFloat(voucherAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid positive number for the voucher amount.",
          variant: "destructive",
        });
        return;
      }
      
      await createVoucher(
        recipientAddress,
        amount,
        Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        purpose
      );

      setRecipientAddress("");
      setVoucherAmount("");
      setPurpose("");

      toast({
        title: "Voucher Distributed",
        description: "Encrypted voucher has been sent to the recipient.",
      });
    } catch (error) {
      console.error('Error distributing voucher:', error);
      toast({
        title: "Error",
        description: "Failed to distribute voucher. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show NGO registration status
  if (ngoLoading) {
    return <div>Loading NGO information...</div>;
  }

  // If no NGO info exists, show registration form
  if (!ngoData) {
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <div className="text-center space-y-4">
            <div className="p-3 bg-yellow-soft rounded-lg w-fit mx-auto">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-xl">NGO Registration Required</h3>
            <p className="text-muted-foreground">
              Your NGO needs to be registered and verified before you can distribute aid vouchers.
            </p>
            <Button 
              onClick={() => setShowRegistrationForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Register NGO
            </Button>
          </div>
        </Card>

        {showRegistrationForm && (
          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <h3 className="font-semibold text-xl">NGO Registration Form</h3>
              
              <div className="space-y-2">
                <Label htmlFor="ngoName">NGO Name</Label>
                <Input
                  id="ngoName"
                  placeholder="Enter your NGO name"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ngoDescription">Description</Label>
                <Input
                  id="ngoDescription"
                  placeholder="Describe your NGO's mission and activities"
                  value={ngoDescription}
                  onChange={(e) => setNgoDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ngoWebsite">Website</Label>
                <Input
                  id="ngoWebsite"
                  placeholder="https://your-ngo-website.com"
                  value={ngoWebsite}
                  onChange={(e) => setNgoWebsite(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleRegisterNGO}
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isPending ? "Registering..." : "Submit Registration"}
                </Button>
                <Button 
                  onClick={() => setShowRegistrationForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // If NGO exists but not verified, show pending status
  if (ngoData && !ngoData.isVerified) {
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <div className="text-center space-y-4">
            <div className="p-3 bg-orange-soft rounded-lg w-fit mx-auto">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-xl">NGO Registration Pending</h3>
            <p className="text-muted-foreground">
              Your NGO "{ngoData.name}" is registered and waiting for admin verification.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Pending Verification
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Once verified by an admin, you'll be able to distribute aid vouchers.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* NGO Status */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-soft rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">NGO Verified</h3>
            <p className="text-sm text-muted-foreground">{ngoData.name}</p>
          </div>
        </div>
      </Card>

      {/* Distribution Form */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-hope-soft rounded-lg">
            <Send className="h-5 w-5 text-hope" />
          </div>
          <h3 className="font-semibold text-xl">Distribute Aid Voucher</h3>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Wallet Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Voucher Amount (Encrypted)</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={voucherAmount}
              onChange={(e) => setVoucherAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Amount will be encrypted before distribution
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g., Emergency food aid, Medical supplies"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button 
            onClick={distributeVoucher}
            disabled={isPending}
            className="w-full bg-hope hover:bg-hope/90 text-hope-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isPending ? "Distributing..." : "Distribute Encrypted Voucher"}
          </Button>
        </div>
      </Card>

      {/* Recent Distributions */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary-soft rounded-lg">
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <h3 className="font-semibold text-xl">Recent Distributions</h3>
        </div>

        <div className="space-y-3">
          {distributions.map((dist) => (
            <div
              key={dist.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/40"
            >
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono bg-primary-soft px-2 py-1 rounded text-primary">
                  {dist.recipient}
                </code>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{dist.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{dist.amount}</span>
                <Badge
                  variant={dist.status === "Delivered" ? "default" : "secondary"}
                  className={
                    dist.status === "Delivered"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {dist.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NGODashboard;