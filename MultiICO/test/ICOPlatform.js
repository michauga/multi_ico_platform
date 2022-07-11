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
});