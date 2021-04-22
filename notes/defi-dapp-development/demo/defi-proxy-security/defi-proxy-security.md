## DeFi Proxy Security
In this tutorial we are going to go over a security vulnerability discovered on [December 3rd by Trail of Bits](https://blog.trailofbits.com/2020/12/16/breaking-aave-upgradeability/).

In order to fully understand how this vulnerability works, we're going to fork the Ethereum Mainnet while this vulnerability was still exploitable. Then we'll successfully launch the attack against the smart contracts.

This will allow us to take a closer look at some of the components in the AAVE protocol, so we can understand on our deeper level how it fits together.

### 1. Initialize

#### Task

##### Initialize Call
In the AAVE v2 contracts, when a lending pool is deployed, [the initialize call](https://github.com/aave/protocol-v2/blob/eea6d38f243b909fc3cf82a581c45b8bc3d2390e/contracts/protocol/lendingpool/LendingPool.sol#L90-L92) is open to be called externally. Initially the [revision variable](https://github.com/aave/protocol-v2/blob/eea6d38f243b909fc3cf82a581c45b8bc3d2390e/contracts/protocol/libraries/aave-upgradeability/VersionedInitializable.sol#L32-L50) is larger than the `lastInitializedRevision`, which allows anyone to call it.

When AAVE deploys these contracts they are deployed [as proxies](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies) where the `initialize` method is called in the context of the proxy contract. The addresses provider is set in the initialize call as part of this process. However, someone can still set `_addressesProvider` on the contract directly.

On the surface, this does not seem to matter much since the proxy is where all the contract storage is contained. However, as we'll see in the following stages, this can lead to a bigger vulnerability. Let's initialize the contract with our contract as the addresses provider and we'll dig deeper in the next stages.

##### 🏁 Your Goal: Initialize
Call the `initialize` function on the `pool` and set the addresses provider to be the address of the `Contract`.

### 2. Addressing

#### Task

##### Lending Manager
Among it's many responsibilities, the addresses provider is responsible for providing the lending pool collateral manager's address. You can see this in the source coder here.

In the last stage, you successfully set the addresses provider to be the `Contract`. This means, when `getLendingPoolCollateralManager` is called in the context of the Lending Pool, it will call the Contract to get the address.

As you can see in the `Contract.sol` file there is already a `getLendingPoolCollateralManager` method defined. Let's return the Contract's address as the lending pool collateral manager. We'll see why this is necessary in the next step!

##### 🏁 Your Goal: Return Contract Address
In the getLendingPoolCollateralManager method, return the address of the Contract.

### 3. Destruct

#### Task

##### Destruct
Now that the collateral manager has been set to be our contract, we can have the LendingPool make a delegate call to our contract via the [liquidation call method](https://github.com/aave/protocol-v2/blob/eea6d38f243b909fc3cf82a581c45b8bc3d2390e/contracts/protocol/lendingpool/LendingPool.sol#L424-L450).

This is the **critical part** of the vulnerability! At this point, we can **self-destruct** the Lending Pool contract because delegate call allows us to run code in the **context of the lending pool itself**.

However, this is one catch here. We cannot call `selfdestruct` directly in the `Contract` because we need to return `0` for the `returnCode` so the transaction does not revert (see [these three lines](https://github.com/aave/protocol-v2/blob/eea6d38f243b909fc3cf82a581c45b8bc3d2390e/contracts/protocol/lendingpool/LendingPool.sol#L447-L449)).

Instead, we can **delegate call further** to the `Destructor` contract, which can self-destruct. Then we can return `0` for the `returnCode` so the transaction does not revert.

##### 🏁 Your Goal: Self Destruct!
This part is tricky! You will need to `delegatecall` to the `Destructor` contract. The `delegatecall` method is available [on the address type](https://docs.soliditylang.org/en/v0.7.5/types.html#members-of-addresses). We do know the destructor's address ahead of time, it is: `0x5FbDB2315678afecb367f032d93F642f64180aa3`.

Follow the address type delegate call documentation to figure out how to call the destruct function with a `delegatecall`, or you can take a look at how its done [in the lending pool liquidation call](https://github.com/aave/protocol-v2/blob/eea6d38f243b909fc3cf82a581c45b8bc3d2390e/contracts/protocol/lendingpool/LendingPool.sol#L435-L443) for inspiration.

Finally, be sure to return a tuple containing zero and an empty string so that the lending pool `liquidationCall` does not revert.

###### Completed AAVE Proxy Security!
You destroyed the contract and pulled off the attack! 😱

To understand the ramifications of this event, see Trail of Bit's [article](https://blog.trailofbits.com/2020/12/16/breaking-aave-upgradeability/) discussing affected contracts.

Also, you can clone [this repository](https://github.com/Dan-Nolan/Delegatecall-Proxy-Bug) to be able to replicate this exploit locally.

###### Credits
github.com/chainshot