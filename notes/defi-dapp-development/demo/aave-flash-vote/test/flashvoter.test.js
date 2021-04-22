const { assert } = require("chai");

describe('Flash Vote', function () {
    let voter;
    let token;
    let depositorAddr = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";
    let depositorSigner;
    const depositAmount = ethers.utils.parseEther("10000000");
    before(async () => {
        const signer = await ethers.provider.getSigner(0);
        signer.sendTransaction({ to: depositorAddr, value: ethers.utils.parseEther("1") });
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [depositorAddr]
        })
        depositorSigner = await ethers.provider.getSigner(depositorAddr);
        dai = await ethers.getContractAt("IERC20", "0x6B175474E89094C44Da98b954EedeAC495271d0F",depositorSigner);

        const Govern = await ethers.getContractFactory("Govern");
        token = await Govern.deploy();
        await token.deployed();

        const FlashVoter = await ethers.getContractFactory("FlashVoter");
        voter = await FlashVoter.deploy(token.address, 0);
        await voter.deployed();

        await dai.transfer(voter.address,depositAmount)
    });

    it('should set the govern token address', async () => {
        const governAddress = await voter.governanceToken();
        assert.equal(governAddress, token.address);
    });

    it('should set the proposal id', async () => {
        const id = await voter.proposalId();
        assert.equal(id, 0);
    });
    describe("after flash voting", () => {
        // 2. Flash vote, when executeOperation() is empty
        // const LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN = '66';
        // it('should have revert with a flash loan execution error', async () => {
        //     let ex;
        //     try {
        //         await voter.flashVote();
        //     }
        //     catch (_ex) {
        //         ex = _ex;
        //     }
        //     assert(ex);
        //     assert(ex.toString().indexOf(`revert ${LP_INVALID_FLASH_LOAN_EXECUTOR_RETURN}`) >= 0);
        // });

        // 3. Pay Back
        // it('should not throw an error', async () => {
        //         await voter.flashVote();
        // });

        // 4. Flash Vote
        before(async () => {
            await voter.flashVote();
        });
        it('should have recorded 100k yes votes', async () => {
            const prop = await token.proposals(0);
            assert.equal(prop.yesCount.toString(), ethers.utils.parseEther("100000").toString());
        });
    });
});
