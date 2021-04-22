const { assert } = require("chai");
const poolABI = require("./abi.json");

describe('CollateralGroup', function () {
    let depositorAddr = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";
    let depositorSigner;
    const aDaiAddress = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const poolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
    const depositAmount = ethers.utils.parseEther("10000");
    let contract;
    let members;
    let aDai;
    let dai;
    before(async () => {
        const signer = await ethers.provider.getSigner(0);
        signer.sendTransaction({ to: depositorAddr, value: ethers.utils.parseEther("1") });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [depositorAddr]
        })
        depositorSigner = await ethers.provider.getSigner(depositorAddr);
        dai = await ethers.getContractAt("IERC20", daiAddress, depositorSigner);
        aDai = await ethers.getContractAt("IERC20", aDaiAddress);
        pool = await ethers.getContractAt(poolABI, poolAddress);

        const accounts = await ethers.provider.listAccounts();
        const deployer = accounts[0];
        members = accounts.slice(1, 4);
        await dai.transfer(members[0], depositAmount)
        await dai.transfer(members[1], depositAmount)
        await dai.transfer(members[2], depositAmount)

        const groupAddress = ethers.utils.getContractAddress({
            from: deployer,
            nonce: (await ethers.provider.getTransactionCount(deployer))
        });
        for (let i = 0; i < members.length; i++) {
            const signer = await ethers.provider.getSigner(members[i]);
            await dai.connect(signer).approve(groupAddress, depositAmount);
        }

        const CollateralGroup = await ethers.getContractFactory("CollateralGroup");
        contract = await CollateralGroup.deploy(members);
        await contract.deployed();
    });

    describe("after deployment", () => {
        it("should not have dai in the smart contract", async () => {
            const balance = await dai.balanceOf(contract.address);
            assert(balance.eq("0"));
        });

        it("should have aDai in the smart contract", async () => {
            const balance = await aDai.balanceOf(contract.address);
            assert(balance.eq(depositAmount.mul(members.length)));
        });

        // 3. Withdraw
        // describe("after withdrawing", () => {
        //     before(async () => {
        //         await contract.withdraw();
        //     });

        //     it("should provide each member with their dai investment", async () => {
        //         for (let i = 0; i < members.length; i++) {
        //             const balance = await dai.balanceOf(members[i]);
        //             assert(balance.gte(depositAmount));
        //         }
        //     });
        // });
        describe("when borrowing as a non-member", () => {
            it('should revert', async () => {
                const borrower = await ethers.provider.getSigner(5);
                const borrowAmount = ethers.utils.parseEther("500");
                let ex;
                try {
                    await contract.connect(borrower).borrow(daiAddress, borrowAmount);
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex);
            });
        });
    
        describe("when withdrawing as a non-member", () => {
            it('should revert', async () => {
                const signer = await ethers.provider.getSigner(5);
                let ex;
                try {
                    await contract.connect(signer).withdraw();
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex);
            });
        });
        
        describe("when borrowing too much dai", () => {
            let borrower;
            let borrowAmount = ethers.utils.parseEther("17500");
            it('should revert due to the health factor', async () => {
                let ex;
                try {
                    borrower = await ethers.provider.getSigner(members[0]);
                    await contract.connect(borrower).borrow(daiAddress, borrowAmount);
                }
                catch(_ex) {
                    ex = _ex;
                }
                assert(ex);
            });
        });
    
        describe("after borrowing dai", () => {
            let borrower; 
            let borrowAmount = ethers.utils.parseEther("1000");
            before(async () => {
                borrower = await ethers.provider.getSigner(members[0]);
                await contract.connect(borrower).borrow(daiAddress, borrowAmount);
            });
    
            it('should have added the dai to the borrowers account', async () => {
                const balance = await dai.balanceOf(await borrower.getAddress());
                assert(balance.eq(borrowAmount));
            });
    
            it('should have an owed balance on the contract', async () => {
                const data = await pool.getUserAccountData(contract.address);
                assert(data.totalDebtETH.gt(ethers.utils.parseEther("1")));
            });
    
            describe("after repaying collateral + fees", () => {
                before(async () => {
                    const debt = await pool.getReserveNormalizedVariableDebt(daiAddress);
                    const factor = (new ethers.BigNumber.from("10")).pow("9");
                    const debtInDai = debt.div(factor);
                    const borrowerAddress = await borrower.getAddress()
                    dai.transfer(borrowerAddress,debtInDai)
    
                    const totalOwed = borrowAmount.add(debtInDai);
                    await dai.connect(borrower).approve(contract.address, totalOwed);
                    await contract.connect(borrower).repay(daiAddress, totalOwed);
                });
    
                it('should no longer have the dai in the borrowers account', async () => {
                    const balance = await dai.balanceOf(await borrower.getAddress());
                    assert(balance.eq("0"));
                });
    
                it('should have no owed balance on the contract', async () => {
                    const data = await pool.getUserAccountData(contract.address);
                    assert(data.totalDebtETH.eq("0"));
                });
            });
        });
    })
})
