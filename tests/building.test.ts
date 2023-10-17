import { expect } from "chai";
import { ethers } from "hardhat";
import { Building, Elevator } from "../typechain";

describe("Elevator Attack", function () {
  let elevator: Elevator;
  let building: Building;

  before(async () => {
    const ElevatorFactory = await ethers.getContractFactory(
      "contracts/building/Elevator.sol:Elevator"
    );
    elevator = (await ElevatorFactory.deploy()) as Elevator;
    const BuildingFactory = await ethers.getContractFactory(
      "contracts/building/Building.sol:Building"
    );
    building = (await BuildingFactory.deploy(elevator.address)) as Building;
  });

  it("before attack", async () => {
    expect(await elevator.top()).to.eq(false);
  });

  it("on attack", async function () {
    await building.goTo(10);

    expect(await elevator.top()).to.eq(true);
  });
});
