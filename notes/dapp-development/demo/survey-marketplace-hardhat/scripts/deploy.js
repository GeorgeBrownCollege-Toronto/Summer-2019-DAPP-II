
async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deloying contracts with the accounts :", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SurveyFactory = await ethers.getContractFactory("SurveyFactory");
    const surveyFactory = await SurveyFactory.deploy(ethers.constants.WeiPerEther);

    console.log("Survey Factory address :", surveyFactory.address);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
})