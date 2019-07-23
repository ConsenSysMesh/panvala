const moment = require('moment');

const ONE_DAY = 86400;
const ONE_WEEK = ONE_DAY * 7;

const timings = {
  ONE_DAY,
  ONE_WEEK,
  SLATE_SUBMISSION_DEADLINE: ONE_WEEK * 5.5,
  VOTING_PERIOD_START: ONE_WEEK * 11,
  REVEAL_PERIOD_START: ONE_WEEK * 12,
  EPOCH_LENGTH: ONE_WEEK * 13,
};

/**
 *
 * @param {number} ts UNIX timestamp in seconds
 */
function toDate(ts) {
  return moment.unix(ts).utc();
}

function range(n) {
  return Array.from(Array(n).keys());
}

function getTimings(startTime) {
  const epochTimings = {
    epochStart: startTime,
    slateSubmissionDeadline: startTime + timings.SLATE_SUBMISSION_DEADLINE,
    votingStart: startTime + timings.VOTING_PERIOD_START,
    votingEnd: startTime + timings.REVEAL_PERIOD_START,
  };
  return epochTimings;
}


function usage() {
  const usage = 'Usage: node epoch-timing.js [START_TIME] [NUM_EPOCHS]';
  console.log(usage);
}

function run() {
  // parse args
  const argv = process.argv;
  // console.log(argv);

  if (argv.length < 2) {
    usage();
    process.exit(1);
  }

  const first = argv[2];
  if (first === '-h' || first === '--help') {
    usage();
    process.exit(0);
  }

  const start = argv[2] || "2018-11-02 17:00Z";
  const numEpochs = parseInt(argv[3], 10) || 10;
  // console.log('start:', start);

  // timestamp in seconds
  let startTime;
  const dt = moment(start, [moment.ISO_8601, "YYYY-MM-DD"]);
  if (dt.isValid()) {
    startTime = dt.unix();
  } else {
    startTime = parseInt(start, 10);
  }

  const parsed = toDate(startTime);
  if (!parsed.isValid()) {
    console.error('Unsupported date format');
    usage();
    process.exit(1);
  }

  // output timings
  console.log(`SYSTEM START: ${toDate(startTime)} ${startTime} \n`);
  // console.log(startTime, numEpochs);

  const epochs = range(numEpochs);
  const epochTimings = epochs.map(e => startTime + timings.EPOCH_LENGTH * e).map(getTimings);
  // console.log(epochTimings);

  for (let i = 0; i < epochTimings.length; i += 1) {
    const t = epochTimings[i];
    console.log(`EPOCH ${i}`);
    console.log(`${toDate(t.epochStart)} : Epoch start -- ${t.epochStart}`);
    console.log(`${toDate(t.slateSubmissionDeadline)} : Slate submission initial deadline`);
    console.log(`${toDate(t.votingStart)} : Voting starts`);
    console.log(`${toDate(t.votingEnd)} : Voting ends`);
    console.log('');
  }
}

run();
