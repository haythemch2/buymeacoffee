const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Sepolia.
  const contractAddress="0xd8678bA2e80fAAAFEcE847F94A3eD585779DBb99";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.AlchemyProvider("sepolia", process.env.SEPOLIA_API_KEY);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  const signerAddrees = await signer.getAddress()
  const verifiedContractAddress = await buyMeACoffee.getAddress()

  console.log("current balance of owner: ", await getBalance(provider, signerAddrees), "ETH");
  const contractBalance = await getBalance(provider, verifiedContractAddress);
  console.log("current balance of contract: ", await getBalance(provider, verifiedContractAddress), "ETH");

  // Withdraw funds if there are funds to withdraw.
  // Avoid attempting to withdraw so that we don't spend gas fees unnecessarily.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("final balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });