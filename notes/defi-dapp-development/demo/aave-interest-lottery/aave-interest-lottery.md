## Interest Lottery

[PoolTogether](https://pooltogether.com/) has done an excellent job popularizing the idea of a no-loss lottery system. The idea is that all participants pool their funds together and the prize each week is the interest earned on the funds.

Let's create our own simple version of an interest lottery using AAVE!

### 1. Drawing

#### Task

##### A Weekly Drawing
In the lottery contract you'll notice there is a `drawing` unsigned integer. This value is the timestamp of the lottery drawing.

In the constructor, we'll want to set a date for the lottery drawing to occur, which will determine the winner.

🏁 Your Goal: Set a Drawing
Set the lottery drawing to be **a week after** the contract is deployed.

>📖 You can calculate this timestamp using the globally available [block timestamp](https://docs.soliditylang.org/en/v0.7.5/units-and-global-variables.html?highlight=selfdestruct#block-and-transaction-properties) and adding [time units](https://docs.soliditylang.org/en/v0.7.5/units-and-global-variables.html?highlight=selfdestruct#time-units).

### 2. Purchasing

#### Task

##### Purchasing Tickets
Now that we've set a drawing, it's time to allow participants to enter our lottery system.

In this stage you will need to update the purchase method to allow purchasing of tickets.

##### 🏁 Your Goal: Ticket Purchasing
In the purchase function, accept DAI in exchange for tickets. The ticketPrice is set a 100 DAI.

You can call transferFrom on the dai contract to transfer 100 dai from the caller's address to the contract. The caller will set their allowance beforehand to ensure this works successfully.

##### 🔒 Security
If the transfer is successful, track the user's ticket purchase. If they already have a ticket, do not let them buy another ticket.

>🤔 You will need to add another state variable to the contract to track the user's ticket purchase. The implementation is up to you, choose wisely!

### 3. Earn Interest

#### Task

##### Earn Interest
As soon as a ticket is purchased, we can start earning interest on it for the lottery. Let's take the DAI transferred from each individual ticket purchaser and deposit it immmediately into the AAVE lending pool.

##### 🏁 Your Goal: Ticket Interest
In the `purchase` method, deposit the DAI transferred from the user's account into the AAVE `pool`.

In the previous stage you moved the DAI from the user to the lottery contract. Now you will need to `approve` the lottey contract's `dai` to be spent by the `pool` before you can call `deposit`.

After you approve it, call `deposit` on the pool with `onBehalfOf` set as the lottery contract address and `0` set as the referral code.

### 4. Pick Winner

#### Details

##### 🎲 Blockchain Unpredictable Values
For applications like lotteries on Ethereum, it is often very important to find **unpredictable values**. This can be quite difficult on Ethereum because the Ethereum Virtual Machine is built to be completely deterministic. Afterall, if the two nodes could somehow calculate two different states, it would be impossible to come to consensus!

For unpredictable values to work in these applications it is important that, prior to the reveal of this value, no parties have any unfair advantage at knowing this value or manipulating it. There are many interesting ways of generating unpredictable values. For Ethereum 2.0 specifically, the protocol will use a [multi-party commit-reveal scheme](https://github.com/randao/randao) with the addition of a [verifiable delay function](https://blog.trailofbits.com/2018/10/12/introduction-to-verifiable-delay-functions-vdfs/) to ensure that no validator has an unfair advantage.

Other applications use [oracles](https://blog.chain.link/verifiable-random-functions-vrf-random-number-generation-rng-feature/), or some combination of oracles, highly volatile numbers and commit reveals (such as in the [PoolTogether v2 design](https://medium.com/pooltogether/how-pooltogether-selects-winners-9301f8d76730))

🔒 Security of Global Variables
For less high-stakes use cases it can be acceptable to use things like [block properties](https://docs.soliditylang.org/en/v0.7.5/units-and-global-variables.html?highlight=selfdestruct#block-and-transaction-properties). However, you have to consider that there is a party who has some control over these values: the miner.

If a miner successfully mines a block, they can choose whether or not to propagate it based on if they won the lottery. Of course, in some cases this might mean they are potentially forgoing the block reward. The stakes would have to be quite high for this to make sense. Otherwise, of course, the miner is incentivized to propagate the block quickly and ensure it is accepted and they are rewarded.

Still, some of these properties are certainly better than others. For instance, miners have significant leeway on their chosen timestamp, so they can cycle through mining timestamps that would make them the winner. For this reason, the timestamp is highly inadvisable by itself. The blockhash of a previous block is certainly an upgrade, although miners can still choose not to include the transaction if it's on a block that will not make them the winner.

A nice approach might be to choose a block number in advance and use the hash of that particular block for randomness regardless of how long after the transaction is mined. This will certainly limit the miner's power to manipulate the result and actively de-incentivize this behavior. You do need to be careful here though because the EVM only allows you to access [the last 256 block hashes](https://ethereum.stackexchange.com/questions/418/why-are-contracts-limited-to-only-the-previous-256-block-hashes/537#537).

#### Task

##### Picking a Winner
Since this is an open and transparent lottery system, you will want to randomly select a winner in a way that is fair.

Finding a random value, or more accurately an unpredictable value, on the blockchain can be quite difficult! For the purposes of this code tutorial you can use a globally available unit like the `block.timestamp` or `blockhash` of a previous block, although you should be aware of [the drawbacks of this approach](!

Once you have your acceptably random value, you take this number modulo the total number of tickets purchased to decide your winner.

🏁 Your Goal: Emit Winner
In the pickWinner method, pick a winner from all of the ticket purchasers. Once you have determined this winner, emit the Winner event with the address of the winner.

🤔 You may need to change/add the data structure you were using to track ticket purchases in order to make this work!

🔒 Security
Ensure that the pickWinner method can only be called a time occurring after the drawing timestamp.

### 5. Winner Payout

#### Task

##### Payouts

Let's wrap up the pickWinner function by paying out all the participants.

Each participant should get their money back and the winner should additionally recieve all interest earned.

##### 🏁 Your Goal: Withdrawals
For each ticket purchaser, withdraw their initial purchase in DAI and transfer it to them.

You will need to approve the pool to spend the lottery's aDai balance before you can call the withdraw function successfully. Then you'll want to withdraw dai to each participant.

Finally, with the remaining aDai interest, withdraw it to the chosen winner.

###### Credits
github.com/chainshot