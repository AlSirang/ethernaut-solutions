import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Reentrance, ReentranceAttack } from "../typechain";

describe("Reentrance Attack", function () {
  const INITIAL_BALANCE = ethers.utils.parseEther("100");
  let reentrance: Reentrance;
  let reentranceAttack: ReentranceAttack;
  let attacker: SignerWithAddress;

  before(async () => {
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    attacker = signers[1];

    const ReentranceFactory = await ethers.getContractFactory(
      "contracts/reentrance/Reentrance.sol:Reentrance",
      deployer
    );

    reentrance = (await ReentranceFactory.deploy({
      value: INITIAL_BALANCE,
    })) as Reentrance;
  });

  it("Balance before attack", async () => {
    expect(await ethers.provider.getBalance(reentrance.address)).to.eq(
      INITIAL_BALANCE
    );
  });

  it("on attack", async function () {
    const ReentranceAttackFactory = await ethers.getContractFactory(
      "contracts/reentrance/ReentranceAttack.sol:ReentranceAttack",
      attacker
    );

    reentranceAttack = (await ReentranceAttackFactory.deploy(
      reentrance.address,
      {
        value: ethers.utils.parseEther("1"),
      }
    )) as ReentranceAttack;
    const initialBalance = await ethers.provider.getBalance(attacker.address);

    await reentranceAttack.connect(attacker).attack();
    expect(await ethers.provider.getBalance(attacker.address)).to.gte(
      initialBalance.add(INITIAL_BALANCE)
    );
  });

  it("after attack", async function () {
    expect(await ethers.provider.getBalance(reentrance.address)).to.eq(0);
  });
});
