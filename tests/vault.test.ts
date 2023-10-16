import { expect } from "chai";
import { ethers } from "hardhat";
import { Vault } from "../typechain";

describe("Access Private Varialbes", function () {
  let vault: Vault;

  before(async () => {
    const strongPassword = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("this is strong password")
    );

    const VaultFactory = await ethers.getContractFactory(
      "contracts/Vault.sol:Vault"
    );
    vault = (await VaultFactory.deploy(strongPassword)) as Vault;
  });

  it("Vault should be lock before attack", async () => {
    expect(await vault.locked()).to.eq(true);
  });

  it("on attack", async function () {
    const password = await ethers.provider.getStorageAt(vault.address, 1);

    await vault.unlock(password);

    expect(await vault.locked()).to.eq(false);
  });
});
