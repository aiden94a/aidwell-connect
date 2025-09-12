# Vercel Deployment Guide for AidWell Connect

This guide provides step-by-step instructions for deploying AidWell Connect to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with the AidWell Connect repository
- Environment variables ready

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project" on the dashboard
3. Import the `aiden94a/aidwell-connect` repository
4. Select the repository and click "Import"

## Step 2: Configure Project Settings

### Framework Preset
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Add the following environment variables in the Vercel dashboard:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

**Important**: These are sensitive values. Make sure to:
- Never commit these to GitHub
- Use Vercel's environment variables section
- Mark them as "Production" and "Preview" environments

## Step 3: Build Configuration

### Vite Configuration
The project uses Vite with the following configuration:
- **Base URL**: `/` (default)
- **Public Directory**: `public`
- **Build Directory**: `dist`

### Build Settings
- **Node.js Version**: 18.x (recommended)
- **Build Command**: `npm run build`
- **Development Command**: `npm run dev`

## Step 4: Domain Configuration

### Custom Domain (Optional)
1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains" section
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

### Default Vercel Domain
- Your app will be available at: `https://aidwell-connect-[random].vercel.app`
- You can customize the subdomain in project settings

## Step 5: Deployment Process

### Automatic Deployment
- Every push to the `main` branch triggers automatic deployment
- Preview deployments are created for pull requests
- Build logs are available in the Vercel dashboard

### Manual Deployment
1. Go to the "Deployments" tab in your project
2. Click "Redeploy" for the latest deployment
3. Or trigger a new deployment from the GitHub repository

## Step 6: Post-Deployment Configuration

### Smart Contract Integration
1. Deploy the FHE smart contract to Sepolia testnet
2. Update the contract address in `src/contracts/AidWellConnect.ts`
3. Redeploy the frontend with the new contract address

### Wallet Configuration
The app is configured to work with:
- **Network**: Sepolia Testnet (Chain ID: 11155111)
- **Wallets**: RainbowKit supports MetaMask, WalletConnect, Coinbase Wallet, etc.
- **RPC**: Infura and 1rpc.io endpoints

## Step 7: Testing the Deployment

### Local Testing
```bash
npm install
npm run dev
```

### Production Testing
1. Visit your Vercel deployment URL
2. Connect a wallet (MetaMask recommended)
3. Switch to Sepolia testnet
4. Test NGO registration and voucher distribution
5. Test recipient voucher redemption

## Step 8: Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor performance metrics
3. Track user interactions

### Error Monitoring
- Check Vercel function logs for server-side errors
- Monitor browser console for client-side errors
- Set up alerts for critical issues

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

#### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Verify values are correct for the environment

#### Wallet Connection Issues
- Verify WalletConnect Project ID is correct
- Check RPC URL accessibility
- Ensure network configuration matches

#### Smart Contract Issues
- Verify contract is deployed to Sepolia
- Check contract address is correct
- Ensure ABI matches the deployed contract

### Performance Optimization

#### Build Optimization
- Enable Vercel's automatic optimizations
- Use dynamic imports for large components
- Optimize images and assets

#### Caching
- Configure appropriate cache headers
- Use Vercel's edge caching
- Implement service worker for offline functionality

## Security Considerations

### Environment Variables
- Never expose sensitive keys in client-side code
- Use Vercel's environment variables for all secrets
- Regularly rotate API keys and tokens

### Smart Contract Security
- Audit FHE implementation
- Test thoroughly on testnet before mainnet
- Implement proper access controls

### Frontend Security
- Validate all user inputs
- Implement proper error handling
- Use HTTPS for all communications

## Support and Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Update smart contracts as needed

### Backup Strategy
- Regular database backups (if applicable)
- Version control for all code changes
- Document all configuration changes

## Contact Information

For technical support or questions:
- GitHub Issues: [aiden94a/aidwell-connect](https://github.com/aiden94a/aidwell-connect/issues)
- Documentation: See README.md in the repository

---

**Note**: This deployment guide assumes you have the necessary permissions and access to deploy to Vercel. Make sure to follow Vercel's terms of service and best practices for production deployments.
