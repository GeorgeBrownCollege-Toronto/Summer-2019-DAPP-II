// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Escrow {
    // 1. Setup
    address public depositor;
    address public beneficiary;
    address public arbiter;
    
    // 2. Constructor
    // 3. Funding
    constructor(address _arbiter, address _beneficiary) payable {
        // 2. Store address
        depositor = msg.sender;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
    }

    function approve() external payable {
        // 5. Security
        require(msg.sender == arbiter);
        // 4. Approval
        payable(beneficiary).transfer(address(this).balance);
    }
}