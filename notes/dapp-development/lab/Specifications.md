## Lab : Smart contract specifications 

The functions of the contract implement the functionalities described in previous lab. 

- For each function : 
    - give the name , 
    - kind of the function, 
    - the modifiers enforcing the constraints related to its call
    - the parameters 
    - a description of its purpose.
- Submit your smart contract specifications to the blackboard. (You can create a specifications table in docs/spreadsheet/excel/word/markdown or any other tool of your choice)


## Reference

### `SurveyFactory.sol`

|Function Name | Function Visibility | Function mutability | Modifiers | Parameters | Action - Notes |
|--------------|---------------------|----------------------------------|-----------|------------|----------------|
| `createSurvey` | `external`        | `payable`                        | `notTheOwner` | - `uint price`<br/> - `string memory name` | - validates that amount is greater than the surveyCreation Fees<br/> - calculates the survey reward - maintains the surveyToOwner ledger<br/> - determines the survey ID<br/> - deploys the survey contract<br/> - notifies about survey creation<br/> - returns the address of deploy survey contract and survey id | 
| `constructor` | `public` | N/A | N/A | `uint _surveyCreationFees` | - sets the `surveycreationfees` within the contract<br/>- notifies about initialization of the survey |

### `Survey.sol`

|Function Name | Function Visibility | Function mutability | Modifiers | Parameters | Action - Notes |
|--------------|---------------------|----------------------------------|-----------|------------|----------------|
| `constructor` | `public` | `payable` | N/A | `address _owner` | - validate the address of owner<br/>- validate if payment is more than zero<br/>- store the address of factory owner<br/>- store the address of survey owner<br/>- notify when the survey is initialized |