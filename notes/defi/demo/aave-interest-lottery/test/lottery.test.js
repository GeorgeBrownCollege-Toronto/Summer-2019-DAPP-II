// 1. Drawing
// const { assert } = require("chai");

// describe('Lottery', function () {
//     before(async () => {
//         const Lottery = await ethers.getContractFactory("Lottery");
//         lottery = await Lottery.deploy();
//         await lottery.deployed();
//     });

//     it('should set the lottery drawing', async () => {
//         const drawing = await lottery.drawing();
//         assert(drawing, "expected the drawing uint to be set!");
//     });

//     it('should set the lottery drawing for a week away', async () => {
//         const drawing = await lottery.drawing();
//         const unixSeconds = Math.floor(Date.now() / 1000);

//         const oneWeek = 7 * 24 * 60 * 60;
//         const oneWeekFromNow = unixSeconds + oneWeek;
//         assert(drawing.gte(oneWeekFromNow.toString()), "expected the lottery drawing to be a week from now");

//         const eightDays = 8 * 24 * 60 * 60;
//         const eightDaysFromNow = unixSeconds + eightDays;
//         assert(drawing.lt(eightDaysFromNow.toString()), "expected the lottery drawing to less than 8 days away");
//     });
// });

const { assert } = require("chai");

describe('Lottery', function () {
    let lottery;
    let depositorAddr = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";
    let depositorSigner;
    let dai;
    let aDai;
    let purchasers;
    const ticketPrice = ethers.utils.parseEther("100");
    before(async () => {
        const signer = await ethers.provider.getSigner(0);
        signer.sendTransaction({ to: depositorAddr, value: ethers.utils.parseEther("1") });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [depositorAddr]
        })
        depositorSigner = await ethers.provider.getSigner(depositorAddr);
        dai = await ethers.getContractAt("IERC20", "0x6b175474e89094c44da98b954eedeac495271d0f",depositorSigner);
        aDai = await ethers.getContractAt("IERC20", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");

        purchasers = (await ethers.provider.listAccounts()).slice(1, 4);        

        await dai.transfer(purchasers[0],ticketPrice)
        await dai.transfer(purchasers[1],ticketPrice)
        await dai.transfer(purchasers[2],ticketPrice)

        const Lottery = await ethers.getContractFactory("Lottery", depositorSigner);
        lottery = await Lottery.deploy();
        await lottery.deployed();
    });

    it('should set the lottery drawing', async () => {
        const drawing = await lottery.drawing();
        assert(drawing);
    });
    // 2. Purchase
    // describe('after multiple purchases from the same address', () => {
    //     before(async () => {
    //         const signer = await ethers.provider.getSigner(5);
    //         const signerAddress = await signer.getAddress();
    //         dai.transfer(signerAddress,ticketPrice)
    //         await dai.connect(signer).approve(lottery.address, ticketPrice);
    //         await lottery.connect(signer).purchase();
    //     });

    //     it('should revert on the second purchase attempt', async () => {
    //         let ex;
    //         try {
    //             await dai.connect(signer).approve(lottery.address, ticketPrice);
    //             await lottery.connect(signer).purchase();
    //         }
    //         catch(_ex) {
    //             ex = _ex;
    //         }
    //         assert(ex, "expected the transaction to revert when a address attempts a second purchase");
    //     });
    // });

    // describe('after multiple purchases from different addresses', () => {
    //     before(async () => {
    //         for (let i = 0; i < purchasers.length; i++) {
    //             const signer = await ethers.provider.getSigner(purchasers[i]);
    //             await dai.connect(signer).approve(lottery.address, ticketPrice);
    //             await lottery.connect(signer).purchase();
    //         }
    //     });

    //     it('should have an dai balance', async () => {
    //         const balance = await dai.balanceOf(lottery.address);
    //         assert(balance.gte(ticketPrice.mul(purchasers.length)), "expected the contract to have dai for each purchase");
    //     });
    // });

    // 3. Earn Interest
    it('should set the lottery drawing', async () => {
        const drawing = await lottery.drawing();
        assert(drawing);
    });

    describe('after multiple purchases', () => {
        before(async () => {
            for (let i = 0; i < purchasers.length; i++) {
                const signer = await ethers.provider.getSigner(purchasers[i]);
                await dai.connect(signer).approve(lottery.address, ticketPrice);
                await lottery.connect(signer).purchase();
            }
        });

        it('should have an aDai balance', async () => {
            const balance = await aDai.balanceOf(lottery.address);
            assert(balance.gte(ticketPrice.mul(purchasers.length)), "expected the contract to have aDai for each purchase");
        });

        // 4. Pick winner
        describe('after picking a winner', () => {
            let tx;
            before(async () => {
                const unixSeconds = Date.now() / 1000;
                const oneWeek = 8 * 24 * 60 * 60;
                await hre.network.provider.request({
                    method: "evm_setNextBlockTimestamp",
                    params: [unixSeconds + oneWeek]
                });
                await hre.network.provider.request({ method: "evm_mine" });
                let response = await lottery.pickWinner();
                tx = await response.wait();
            });

            it('should emit an event', async () => {
                const winnerEvent = tx.events.find(x => x.event === "Winner");
                assert(winnerEvent, "Expected a winner event to be emitted");
            });

            it('should no longer have an aDai balance', async () => {
                const balance = await aDai.balanceOf(lottery.address);
                assert(balance.eq("0"));
            });

            it('should provide each purchaser with their initial balance', async () => {
                for (let i = 0; i < purchasers.length; i++) {
                    const address = purchasers[i];
                    const balance = await dai.balanceOf(address);
                    assert(balance.gte(ticketPrice));
                }
            });

            it('should provide the winner with the interest', async () => {
                const winnerEvent = tx.events.find(x => x.event === "Winner");
                const winner = winnerEvent.args[0];
                const balance = await dai.balanceOf(winner);
                assert(balance.gt(ticketPrice));
            });
        });
    });
});

