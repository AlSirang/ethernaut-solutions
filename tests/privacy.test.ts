import { expect } from "chai";
import { ethers } from "hardhat";
import { Privacy } from "../typechain";

describe("privacy.test", function () {
  let privacy: Privacy;

  before(async () => {
    const PrivacyFactory = await ethers.getContractFactory(
      "contracts/Privacy.sol:Privacy"
    );
    privacy = (await PrivacyFactory.deploy([
      "0x9565491970c6ae3d8f3992d179a904a60a5e6112da471ebdb996f6f2ceccc4b5",
      "0xde43a1b2c54a5f4cb2a658dd413eb2c060cfdd0415b8817be073df2c9f11aacc",
      "0x7418ebdc7f2adffc2f96b741d27b6ac71fb91d7685d3e4e60812535fb5be6d03",
    ])) as Privacy;
  });

  it("Lock should be true before attack", async () => {
    expect(await privacy.locked()).to.eq(true);
  });

  it("on attack", async function () {
    // bool public locked = true; // at storage slot 0
    // uint256 public ID = block.timestamp; // at storage slot 1
    // uint8 private flattening = 10; // at storage slot 2 packed
    // uint8 private denomination = 255; // at storage slot 2 packed
    // uint16 private awkwardness = uint16(block.timestamp); // at storage slot 2 packed
    // bytes32[3] private data; // at storage slot 3,4,5

    const valueAtSlot4 = await ethers.provider.getStorageAt(privacy.address, 5); // returns value of data[2]

    // Convert bytes32 to bytes16
    const bytes16Value = ethers.utils.hexDataSlice(valueAtSlot4, 0, 16);

    await privacy.unlock(bytes16Value);

    expect(await privacy.locked()).to.eq(false);
  });
});
