import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Shield, CheckCircle } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useToast } from "@/hooks/use-toast";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been safely disconnected.",
    });
  };

  return (
    <Card className="p-6 shadow-card border-border/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-soft rounded-lg">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Digital Wallet</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Connect your wallet to receive encrypted aid vouchers securely and privately.
          </p>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button 
                          onClick={openConnectModal} 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button 
                          onClick={openChainModal} 
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-secondary" />
                          <span className="text-muted-foreground">Connected: </span>
                          <code className="text-primary font-mono text-xs bg-primary-soft px-2 py-1 rounded">
                            {account.displayName}
                          </code>
                        </div>
                        <Button 
                          onClick={openAccountModal} 
                          variant="outline"
                          className="w-full border-border hover:bg-muted"
                        >
                          Account
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your privacy is protected with end-to-end encryption</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">Connected: </span>
            <code className="text-primary font-mono text-xs bg-primary-soft px-2 py-1 rounded">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </code>
          </div>
          <Button 
            onClick={handleDisconnect} 
            variant="outline"
            className="w-full border-border hover:bg-muted"
          >
            Disconnect Wallet
          </Button>
        </div>
      )}
    </Card>
  );
};

export default WalletConnect;