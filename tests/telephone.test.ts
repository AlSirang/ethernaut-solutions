import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Telephone, TelephoneAttack } from "../typechain";

describe("Telephone Attack", function () {
  let telephone: Telephone;
  let telephoneAttack: TelephoneAttack;
  let telephoneOwner: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    const signers = await ethers.getSigners();
    telephoneOwner = signers[0];
    attacker = signers[1];

    const TelephoneFactory = await ethers.getContractFactory(
      "contracts/telephone/Telephone.sol:Telephone"
    );

    telephone = (await TelephoneFactory.deploy()) as Telephone;

    const TelephoneAttackFactory = await ethers.getContractFactory(
      "contracts/telephone/TelephoneAttack.sol:TelephoneAttack",
      attacker
    );

    telephoneAttack = (await TelephoneAttackFactory.deploy(
      telephone.address
    )) as TelephoneAttack;
  });

  it("Telephone owner before attack", async () => {
    expect(await telephone.owner()).to.eq(telephoneOwner.address);
  });

  it("on attack", async function () {
    await telephoneAttack.changeOwner();

    expect(await telephone.owner()).to.eq(attacker.address);
  });
});
