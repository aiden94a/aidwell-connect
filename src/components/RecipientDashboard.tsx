import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Clock, CheckCircle, Shield } from "lucide-react";
import { useAccount } from 'wagmi';
import { useRecipientVouchers, useAidWellContract } from "@/hooks/useContract";
import WalletConnect from "./WalletConnect";

const RecipientDashboard = () => {
  const { address } = useAccount();
  const { data: voucherIds, isLoading } = useRecipientVouchers(address || '');
  const { redeemVoucher, isPending } = useAidWellContract();

  const handleRedeemVoucher = async (voucherId: number) => {
    try {
      await redeemVoucher(voucherId);
    } catch (error) {
      console.error('Error redeeming voucher:', error);
    }
  };

  // Mock data for demonstration - in real app, this would come from contract
  const receivedVouchers = [
    {
      id: "1",
      from: "Red Cross International",
      amount: "***",
      status: "Available",
      timestamp: "2 hours ago",
      type: "Food Aid",
    },
    {
      id: "2",
      from: "UNICEF",
      amount: "***",
      status: "Used",
      timestamp: "1 day ago",
      type: "Medical Aid",
    },
    {
      id: "3",
      from: "World Food Programme",
      amount: "***",
      status: "Available",
      timestamp: "3 days ago",
      type: "Emergency Aid",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <WalletConnect />

      {/* Received Vouchers */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-soft rounded-lg">
            <Gift className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-xl">Your Aid Vouchers</h3>
        </div>

        <div className="space-y-4">
          {receivedVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="p-4 bg-muted/20 rounded-lg border border-border/40 transition-smooth hover:shadow-soft"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-soft rounded">
                    {voucher.status === "Available" ? (
                      <Gift className="h-4 w-4 text-primary" />
                    ) : voucher.status === "Used" ? (
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{voucher.from}</h4>
                    <p className="text-sm text-muted-foreground">{voucher.type}</p>
                  </div>
                </div>
                
                <Badge
                  variant={voucher.status === "Available" ? "default" : "secondary"}
                  className={
                    voucher.status === "Available"
                      ? "bg-accent text-accent-foreground"
                      : voucher.status === "Used"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {voucher.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Amount: </span>
                  <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
                    {voucher.amount}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{voucher.timestamp}</span>
                  {voucher.status === "Available" && (
                    <Button
                      size="sm"
                      onClick={() => handleRedeemVoucher(parseInt(voucher.id))}
                      disabled={isPending}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isPending ? "Redeeming..." : "Redeem"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {receivedVouchers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No vouchers received yet</p>
            <p className="text-sm">Connect your wallet to start receiving aid</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecipientDashboard;