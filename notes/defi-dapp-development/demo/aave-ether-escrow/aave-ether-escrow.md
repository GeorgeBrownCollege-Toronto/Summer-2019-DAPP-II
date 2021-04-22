## AAVE Ether Escrow

### 1. Deposit

#### Details

##### Wrapped Ether

Wrapped Ether or simply **WETH** is a smart contract that allows you to deposit ether for wrapped ether 1:1. This means that if you deposit 100 ETH you can expect 100 WETH in return. The same rule applies in reverse if you want to withdraw your ETH.

The advantage of WETH is that **it is an ERC20 token**. This means that if a smart contract is designed to work with ERC20 tokens, like many are, WETH is compatible. By contrast, Ether is the native currency of Ethereum and has very different rules. We can send ether to payable functions only and then it is automatically deposited into the smart contract's balances. This is very different from an ERC20 token where the smart contract keeps track of the token balances in an address mapping.

##### Sending Ether
When making an external function call, we can specify the value we'd like to send to it:

```js
contract Other {
    function deposit() external payable {}
}

contract Sender {
    Other other;
    constructor(Other _other) {
        other = _other;
    }
    function send() external {
        // sending 1 ether to the other contract
        other.deposit{value: 1 ether}();
    }
}
```
☝️ Here we are sending `1 ether` to the other contract. The deposit contract doesn't take any arguments. However, if it did, we could pass them through the parenthesis like any other function call.

>📖 Want to learn more? Read the [Solidity Documentation on External Function Calls](https://docs.soliditylang.org/en/latest/control-structures.html#external-function-calls).

##### AAVE Lending Pool
The lending pool is main entry point for interactions with the AAVE protocol. These interactions include lending, borrow, and flash loans among others. In the AAVE developer docs you can learn more about the [protocol overview](https://docs.aave.com/developers/the-core-protocol/protocol-overview) as well as the [lending pool method documentation](https://docs.aave.com/developers/the-core-protocol/lendingpool).

#### Task

##### Depositing Ether
You'll notice that `Escrow.sol` is setup quite similar to the Vanilla Escrow exercise. We start with a constructor that accepts ether and assigns the arbiter, beneficiary, and depositor roles.

The depositor will deploy the escrow contract and deposit ether funds. This ether should be transferred from the contract to the AAVE lending pool. One tricky aspect here is that the AAVE lending pool contract is designed to work with ERC20 Tokens. We'll need to use Wrapped Ether or WETH if we want to deposit ether into the lending pool.

Fortunately, AAVE deployed a WETHGateway that we can deposit our ether directly into. This gateway will convert ether into weth and deposit it into the AAVE lending pool for us. In return, the escrow will receive aWETH, an interest bearing asset.

🧐 You can view the code for the WETH Gateway we will be interacting with on Github or deployed on Etherscan.

###### 🏁 Your Goal: Deposit
The `Escrow.sol` file imports the `IWETHGateway` interface. In this stage we'll be using the depositETH method defined in this interface. The gateway is already pointing at the appropriate address, so it's simply a matter of calling the depositETH method on the gateway interface.

This method is payable, so we can send ether to it. Send the entire escrow's balance through this method. Set the onBehalfOf to be the escrow's address and set the referralCode to be 0.

>🤔 Curious about the referral code? You can learn more about the AAVE referral program [here](https://docs.aave.com/developers/v/2.0/referral-program).

### 2. Allowance

#### Details

#### aTokens
When you lend to the AAVE protocol, it mints aTokens which are interest bearing representations of the asset you deposited. These tokens will earn interest and can be exchanged at a 1:1 ratio for the underlying asset.

As an example, in this Escrow Tutorial we are depositing ETH and receiving newly minted aWETH. The balance of aWETH will increase over time as it earns interest. At any point we can exchange our aWETH 1:1 for WETH.

>📖 To learn more about aTokens see the [AAVE Developer Docs here](https://docs.aave.com/developers/the-core-protocol/atokens).

##### Token Allowance
THE ERC20 Standard has **allowance** methods that provide the ability to spend tokens on someone else's behalf. For instance, you can post an order and allow a decentralized exchange to spend tokens on your behalf if they find someone for you to trade with.

To allow an address to spend your tokens you can call the `approve` method:

```js
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
}
```
☝️ The `spender` is the address who is allowed to spend the token and the `amount` is how much they are allowed to spend. We can define a method:

```js
function giveApproval() external {
    // call the approve function on the ERC20 token contract 
    // allowing the dex to spend 100 tokens
    token.approve(dex, 100e18);
}
```

☝️ Here we are allowing a decentralized exchange `dex` to spend `100` of `token` (assuming it uses `18` decimal places).

The dex will then be able to call `transferFrom` on the `token` and spend the tokens on our behalf when a trade is available.

#### Task

#### aWETH Allowance
In the last stage we deposited our ether into the AAVE pool using the WETH gateway. Do we receive anything in return? 🤔

Yes, we do! We receive `aWETH`.

The Escrow Contract sends ether to the WETH Gateway, which sends WETH to the AAVE LendingPool which mints **Aave Interest Bearing WETH** or **aWETH**`**.

>🔍 Take a look at **Details** to learn more about the interest bearing aTokens.

If we want to withdraw ETH from AAVE, we will need to first approve the WETH gateway to spend our aWETH. The WETH Gateway will attempt to call transferFrom on the aWETH contract. This assumes that we already have approved the spend from our contract.

>🔍 Unfamiliar with the ERC20 standard? Learn more about Token Allowance in **Details**.

##### 🏁 Your Goal: Approve aWeth
When the arbiter decides the transaction is ready, they will call the `approve` method. We'll want to withdraw the balance of the escrow from the AAVE pool. The first step is to approve the gateway to spend the aWETH.

To pass this stage, `approve` the gateway to spend the escrow's entire balance of `aWETH`.

##### 🔒 Security: Arbiter Only
Ensure that only the `arbiter` can call the `approve` method. They will call this method when the escrow is ready to be processed. Otherwise, if anyone else attemps to call `approve` on the escrow, revert the transaction.

### 3. Withdraw

#### Task

###### Withdraw
The next step in this process is to withdraw the ETH through the WETH gateway.

We can call [withdrawETH](https://github.com/aave/protocol-v2/blob/dbd77ad9312f607b420da746c2cb7385d734b015/contracts/misc/WETHGateway.sol#L53-L65) on the WETHGateway to go from aWETH to ETH. This function assumes that the gateway has been approved to spend the `aWETH` tokens. Otherwise, the `transferFrom` will fail and the transacton will be reverted.

>🎉 Fun Fact - If you set the `amount` to be `type(uint256).max`, the gateway will withdraw your entire balance. This is also true for the `approve` method on aTokens.

###### 🏁 Your Goal: Withdraw ETH
After approving the `aWETH` tokens in the approve function, call the `withdrawETH` function on the `gateway` to withdraw the ETH into the escrow smart contract.

###### 💸 Accept Ether
The `withdrawETH` function will attempt to transfer the ether to the `to` address (see [here](https://github.com/aave/protocol-v2/blob/ice/mainnet-deployment-03-12-2020/contracts/misc/WETHGateway.sol#L64) and [here](https://github.com/aave/protocol-v2/blob/ice/mainnet-deployment-03-12-2020/contracts/misc/WETHGateway.sol#L118-L121)). In order for the transfer to succeed, the `to` address must [accept ether](https://docs.soliditylang.org/en/v0.7.5/contracts.html?highlight=receive#receive-ether-function). By default, smart contracts do not accept ether. Change the Escrow contract to [accept ether](https://docs.soliditylang.org/en/v0.7.5/contracts.html?highlight=receive#receive-ether-function) from the WETHGateway.

### 4. Pay

#### Task

In this Escrow the resulting ether withdrawn will be larger than the ether initially deposited, thanks to the interest earned in the AAVE protocol. We will want to transfer the principal, or the initial deposit, to the beneficiary as that was the payment they were promised.

As far as the interest, we will grant that to the depositor, as they deposited the amount far in advance of the payment being sent. They could have been earning interest on that payment all the while!

##### 🏁 Your Goal: Pay Beneficiary
On this stage you will need to pay ether to the beneficiary. The amount of ether you send to the beneficiary should only be the **original deposit amount**, not the total balance after interest is earned.

>💭 Feel free to add new variables to the smart contract to help you determine the original deposit amount!

### 5. Interest

#### Task

After you have paid the beneficiary the initial deposit, the only ether that remains is the interest earned while in escrow. Let's pay this interest to the depositor.

##### 🏁 Your Goal: Pay Depositor
Send the depositor the interest earned while the ether was sitting in Escrow.

>💭 There's a couple ways to do this. One helpful hint is that the interest is simply the ether leftover in the contract after sending the principal to the beneficiary. And since this contract has served its purpose, you're more than welcome to `selfdestruct` it!

###### Credits
github.com/chainshot