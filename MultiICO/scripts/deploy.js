async function main() {
    // We get the contract to deploy
    const ICOPlatform = await ethers.getContractFactory("ICOPlatform");
    const iCOPlatform = await ICOPlatform.deploy();
  
    await iCOPlatform.deployed();
  
    console.log("Contract deployed to:", iCOPlatform.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });