import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.12",
      },
      {
        version: "0.8.7",
      },
    ],
  },
  paths: { tests: "tests" },
};

export default config;
