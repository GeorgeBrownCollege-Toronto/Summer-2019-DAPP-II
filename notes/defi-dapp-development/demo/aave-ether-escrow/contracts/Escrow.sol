//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.5;

import "./IERC20.sol";
import "./IWETHGateway.sol";

contract Escrow {
    address arbiter;
    address depositor;
    address beneficiary;
    // 4.2 Pay
    uint256 principalAmount;
    
    IWETHGateway gateway = IWETHGateway(0xDcD33426BA191383f1c9B431A342498fdac73488);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        // 4.3 Pay
        principalAmount = msg.value;

        // 1. Deposit
        gateway.depositETH{value:principalAmount}(address(this), uint16(0));

    }

    function approve() external { 
        require(msg.sender == arbiter);
        // 2. Allowance
        aWETH.approve(address(gateway), aWETH.balanceOf(address(this)));
        // 3. withdraw
        gateway.withdrawETH(aWETH.balanceOf(address(this)), address(this));
    }

    // 4.1 Accept Ether
    receive() payable external {
        // 4.4 Pay
        payable(beneficiary).transfer(principalAmount);
        // 5. Interest
        payable(depositor).transfer(address(this).balance);
    }
}
