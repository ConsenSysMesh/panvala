const fs = require('fs');

const Gatekeeper = fs.readFileSync('../governance-contracts/build/contracts/Gatekeeper.json');
const ParameterStore = fs.readFileSync('../governance-contracts/build/contracts/ParameterStore.json');
const TokenCapacitor = fs.readFileSync('../governance-contracts/build/contracts/TokenCapacitor.json');

const contracts = [Gatekeeper, ParameterStore, TokenCapacitor];

contracts.forEach(contract => {
  // extract only the fields we need
  const { abi, bytecode, contractName, networks, devdoc } = JSON.parse(contract);

  // serialize json file
  const jsonFile = JSON.stringify({
    abi,
    bytecode,
    contractName,
    networks,
    devdoc,
  });

  console.log(`Writing ${contractName} to /client/utils/abis/`);

  fs.writeFile(`../client/utils/abis/${contractName}.json`, jsonFile, err => {
    if (err) throw err;
    console.log('The file has been written:', contractName);
  });
});
