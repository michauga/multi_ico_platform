const { expect } = require("chai");

describe("ICOToken Contract", function () {

  let IcoToken;
  let icoToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;


  beforeEach(async function () {

    IcoToken = await ethers.getContractFactory("ICOToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    icoToken = await IcoToken.deploy();
  });

  describe("Deployment", function () {

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await icoToken.balanceOf(owner.address);
      expect(await icoToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {

      await icoToken.transfer(addr1.address, 50);
      const addr1Balance = await icoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await icoToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await icoToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });


    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await icoToken.balanceOf(owner.address);

      await icoToken.transfer(addr1.address, 100);

      await icoToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await icoToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await icoToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await icoToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Additional features", function () {
    it("Should decrease total supply after burning tokens", async function () {
        const tokensToBurn = 100;
        const totalSupplyBefore = await icoToken.totalSupply();
        await icoToken.burn(tokensToBurn);
        const totalSupplyAfter = await icoToken.totalSupply();

        expect(totalSupplyAfter).to.equal(totalSupplyBefore.sub(tokensToBurn));

      });
  });

});