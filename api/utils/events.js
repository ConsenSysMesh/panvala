const { EthEvents } = require('eth-events');
const {
  contractABIs: { Gatekeeper, TokenCapacitor, ParameterStore },
} = require('../../packages/panvala-utils');

const { getContracts } = require('./eth');
const { mapRequestsToProposals } = require('./requests');

async function getAllEvents(fromBlock) {
  const {
    network,
    parameterStore,
    gatekeeper,
    tokenCapacitor,
    rpcEndpoint,
    genesisBlockNumber,
  } = await getContracts();
  // disable notifications on mainnet and rinkeby
  if (network.chainId === 4 || network.chainId === 1) {
    return [];
  }

  const contracts = [
    {
      abi: Gatekeeper.abi,
      address: gatekeeper.address,
    },
    {
      abi: TokenCapacitor.abi,
      address: tokenCapacitor.address,
    },
    {
      abi: ParameterStore.abi,
      address: parameterStore.address,
    },
  ];
  // init eth-events
  const ethEvents = EthEvents(contracts, rpcEndpoint, genesisBlockNumber);
  if (!fromBlock) {
    fromBlock = genesisBlockNumber;
  }

  // gatekeeper and tokenCapacitor filters
  const gkFilter = {
    fromBlock,
    address: gatekeeper.address,
  };
  const tcFilter = {
    fromBlock,
    address: tokenCapacitor.address,
  };
  const psFilter = {
    fromBlock,
    address: parameterStore.address,
  };

  try {
    // get all events
    const gkEvents = await ethEvents.getEventsByFilter(gkFilter);
    const tcEvents = await ethEvents.getEventsByFilter(tcFilter);
    const psEvents = await ethEvents.getEventsByFilter(psFilter);
    const events = gkEvents.concat(tcEvents).concat(psEvents);

    // set this to true if you want to map requests to proposals and write to db
    let saveRequests = true;
    if (saveRequests) {
      await mapRequestsToProposals(events, gatekeeper);
    }

    return events;
  } catch (error) {
    console.log('error:', error);
    return [];
  }
}

async function getParametersSet(fromBlock) {
  const { network, rpcEndpoint, genesisBlockNumber, parameterStore } = await getContracts();
  // disable notifications on mainnet and rinkeby
  if (network.chainId === 1 || network.chainId === 4) {
    // NOTE: will be an issue when rendering parameters other than
    // slateStakeAmount and gatekeeperAddress
    return [];
  }

  const contract = {
    abi: ParameterStore.abi,
    address: parameterStore.address,
  };

  const ethEvents = EthEvents([contract], rpcEndpoint, genesisBlockNumber);

  const filter = {
    fromBlock: fromBlock || genesisBlockNumber,
    address: parameterStore.address,
  };
  try {
    const events = await ethEvents.getEventsByFilter(filter);

    const parameterInitializedEvents = events.filter(e => e.name === 'ParameterSet');
    return parameterInitializedEvents.reduce((acc, val) => {
      return {
        [val.values.name]: val.values.value,
        ...acc,
      };
    }, {});
  } catch (error) {
    console.log('error:', error);
    return {};
  }
}

module.exports = {
  getAllEvents,
  getParametersSet,
};
