const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AidWellConnect contract...");

  // Get the contract factory
  const AidWellConnect = await ethers.getContractFactory("AidWellConnect");

  // Set the admin/verifier address
  const adminAddress = "0x3c7fae276c590a8df81ed320851c53db4bc39916";
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Admin/Verifier address:", adminAddress);
  
  if (!deployer.address) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  const aidWellConnect = await AidWellConnect.deploy(adminAddress);
  await aidWellConnect.waitForDeployment();

  const contractAddress = await aidWellConnect.getAddress();
  console.log("AidWellConnect deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    admin: adminAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Admin/Verifier:", adminAddress);
  console.log("Network: sepolia");
  console.log("Timestamp:", deploymentInfo.timestamp);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
