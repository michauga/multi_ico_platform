// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AToken is ERC20 {
    constructor() ERC20("Token A", "A"){
        _mint(msg.sender, 100000 ether);
    }
}