## What's an Escrow? 🤔
An escrow is an agreement often used when transferring funds in exchange for a good or service. Funds can be held in escrow and a third party can be chosen to "arbitrate" or approve the transfer when the service or good is provided.

![](./escrow.png)

There are many use cases for Escrows across real estate, charities and marketplaces. It's the bread and butter of Ethereum Smart Contracts as it's quite easy to write, and yet, so powerful. 🍞🧈

### Let's Get Building 👷‍♂️👷‍♀️
We hope that during this block you'll be thinking about ways that you can use an escrow to launch new decentralized applications. You'll be able to use all the code you wrote in a working web application!

With a bit of creativity you can create something new and amazing. Start brainstorming! 🧠🎨

### 1. Setup

#### State Variables
We'll have three parties involved in the Escrow:

- 🙂 Depositor - The payer of the Escrow, makes the initial deposit that will eventually go to the beneficiary.
- 👨‍🔧 Beneficiary - The receiver of the funds. They will provide some service or good to the depositor before the funds are transferred by the arbiter.
- 👩‍⚖️ Arbiter - The approver of the transaction. They alone can move the funds when the goods/services have been provided.

For this first stage, let's create these addresses as public state variables!

- 🏁 Your Goal: Addresses
Create three public state variables for the addresses of the `depositor`, `beneficiary` and `arbiter`.

### 2. Constructor  🏗️

#### Constructor Storage 🏗️
Each time that a `depositor`, `arbiter` and `beneficiary` come to an agreement upon Escrow terms, they can deploy a contract.

The depositor will be the signer deploying the contract. They will ask the arbiter and beneficiary for addresses that those two parties have access to. Then the depositor will provide those addresses as the arguments to the Escrow contract for storage.

#### 🏁 Your Goal: Store Addresses
Create a public `constructor` which takes two arguments: an `address` for the arbiter and an `address` for the beneficiary (in that order). Store these variables in the corresponding state variables.

The depositor is the address deploying the contract, so take this address and store it in the `depositor` state variable.



### 3. Funding 💸

It's time to `fund` the contract!

The depositor will send some ether to the contract, which will be used to pay the beneficiary after the transfer is approved by the arbiter.

🏁 Your Goal: Payable
- Modify the constructor function to make it payable.

### 4. Approval

- After the contract has been deployed with the appropriate amount of funds, the beneficiary will provide the good or service. They are now secure in knowing that the money is on its way! 👨‍🔧👍

- Once the good or service is provided, the arbiter needs a way to approve the transfer of the deposit over to the beneficiary's account. 👩‍⚖️🆗

Let's add this mechanism to our contract!

🏁 Your Goal: Approve
- Create an external function called approve.

- This function should move the contract's balance to the beneficiary's address.

### 5. Security (Lock it Down 🔒)

- There's only one address that should be able to call the approve method: the arbiter. 👩‍⚖️

- This is their role in the escrow transaction, to decide when the funds can be transferred.

🏁 Your Goal: Security
- If anyone tries to call `approve` other than the arbiter address, revert the transaction.

###### Credits
github.com/chainshot