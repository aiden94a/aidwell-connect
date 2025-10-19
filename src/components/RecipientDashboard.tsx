import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Clock, CheckCircle, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAccount } from 'wagmi';
import { useRecipientVouchers, useAidWellContract, useVoucherInfo } from "@/hooks/useContract";
import { useZamaInstance } from "@/hooks/useZamaInstance";
import { useState, useEffect } from "react";

const RecipientDashboard = () => {
  const { address } = useAccount();
  const { data: voucherIds, isLoading: loadingVoucherIds } = useRecipientVouchers(address || '');
  const { redeemVoucher, isPending, decryptVoucherData } = useAidWellContract();
  const { instance } = useZamaInstance();
  const [decryptedVouchers, setDecryptedVouchers] = useState<Record<number, any>>({});
  const [decrypting, setDecrypting] = useState<Record<number, boolean>>({});

  const handleRedeemVoucher = async (voucherId: number) => {
    try {
      await redeemVoucher(voucherId);
    } catch (error) {
      console.error('Error redeeming voucher:', error);
    }
  };

  const handleDecryptVoucher = async (voucherId: number) => {
    if (!instance) {
      alert('Encryption service not available');
      return;
    }

    setDecrypting(prev => ({ ...prev, [voucherId]: true }));
    try {
      const decryptedData = await decryptVoucherData(voucherId);
      setDecryptedVouchers(prev => ({
        ...prev,
        [voucherId]: decryptedData
      }));
    } catch (error) {
      console.error('Error decrypting voucher:', error);
      alert('Failed to decrypt voucher data');
    } finally {
      setDecrypting(prev => ({ ...prev, [voucherId]: false }));
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  // VoucherCard component for individual voucher display
  const VoucherCard = ({ voucherId }: { voucherId: number }) => {
    const { data: voucherInfo, isLoading: loadingVoucher } = useVoucherInfo(voucherId);
    
    if (loadingVoucher) {
      return (
        <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading voucher...</span>
          </div>
        </div>
      );
    }

    if (!voucherInfo) {
      return null;
    }

    const [amount, expiryTime, recipient, ngo, isRedeemed, isActive, purpose, createdAt] = voucherInfo;
    const status = isRedeemed ? "Used" : isActive ? "Available" : "Expired";
    const timestamp = formatTimestamp(createdAt);

    return (
      <div className="p-4 bg-muted/20 rounded-lg border border-border/40 transition-smooth hover:shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-soft rounded">
              {status === "Available" ? (
                <Gift className="h-4 w-4 text-primary" />
              ) : status === "Used" ? (
                <CheckCircle className="h-4 w-4 text-secondary" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <h4 className="font-medium">NGO #{Number(ngo).toString().slice(-4)}</h4>
              <p className="text-sm text-muted-foreground">{purpose}</p>
            </div>
          </div>
          
          <Badge
            variant={status === "Available" ? "default" : "secondary"}
            className={
              status === "Available"
                ? "bg-accent text-accent-foreground"
                : status === "Used"
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground"
            }
          >
            {status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Amount: </span>
            <code className="font-mono bg-muted px-2 py-1 rounded text-xs">
              {decryptedVouchers[voucherId]?.amount || "***"}
            </code>
            {!decryptedVouchers[voucherId] && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDecryptVoucher(voucherId)}
                disabled={decrypting[voucherId] || !instance}
                className="ml-2"
              >
                {decrypting[voucherId] ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{timestamp}</span>
            {status === "Available" && (
              <Button
                size="sm"
                onClick={() => handleRedeemVoucher(voucherId)}
                disabled={isPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isPending ? "Redeeming..." : "Redeem"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Received Vouchers */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-soft rounded-lg">
            <Gift className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold text-xl">Your Aid Vouchers</h3>
        </div>

        {loadingVoucherIds ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Loading your vouchers...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {voucherIds && voucherIds.length > 0 ? (
              voucherIds.map((voucherId: bigint) => (
                <VoucherCard key={Number(voucherId)} voucherId={Number(voucherId)} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No vouchers received yet</p>
                <p className="text-sm">Connect your wallet to start receiving aid</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecipientDashboard;