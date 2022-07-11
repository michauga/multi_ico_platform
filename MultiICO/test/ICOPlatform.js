const { expect } = require("chai");

describe("USDT Contract", function () {

  let IcoPlatform;
  let icoPlatform;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  beforeEach(async function () {

    IcoPlatform = await ethers.getContractFactory("ICOPlatform");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    icoPlatform = await IcoPlatform.deploy();
  });

//   describe("Deployment", function () {

//     it("Should assign the total supply of tokens to the owner", async function () {
//       const ownerBalance = await usdt.balanceOf(owner.address);
//       expect(await usdt.totalSupply()).to.equal(ownerBalance);
//     });
//   });

//   describe("Transactions", function () {
//     it("Should transfer tokens between accounts", async function () {

//       await usdt.transfer(addr1.address, 50);
//       const addr1Balance = await usdt.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(50);

//       await usdt.connect(addr1).transfer(addr2.address, 50);
//       const addr2Balance = await usdt.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });


//     it("Should update balances after transfers", async function () {
//       const initialOwnerBalance = await usdt.balanceOf(owner.address);

//       await usdt.transfer(addr1.address, 100);

//       await usdt.transfer(addr2.address, 50);

//       const finalOwnerBalance = await usdt.balanceOf(owner.address);
//       expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

//       const addr1Balance = await usdt.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(100);

//       const addr2Balance = await usdt.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });
//   });
});