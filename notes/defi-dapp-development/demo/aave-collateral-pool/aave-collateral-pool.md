## AAVE Collateral Pool

Several colleagues decide they want to pool their funds together in a smart contract to create a collateral pool in case any of them want to borrow ERC20 assets. They want to earn interest on their collateral while also allowing borrowing against it.

We can build a smart contract to support this very use case! Let's learn how to pool collateral, earn interest and borrow against it in this code tutorial.

### 1. Collect DAI

#### Task

##### Membership Dues
Let's collect DAI from anyone seeking to join this collateral group. Prospective members will need to contribute 10,000 DAI in order to successfully join.

This DAI will serve as the collateral for any member who wishes to borrow against the group's assets. After all debts have been paid, members will be able to retrieve their initial deposit plus any interest earned.

##### 🏁 Your Goal: Collect DAI
The `constructor` accepts an array of member addresses as its only parameter. First things first, store this parameter in the `members` storage variable.

For each member in this array, transfer the required `depositAmount` from their address to the `CollateralGroup` smart contract.

### 2. Deposit

#### Task

##### Depositing Collateral
Now that all the members have paid their DAI deposit, we can deposit it all into the AAVE lending pool. This will allow us to start earning interest on the DAI and also allow it to serve as collateral for future borrows.

##### 🏁 Your Goal: Approve & Deposit
In the constructor, deposit all the collected DAI into the pool contract.

To do this, you will first need to approve the pool to spend our DAI.

Then, deposit the DAI into the pool contract. Deposit it on behalf of the collateral group contract and you can set the [referral code](https://docs.aave.com/developers/referral-program) to 0 or any valid code you'd like.

### 3. Withdraw

#### Task

##### Withdrawing
When members are ready to remove their funds, and there are no outstanding loans, anyone can call the `withdraw` function. This function should kick off a withdrawal for all members. For each member it should pay them back their initial deposit plus their share of any interest earned.

The CollateralGroup contract will be holding AAVE interest bearing DAI, or `aDai`, where the interest earned will be automatically reflected in the token balance. To figure out the share for each member, we can simply divide the total aDai balance by the number of members.

##### 🏁 Your Goal: Withdraw From Pool
In the `withdraw` function, withdraw the entire balance of `aDai` from the pool, distributing the appropriate share to each member who joined the collateral group.

Before you can call `withdraw` on the pool you will need to approve the `aDai` to be spent by the pool.

### 4. Borrow

#### Task

##### Borrowing ERC20s
After the members have transferred their DAI to the smart contract, let's allow any member to borrow against it. Let's support any ERC20 token that has reserves in the AAVE system.

##### 🏁 Your Goal: Borrow ERC20s
In the CollateralGroup `borrow` function, call `borrow` on the AAVE `pool` to borrow the `amount` of `asset` specified by the arguments. Be sure to set the `onBehalfOf` to the collateral group contract, this way the debt is incurred to the smart contract which holds the collateral. You can set the referral code as you wish and the `interestRateMode` should either be `1` for stable or `2` for variable rates.

> 📖 Learn the difference between stable and variable loans [here](https://docs.aave.com/faq/borrowing#what-is-the-difference-between-stable-and-variable-rate).

Once you have borrowed the asset, you will need to transfer the ERC20 to the function caller so they can use it. You can use the `IERC20` interface to call the asset ERC20 contract in order to make this transfer.

### 5. Repay

#### Task

##### Repay Loan
When a member is ready to repay their loan, they need to call the repay function. Before calling this function they will need to approve the collateral group to spend the particular asset, otherwise the transfer will fail.

##### 🏁 Your Goal: Transfer and Repay
In the `repay` function you can repay the loan in three steps:

First, transfer the asset from the member to the smart contract.

Next, approve the dai to be spent by the `pool`.

Finally, repay the `pool` on behalf of the collateral group. You will need to choose the same interest rate mode as you did in the `borrow` function.

### 6. Health Factor

#### Task

##### Health Factor
The health factor is a convienent metric provided by AAVE. It tells us how healthy the ratio between collateral and borrowed assets is. If the health factor falls below one, the collateral is in **danger of being liquidated**.

It is important to keep an eye on this factor as a borrower, as the liquidation penalty can result in a significant loss of funds.

##### 🏁 Your Goal: Enforce Health Factor
To ensure that our collateral/borrow ratio stays healthy, let's require that the `borrow` function will only execute borrows if the health factor is above 2 after the borrow is completed.

To find out the health factor, you will need to call `getUserAccountData` on the `pool`. When we provide the address of the smart contract this will respond with [six return values](https://docs.aave.com/developers/the-core-protocol/lendingpool#getuseracountdata). The last of the return values is the `healthFactor`.

After the borrow is completed, require that the health factor is above 2. If not, revert the transaction. The health factor is provided with 18 decimal places of precision, so you will need to check that is above `2e18`.

### 7. Security

#### Task

##### Security 🔒
In our contract, the only people that should be able to withdraw and borrow are the members. The idea is that the members would know each other beforehand and can on some level trust each other to repay back loans that may be larger than their individual collateral contribution.

For any other user who is anonymous and has no stake in the game, there is no ability to trust them to pay back their loans.

##### 🏁 Your Goal: Members Only
Let's make sure that only members can call `borrow` and `withdraw`. For anyone else who tries to call these methods, revert the transaction.

###### Credits
github.com/chainshot