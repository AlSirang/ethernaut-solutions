import { expect } from "chai";
import { ethers } from "hardhat";
import { GatekeeperOne, GatekeeperOneAttack } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Gatekeeper One Attack", function () {
  let gatekeeperOne: GatekeeperOne;

  let deployer: SignerWithAddress;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];

    const GatekeeperOneFactory = await ethers.getContractFactory(
      "contracts/gatekeeperOne/GatekeeperOne.sol:GatekeeperOne"
    );
    gatekeeperOne = (await GatekeeperOneFactory.deploy()) as GatekeeperOne;
  });

  it("before attack", async () => {
    expect(await gatekeeperOne.entrant()).to.eq(ethers.constants.AddressZero);
  });

  it("on attack", async function () {
    const GatekeeperOneAttackFactory = await ethers.getContractFactory(
      "contracts/gatekeeperOne/GatekeeperOneAttack.sol:GatekeeperOneAttack"
    );

    const gatekeeperOneAttack = (await GatekeeperOneAttackFactory.deploy(
      gatekeeperOne.address
    )) as GatekeeperOneAttack;

    await gatekeeperOneAttack.attack();
  });
  it("after attack", async function () {
    expect(await gatekeeperOne.entrant()).to.eq(deployer.address);
  });
});
