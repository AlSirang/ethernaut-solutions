// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElevator {
    function goTo(uint) external;
}

contract Building {
    bool public lastFloor = false;

    IElevator elevator;

    constructor(address _to) {
        elevator = IElevator(_to);
    }

    function isLastFloor(uint) public returns (bool _lastFloor) {
        _lastFloor = lastFloor;
        lastFloor = !lastFloor;
    }

    function goTo(uint _floor) public {
        elevator.goTo(_floor);
    }
}
