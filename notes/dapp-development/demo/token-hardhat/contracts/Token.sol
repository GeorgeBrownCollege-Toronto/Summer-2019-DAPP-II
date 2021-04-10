// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import "hardhat/console.sol";

contract Token {
    string public name = "GBC Token";
    string public symbol = "GBC";

    uint256 public totalSupply = 10000;

    address public owner;

    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _amount) public {
        console.log("Sender balance is %s tokens",balances[msg.sender]);
        console.log("Trying to send %s tokens to %s",_amount, _to);
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }
}