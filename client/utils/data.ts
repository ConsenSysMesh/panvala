import { IProposal, ISlate } from '../interfaces';
import { statuses } from './status';

export const proposalsArray: IProposal[] = [
  {
    id: 2,
    firstName: 'Alice',
    lastName: 'Doe',
    email: 'alice@email.com',
    title: 'K Semantics for Web Assembly',
    summary:
      'A proposal to make Ethereum safer by enabling developers to formally verify smart contracts that run on Web Assembly.',
    tokensRequested: '200000',
    category: 'GRANT',
    totalBudget: '100 for this. 200 for that.',
    otherFunding: 'nope!',
    projectPlan: 'plan',
    projectTimeline: 'timeline',
    teamBackgrounds: 'backgrounds',
    awardAddress: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Doe',
    email: 'bob@email.com',
    title: 'Registry Builder Vote Weighting',
    summary:
      'A proposal to make Ethereum safer by improving a reusable library for token-curated registries.',
    tokensRequested: '175000',
    category: 'GRANT',
    totalBudget: '100 for this. 200 for that.',
    otherFunding: 'nope!',
    projectPlan: 'plan',
    projectTimeline: 'timeline',
    teamBackgrounds: 'backgrounds',
    awardAddress: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
  },
  {
    id: 4,
    firstName: 'Cat',
    lastName: 'Doe',
    email: 'cat@email.com',
    title: 'Tidbit Dynamic Oracles',
    summary: 'A proposal to make Ethereum safer by improving a reusable library for oracles.',
    tokensRequested: '150000',
    category: 'GRANT',
    totalBudget: '100 for this. 200 for that.',
    otherFunding: 'nope!',
    projectPlan: 'plan',
    projectTimeline: 'timeline',
    teamBackgrounds: 'backgrounds',
    awardAddress: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
  },
  {
    id: 5,
    firstName: 'Dog',
    lastName: 'Doe',
    email: 'dog@email.com',
    title: 'Infrastructure Monitoring',
    summary:
      'A proposal to make Ethereum safer by monitoring high value systems and assets on Ethereum.',
    tokensRequested: '200000',
    category: 'GRANT',
    totalBudget: '100 for this. 200 for that.',
    otherFunding: 'nope!',
    projectPlan: 'plan',
    projectTimeline: 'timeline',
    teamBackgrounds: 'backgrounds',
    awardAddress: '0xd09cc3bc67e4294c4a446d8e4a2934a921410ed7',
  },
];

export const slatesArray: ISlate[] = [
  {
    id: 'QmRZxt2b1FVZPNqd8hsiykDL3TdBDeTSPX9Kv46HmX4Gx1',
    category: 'GRANT',
    status: statuses.PENDING_VOTE,
    deadline: 1539044131,
    title: 'Panvala Award Committee',
    description:
      'In tempus sem orci, eu auctor mi finibus eu. Nam mi risus, pretium ut laoreet fermentum, cursus nec mi. Nulla ...',
    owner: 'Guy Reid',
    ownerAddress: '0xd115bffabbdd893a6f7cea402e7338643ced44a6',
    organization: 'Panvala',
    incumbent: true,
    proposals: proposalsArray,
    requiredStake: '500',
  },
  {
    id: 'QmRZxt2b1FVZPNqd8hsiykDL3TdBDeTSPX9Kv46HmX4Gx2',
    category: 'GRANT',
    status: statuses.PENDING_TOKENS,
    deadline: 1539044131,
    title: 'Grant Awards',
    description:
      'In tempus sem orci, eu auctor mi finibus eu. Nam mi risus, pretium ut laoreet fermentum, cursus nec mi. Nulla sodales ultrices tellus sodales consectetur.Nullam id mattis velit.',
    owner: 'Marcus Berten',
    ownerAddress: '0xd115bffabbdd893a6f7cea402e7338643ced44a6',
    organization: 'Grant Awards Group',
    incumbent: false,
    proposals: proposalsArray,
    requiredStake: '500',
  },
  // {
  //   id: 'QmRZxt2b1FVZPNqd8hsiykDL3TdBDeTSPX9Kv46HmX4Gx3',
  //   category: 'GOVERNANCE',
  //   status: statuses.PENDING_TOKENS,
  //   deadline: false,
  //   title: 'Panvala Dev',
  //   description:
  //     'In tempus sem orci, eu auctor mi finibus eu. Nam mi risus, pretium ut laoreet fermentum, cursus nec mi. Nulla sodales ultrices tellus sodales consectetur.Nullam id mattis velit.',
  //   owner: 'Amber Gilbert',
  //   ownerAddress: '0xd115bffabbdd893a6f7cea402e7338643ced44a6',
  //   organization: 'Panvala',
  //   incumbent: false,
  //   proposals: proposalsArray,
  //   requiredStake: '500',
  // },
  // {
  //   id: 'QmRZxt2b1FVZPNqd8hsiykDL3TdBDeTSPX9Kv46HmX4Gx4',
  //   category: 'GOVERNANCE',
  //   status: statuses.PENDING_VOTE,
  //   deadline: 1539044231,
  //   title: 'Governance Change',
  //   description:
  //     'In tempus sem orci, eu auctor mi finibus eu. Nam mi risus, pretium ut laoreet fermentum, cursus nec mi. Nulla sodales ultrices tellus sodales consectetur.Nullam id mattis velit.',
  //   owner: 'Victoria Johnson',
  //   ownerAddress: '0xd115bffabbdd893a6f7cea402e7338643ced44a6',
  //   organization: 'Governance Group',
  //   incumbent: false,
  //   proposals: proposalsArray,
  //   requiredStake: '500',
  // },
];
