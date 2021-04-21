## AAVE Dai Escrow Dapp
Are you excited to apply your AAVE Smart Contract skills? Using the lessons learned from the previous code tutorial, you can build on your very own AAVE Dai Escrow Dapp!

This Dapp will allow you to create deploy Escrow Contracts from a web application.

### Clone the Repository 👨‍💻👩‍💻
The Decentralized Escrow Application can be found here: https://github.com/GeorgeBrownCollege-Toronto/Dapp-II/tree/master/notes/defi/demo/aave-dai-escrow-kovan

If you already have Git installed you can simply run the following command:

```
➜ git clone https://github.com/GeorgeBrownCollege-Toronto/Dapp-II.git ./aave-dai-escrow-kovan && cd ./aave-dai-escrow-kovan && git filter-branch --prune-empty --subdirectory-filter ./notes/defi/demo/aave-dai-escrow-kovan HEAD && rm -rf ./.git
```
If you don't have Git installed, don't worry! You can go directly to the github link above and click on the "Clone or download" button to download a zip of the repository. Unzip this repository into a directory on your machine.

>📖 Git is a distributed source control system. It provides a way to save code changes in increments (called commits) and keep a history of all the changes. If you are not familiar with Git, there are many learning resources online including the [git documentation](https://git-scm.com/doc)!

Once you have the repository downloaded, follow the instructions in the `README.md` to compile contracts, test contracts and run the front-end application!

### Screenshot 🖼️
Here's a screenshot of the front-end of the dapp:

![screenshot](./DaiEscrowDapp.png)

### Challenges ⚔️
Excited about some challenges?

First things first, get the application up and running and deploy your first Escrow! After that here are some interesting challenges to tackle.

#### Challenge 1: Stylize 🎨
Can you change the style of the application? Make it your own!

#### Challenge 2: Show the Interest Rate 👀
Can you display the interest rate available for depositing DAI? This information should be available as the `currentLiquidityRate` through the AAVE Lending Pool's `getReserveData` method.

#### Challenge 3: Persistence 💾
When you refresh the page, all the escrow smart contracts are gone! 😱

It would be nice if we could keep track of all smart contracts that have been deployed. We could do this by creating a server that keeps track of all the deployed Escrow Smart Contracts. Either that or a page that can interface with any Escrow contract given a particular address.