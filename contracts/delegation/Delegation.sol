// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDelegate {
    function pwn() external;
}

contract Delegation {
    address public owner;
    IDelegate delegate;

    constructor(address _delegateAddress) {
        delegate = IDelegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        (bool result, ) = address(delegate).delegatecall(msg.data);

        require(result, "delegate call failed");
    }
}
