import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Send ETH Forcefully", function () {
  let contract: Contract;

  before(async () => {
    const ForceFactory = await ethers.getContractFactory(
      "contracts/force/Force.sol:Force"
    );
    contract = await ForceFactory.deploy();
  });

  it("balance should be Zero of contract before attack", async () => {
    expect(await ethers.provider.getBalance(contract.address)).to.eq(0);
  });

  it("on attack", async function () {
    const ForceAttack = await ethers.getContractFactory(
      "contracts/force/ForceAttack.sol:ForceAttack"
    );
    await ForceAttack.deploy(contract.address, {
      value: 10000,
    });

    expect(await ethers.provider.getBalance(contract.address)).to.gt(0);
  });
});
