## aave dai escrow
In this code tutorial we're going to build a DAI Escrow that will earn interest using AAVE!

This will be a bit different from the Ether Escrow since we are starting with an ERC20 token rather than starting with ether and transacting with the WETH Gateway.

### 1. Transfer DAI

#### Task

##### Transferring DAI

For this Escrow, we will be using DAI as the underlying asset. Our first step will be to transfer DAI from the depositor to Escrow smart contract. In order to make this transfer, we'll need to interact with the DAI ERC20 Contract.

The constructor of our Escrow will transfer the DAI from the depositor to itself. It can assume that the depositor has already approved the contract to spend its funds.

##### 🏁 Your Goal: Transfer DAI
In the constructor, transfer DAI from the depositor address to the contract. Transfer the `amount` specified in the constructor call.

Find the appropriate method on `IERC20` contract and use it to facilitate this transfer.

### 2. Deposit DAI

#### Task

##### Deposit the DAI
Now that the DAI is in the contract, you'll need to deposit it into the AAVE lending pool. The Lending Pool will take the DAI and, in exchange, mint new aDAI for the contract to hold on to.

##### 🏁 Your Goal: Constructor Deposit
In the constructor, after you have transferred the DAI, you will need to deposit it into the AAVE Lending Pool. This will be a two step process. First we'll need to approve the lending pool to spend our DAI. Second we'll need to deposit the DAI through the pool contract.

You can approve the DAI spend by calling the `approve` ERC20 method on the `dai` contract. Approve the `_amount` that the depositor is adding to the escrow.

Next, you'll need to `deposit` the DAI into the `pool` contract. The underyling asset to deposit in our case is DAI. Set the `onBehalfOf` to be the escrow's address and set the referralCode to be 0.

>📖 See the documentation [of the deposit method](https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#deposit) for more information.

### 3. Approve & Withdraw

#### Withdraw DAI
The DAI deposited in this Escrow will earn interest, so that by the time it is withdrawn, there will be more DAI available than initially deposited!

In this stage, let's provide the beneficiary with the initially deposited DAI. So, for instance, if there was 100 DAI initially deposited, we'll send 100 DAI to the beneficiary.

#### 🏁 Your Goal: Pay the Beneficiary
In order to pay the beneficiary, you'll first need to approve the `pool` to spend your `aDAI` balance.

Once you have done so, you can call `withdraw` on the pool. In this case, you can withdraw directly to the beneficiary. When you call withdraw, you need to specify the **underlying asset** you are trying to withdraw, not the interest bearing asset.

> 📖 See the documentation [of the withdraw method](https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#withdraw) for more information.

#### 🔒 Security: Arbiter Only
Ensure that only the arbiter can call the approve method. They will call this method when the escrow is ready to be processed. Otherwise, if anyone else attempts to call approve on the escrow, revert the transaction.

### 4. Approve Interest

#### Paying Interest
Let's pay the **interest** earned to the depositor. Afterall if the payment took a long time, they could have been earning interest on their DAI!

#### 🏁 Your Goal: Pay Depositor
Calculate the interest earned in DAI, and transfe
r it to the depositor.