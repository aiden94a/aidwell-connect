import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Users, ArrowRight } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NGODashboard from "@/components/NGODashboard";
import RecipientDashboard from "@/components/RecipientDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import Logo from "@/components/Logo";
import heroImage from "@/assets/hero-aid-distribution.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-care">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={true} />
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("overview")}
                  className="hover:bg-primary-soft"
                >
                  Overview
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("ngo")}
                  className="hover:bg-hope-soft"
                >
                  For NGOs
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("recipients")}
                  className="hover:bg-accent-soft"
                >
                  For Recipients
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("admin")}
                  className="hover:bg-blue-soft"
                >
                  Admin
                </Button>
              </nav>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ngo">NGOs</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
                  Aid Distribution with Dignity & Privacy
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Empowering NGOs to distribute encrypted vouchers to recipients, ensuring aid delivery is completely trackable while amounts remain private and secure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
                    onClick={() => setActiveTab("ngo")}
                  >
                    Start as NGO
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary-soft"
                    onClick={() => setActiveTab("recipients")}
                  >
                    I'm a Recipient
                  </Button>
                </div>
              </div>
            </section>

            {/* Hero Image */}
            <section className="max-w-5xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-card">
                <img
                  src={heroImage}
                  alt="People receiving digital aid with dignity and privacy"
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-6 shadow-card border-border/40">
                <div className="p-3 bg-primary-soft rounded-lg w-fit mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All voucher amounts are encrypted end-to-end. Recipients maintain their dignity while NGOs ensure transparent distribution.
                </p>
              </Card>

              <Card className="p-6 shadow-card border-border/40">
                <div className="p-3 bg-hope-soft rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6 text-hope" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Trackable Aid</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every distribution is recorded on the blockchain, ensuring complete transparency and accountability for donors and organizations.
                </p>
              </Card>

              <Card className="p-6 shadow-card border-border/40">
                <div className="p-3 bg-accent-soft rounded-lg w-fit mb-4">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Dignified Process</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Recipients connect their wallets and receive aid without exposing sensitive financial information to the public.
                </p>
              </Card>
            </section>
          </TabsContent>

          {/* NGO Dashboard */}
          <TabsContent value="ngo" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">NGO Distribution Center</h2>
              <p className="text-muted-foreground">
                Distribute encrypted aid vouchers to recipients while maintaining complete transparency and privacy.
              </p>
            </div>
            <NGODashboard />
          </TabsContent>

          {/* Recipient Dashboard */}
          <TabsContent value="recipients" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Recipient Aid Center</h2>
              <p className="text-muted-foreground">
                Connect your wallet to receive and manage your encrypted aid vouchers safely and privately.
              </p>
            </div>
            <RecipientDashboard />
          </TabsContent>

          {/* Admin Dashboard */}
          <TabsContent value="admin" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
              <p className="text-muted-foreground">
                Manage NGO registrations and verifications for the aid distribution platform.
              </p>
            </div>
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Built with dignity, privacy, and transparency in mind</p>
            <p className="text-sm">Empowering humanitarian aid through blockchain technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;