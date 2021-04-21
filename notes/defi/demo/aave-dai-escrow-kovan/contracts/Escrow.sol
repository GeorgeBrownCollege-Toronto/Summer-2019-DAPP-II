//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.5;

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";

contract Escrow {
    address arbiter;
    address depositor;
    address beneficiary;
    // 3. principal amount
    uint principalAmount;
    ILendingPool pool;
    IERC20 aDai;
    IERC20 dai;

    constructor(ILendingPool _pool, IERC20 _aDai, IERC20 _dai, address _arbiter, address _beneficiary, uint _amount) {
		pool = _pool;
		aDai = _aDai;
		dai = _dai;
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        // 3.1 capture principalAmount
        principalAmount = _amount;
        // 1. Transfer DAI
        dai.transferFrom(depositor, address(this), _amount);
        // 2.1 Approve DAI
        dai.approve(address(pool), _amount);
        // 2.2 Deposit DAI
        pool.deposit(address(dai), _amount, address(this), uint16(0));
    }

    event Approved();


    function approve() external {
        // 3.2 Security: arbiter only
        require(msg.sender == arbiter);
        // 3.3 approve
        aDai.approve(address(pool), aDai.balanceOf(address(this)));
        // 3.4 withdraw
        pool.withdraw(address(dai), principalAmount, beneficiary);
        // 4. Approve interest
        pool.withdraw(address(dai), type(uint).max, depositor);
        emit Approved();
    }
}
