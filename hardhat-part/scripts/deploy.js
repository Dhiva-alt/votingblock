const fs = require("fs");
const path = require("path");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.deployed();

  console.log("Voting contract deployed to:", voting.address);

  // Save the contract address to frontend
  const frontendDir = path.join(__dirname, "../frontend/src/contracts");

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify({ Voting: voting.address }, null, 2)
  );

  console.log("Contract address saved to frontend folder ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
