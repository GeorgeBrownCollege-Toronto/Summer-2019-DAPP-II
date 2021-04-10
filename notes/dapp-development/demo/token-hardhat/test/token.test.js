const {expect} = require("chai");

describe("Token contract", () => {
    // hooks
    // test cases
    it("Deployment should assign total supply to tokens of the owner", async () => {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        const gbcToken = await Token.deploy();

        const ownerBalance = await gbcToken.balances(owner.address)
        expect(await gbcToken.totalSupply()).to.equal(ownerBalance);
    })
})

describe("Transactions", () => {
    // hooks
    // test cases
    it("Should transfer tokens between accounts", async () => {
        const [owner, addr1, addr2] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("Token");
        const gbcToken = await Token.deploy();
        
        await gbcToken.transfer(addr1.address, 500);

        expect(await gbcToken.balances(addr1.address)).to.equal(500);

        await gbcToken.connect(addr1).transfer(addr2.address, 100);

        expect(await gbcToken.balances(addr2.address)).to.equal(100);
    })
})