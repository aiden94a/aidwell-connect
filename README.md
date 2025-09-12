# AidWell Connect

A decentralized aid distribution platform that empowers NGOs to distribute encrypted vouchers to recipients, ensuring aid delivery is completely trackable while amounts remain private and secure.

## Features

- **Privacy First**: All voucher amounts are encrypted end-to-end using FHE (Fully Homomorphic Encryption)
- **Trackable Aid**: Every distribution is recorded on the blockchain for complete transparency
- **Dignified Process**: Recipients maintain their dignity while NGOs ensure transparent distribution
- **Wallet Integration**: Seamless connection with popular Web3 wallets

## Technologies Used

This project is built with:

- **Frontend**: Vite, TypeScript, React
- **UI Components**: shadcn-ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Wallet**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity with FHE support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aiden94a/aidwell-connect.git
cd aidwell-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── NGODashboard.tsx
│   ├── RecipientDashboard.tsx
│   └── WalletConnect.tsx
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Smart Contracts

The project includes FHE-enabled smart contracts for:
- Encrypted voucher distribution
- Privacy-preserving aid tracking
- Transparent fund management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aidwell-connect.com or join our Discord community.