import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { King, KingAttack } from "../typechain";

describe("Access Private Varialbes", function () {
  const INITIAL_DEPOSIT = ethers.utils.parseEther("0.0001");
  let king: King;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let kingAttack: KingAttack;

  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    attacker = signers[1];

    const KingFactory = await ethers.getContractFactory(
      "contracts/king/King.sol:King",
      deployer
    );
    king = (await KingFactory.deploy({ value: INITIAL_DEPOSIT })) as King;
  });

  it("Vault should be lock before attack", async () => {
    expect(await king.owner()).to.eq(deployer.address);
  });

  it("on attack", async function () {
    const KingAttackFactory = await ethers.getContractFactory(
      "contracts/king/KingAttack.sol:KingAttack",
      attacker
    );
    kingAttack = (await KingAttackFactory.deploy(king.address, {
      value: INITIAL_DEPOSIT.mul(2),
    })) as KingAttack;

    expect(await king.king()).to.eq(kingAttack.address);
  });
  it("after attack", async function () {
    await expect(
      deployer.sendTransaction({
        to: king.address,
        from: deployer.address,
        value: INITIAL_DEPOSIT.mul(3),
      })
    ).to.rejected;
  });
});
