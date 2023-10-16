import { expect } from "chai";
import { ethers } from "hardhat";
import { CoinFlip, CoinFlipAttack } from "../typechain";
import { mine } from "@nomicfoundation/hardhat-network-helpers";

describe("CoinFlip Attack", function () {
  let coinFlip: CoinFlip;
  let coinFlipAttack: CoinFlipAttack;

  before(async () => {
    const CoinFlipFactory = await ethers.getContractFactory(
      "contracts/coinFlip/CoinFlip.sol:CoinFlip"
    );

    coinFlip = (await CoinFlipFactory.deploy()) as CoinFlip;
    await coinFlip.deployed();

    const CoinFlipAttackFactory = await ethers.getContractFactory(
      "contracts/coinFlip/CoinFlipAttack.sol:CoinFlipAttack"
    );

    coinFlipAttack = (await CoinFlipAttackFactory.deploy(
      coinFlip.address
    )) as CoinFlipAttack;
  });

  it("on attack", async function () {
    for (let i = 0; i < 10; i++) {
      console.log("Block ", await ethers.provider.getBlockNumber());
      await coinFlipAttack.flip();
      console.log(
        "consecutiveWins :",
        (await coinFlip.consecutiveWins()).toString()
      );

      await mine();
    }

    expect(await coinFlip.consecutiveWins()).to.gte(10);
  });
});
