## Flash Voting
In this exercise we're going to use AAVE's flash loans to borrow 100k DAI and use it to buy governance tokens, vote with the tokens and then sell the tokens back. All of this will happen in the span of one transaction.

When a governance token uses token-weighted voting (your voting power is based on the nubmer of tokens you have) they can potentially open themselves up to this vulnerability. In this case, the user does not have to hold any of their governance tokens in order to have a **strong vote** which defeats the purpose of the governance token.

At the end of this exercise, we'll outline the ways to mitigate this vulnerability and what many teams in the ecosystem are doing today.

### 1. Setup

#### Task

##### Setting Up
Check out the contracts you have available on this stage! You'll notice there is a `Govern.sol` file that has an ERC20 governance token inside of it. Users can `buy`, `sell` and `vote` with this token, along with all other inherited `ERC20` methods. We'll be primarily exploring the combination of AAVE Flash Loans with these three functions.

If you're familiar with flash loans, you may already notice the vulnerability here. If not, you'll soon see 😉

Either way, our goal is to exploit this vulnerability. We'll start with setting up `FlashVoter` constructor.

##### 🏁 Your Goal: Get Set Up!
In the constructor, you'll notice that there are two parameters being passed: the `_governanceToken` and the `_proposalId`. The governance token will point at the `Govern` contract, so we can call methods on it. The `_proposalId` will be the current proposal we will be attempting to vote on.

### 2. Flash loan

#### Details

##### Memory Arrays
It can be tricky to work with arrays that are stored in memory. You must define the length of an in-memory array. You can do so like this:

```js
// creating a new array of uints of length 2
uint[] memory numbers = new uint[](2);
```
☝️ Here we define the length in the paranthesis to be 2. We can then index into the array to store specific values at those slots:

```js
// storing a 5 in the first spot
numbers[0] = 5;
// storing a 2 in the second spot
numbers[1] = 2;
```

#### Task

##### Flash Loan
In this stage you'll need to kick off an AAVE flash loan in the `flashVote` function. This will callback `executeOperation` on our smart contract if we set it up properly.

First let's take a look at the AAVE LendingPool [flashloan](https://docs.aave.com/developers/the-core-protocol/lendingpool#flashloan) function, which takes quite a few parameters! We'll break them down one by one.

* `receiverAddress` - This is the address of a contract that will receive the funds. The contract must have an `executeOperation` function for the Lending Pool to call. This function has already been set up in FlashVoter contract. We'll want to set this parameter to be the contract's address.
* `assets` - These are the addresses of the ERC20 contracts we want to borrow. For our purposes, it will be enough to supply one asset: DAI.
* `amounts` - These are the amounts of the assets we want to borrow, corresponding to their position in the `assets` array. We are only borrowing DAI, so we only need to specify one amount.
* `modes` - These are another array that corresponds to the indexes in `amounts` and `assets`. It will define the debt to create if the flash loan is not paid back. In our case, we will pay back the flash loan in full and not open any debt, so this can be set to `0`.
* `onBehalfOf` - Who will incur the debt. In our case, we will not incur any debt.
* `params` - Extra parameters to send through to the `executeOperation` function. We won't need to use these, so you can supply an empty string `""`.
* `referralCode` - You can supply any valid code or 0 here.
##### 🏁 Your Goal: Kick off the Flash!
Inside of the `flashVote` function, call the `flashloan` function on the pool and borrow 100k DAI (you can use the defined `borrowAmount`).

> 🔍 One tricky part of this stage is working with memory arrays(read details) for the assets, amounts and modes arguments.

### 3. Pay Back

#### Task

##### Execute Operation
In **2. Flash loan** you called the `flashLoan` method on the `pool`. After providing you with the loaned asset, it will call the smart contract's `executeOperation` function. Now we have an opportunity to do something with those loaned assets.

The first thing we'll want to do is make sure that this flash loan executes successfully. To do that, we'll need to pay back the loan amount plus premiums for those loans. The premiums are a fee charged for the service of the flash loan.

For this stage our smart contract will have enough DAI inside of it to pay for the premiums, and you can provide the principal back to pay for the rest of the loan.

##### 🏁 Your Goal: Successful Execution
Ensure that the flash loan call to `executeOperation` is successful by paying back the amount owed.

You can determine the total amount owned by taking the first value in the `amounts` array and adding it to the first value in the `premiums` array. This will be the amount your borrowed and the amount owed on top of that respectively.

Once you have calculated the total amount owed you just need to approve the `pool` to spend this amount of the smart contract's DAI and return `true`.

### 4. Flash Vote

#### Details

##### Fixing Flash Voting
While this exercise might seem contrived and simple, flash loans can cause [real problems in live protocols](https://forum.makerdao.com/t/urgent-flash-loans-and-securing-the-maker-protocol/4901). Something that can easily be done to mitigate flash loans is to have a delay between the time an address purchases the asset and when they can vote with it.

Another option is, for each proposal, to take a **snapshot** of the total number of tokens held by the user at a particular block height. If they add/remove tokens after this point it won't affect their voting weight for the particular proposal. This can be used for both on-chain and off-chain voting.

Off Chain Voting
Many teams in the Ethereum space are moving to [off-chain voting](https://snapshot.page/#/) where the voting power is how many tokens you held at a specific block prior to the vote. Then you sign a message saying how you'd like to vote and all the votes get stored on IPFS.

This works well for off-chain votes (and it's gas-free!), however, there is no on-chain resoution so it's not the same security gaurantee you can expect from voting on-chain. It is still verifiable though, so potentially any improperly relayed results could be detected easily. Aragon is seeking to add [off-chain polling with on-chain execution](https://aragon.org/blog/snapshot) which could be a great way to bridge these worlds.

#### Task

##### Flash Vote
Now that you have successfully paid back the loan, it's time to do something **before that** while you have access to the 100k DAI in the `executeOperation` function. This is where the governance token comes in. Take a look at `Govern.sol` 👀

Do you see the buy and sell functions? They allow you to buy govern tokens directly with DAI. Who happens to own a bunch of DAI? That's right, it's you! 😉

Use the DAI to buy Govern tokens and vote on a proposal, then sell all those Govern tokens back and repay the DAI loan. And boom, you've flash voted the system!

>🤔 How can governance tokens avoid this security vulnerability? Check out the details section to see some ways that this could be avoided.

##### 🏁 Execute Vote
Your goal is to `buy` governance tokens, `vote` with them, and then `sell` them back to DAI so you can repay the flash loan. Do this all in the `executeOperation` function.

You stored the `proposalId` to vote on in a storage variable in the constructor. Vote on this proposal with your flash loaned Govern tokens.



###### Credits
github.com/chainshot