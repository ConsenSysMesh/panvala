import React, { useRef, useEffect, useState } from 'react';
import { providers, Contract, utils } from 'ethers';
import styled from 'styled-components';
import { layout, space } from 'styled-system';
import panUtils from 'panvala-utils';
import * as yup from 'yup';
import { Formik } from 'formik';

import Box from '../components/system/Box';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Nav from '../components/Nav';
import Button from '../components/Button';
import pollOne from '../img/poll-1.png';
import pollTwo from '../img/poll-2.png';
import { calculateTotalPercentage } from '../utils/poll';
import { sliceDecimals } from '../utils/format';
import { getEnvironment, Environment } from '../utils/env';
import {
  ModalBody,
  ModalOverlay,
  ModalTitle,
  ModalCopy,
  ModalSubTitle,
} from '../components/WebsiteModal';
import FieldText from '../components/FieldText';

const categories = [
  {
    categoryID: 1,
    title: 'Ethereum 2.0',
    previous: 34,
    description:
      'These grants fund work that scales the base layer of the Ethereum network by implementing the Ethereum 2.0 roadmap. Past Panvala grant recipients in this category are <strong>Prysmatic Labs</strong>, <strong>Sigma Prime</strong>, <strong>Nimbus</strong>, and <strong>Whiteblock</strong>. Other teams in our community that do this kind of work are <strong>ChainSafe</strong> and <strong>Harmony</strong>.',
  },
  {
    categoryID: 2,
    title: 'Layer 2 Scaling',
    previous: 5,
    description:
      'These grants fund work that scale Ethereum without modifying the base layer. Past Panvala grant recipients in this category are <strong>Connext</strong>, <strong>Counterfactual</strong>, <strong>Plasma Group</strong>, and <strong>Prototypal</strong>. Other teams in our community that do this kind of work are <strong>LeapDAO</strong>, <strong>OmiseGo</strong>, and <strong>Raiden</strong>.',
  },
  {
    categoryID: 3,
    title: 'Security',
    previous: 16,
    description:
      'These grants fund work that make it easier to build and run Ethereum applications that perform their intended functions without bugs or security flaws. Past Panvala grant recipients in this category are <strong>Level K</strong>, <strong>ConsenSys Diligence</strong>, <strong>Runtime Verification</strong>, and <strong>Dapphub</strong>. Other teams in our community that do this kind of work are <strong>Zeppelin</strong>, <strong>Trail of Bits</strong>, and <strong>Quantstamp</strong>.',
  },
  {
    categoryID: 4,
    title: 'Developer Tools and Growth',
    previous: 4,
    description:
      'These grants fund work that increase the productivity of Ethereum developers, and make it easier for new developers to get started so we can reach One Million Developers in 2020. Past Panvala grant recipients in this category are <strong>ethers.js</strong>, <strong>Asseth</strong>, and <strong>Tenderly</strong>. Other teams in our community that do this kind of work are <strong>Truffle</strong>, <strong>Embark</strong>, and <strong>Cryptoeconomics.study</strong>.',
  },
  {
    categoryID: 5,
    title: 'Dapps and Usability',
    previous: 4,
    description:
      'These grants fund work that produces Ethereum-based applications, games, and user experience improvements that bring more users to Ethereum. Past Panvala grant recipients in this category are <strong>BrightID</strong>, <strong>Gnosis</strong>, and <strong>Bounties Network</strong>. Other teams in our community that do this kind of work are <strong>MetaCartel DAO</strong>, <strong>Axie Infinity</strong>, <strong>Burner Wallet</strong> and <strong>Universal Login</strong>.',
  },
  {
    categoryID: 6,
    title: 'Panvala',
    previous: 37,
    description:
      'These grants fund work that improves Panvala itself and produces recommendations for the network to evaluate. Past Panvala grant recipients in this category are <strong>ConsenSys PAN</strong> and <strong>The Astrotrope</strong>.',
  },
];

const pollID = '1';
const pollDeadline = 'November 22';

const ClipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${layout};
  ${space};
`;

const Poll = () => {
  const pollFormRef = useRef(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);
  const [ptsRemaining, setPtsRemaining] = useState(100);
  const [provider, setProvider] = useState();
  const [allocations, setAllocations] = useState([]);
  const [percentages, setPercentages] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      // Listen for network changes -> reload page
      window.ethereum.on('networkChanged', network => {
        console.log('MetaMask network changed:', network);
        window.location.reload();
      });
    }
  }, []);

  function handleViewPollClick() {
    pollFormRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  }

  async function setSelectedAccount() {
    let selectedAccount = (await provider.listAccounts())[0];
    // user not enabled for this app
    if (!selectedAccount) {
      try {
        selectedAccount = (await window.ethereum.enable())[0];
      } catch (error) {
        if (error.stack.includes('User denied account authorization')) {
          alert(
            'MetaMask not enabled. In order to respond to the poll, you must authorize this app.'
          );
        }
      }
    }
    await setAccount(selectedAccount);
    return selectedAccount;
  }

  useEffect(() => {
    async function getBalance() {
      const tokenAbi = panUtils.contractABIs.BasicToken;
      const token = new Contract(
        '0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44',
        tokenAbi.abi,
        provider
      );

      let acct = (await provider.listAccounts())[0];

      // User has not enabled the app. Trigger metamask pop-up.
      if (!acct) {
        acct = await setSelectedAccount();
      }

      // Do not proceed with callback (setSelectedAccount)
      if (!acct) {
        return false;
      }

      const bal = await token.balanceOf(acct);
      const balance = utils.formatUnits(bal, 18);
      setBalance(sliceDecimals(balance.toString()));
      return balance;
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined' &&
      typeof provider !== 'undefined'
    ) {
      // Only set selectedAccount if user is connected to the app
      // (works even with 0 balance)
      getBalance().then(bal => bal && setSelectedAccount());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  async function connectWallet() {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      if (typeof provider === 'undefined') {
        const p = new providers.Web3Provider(window.ethereum);
        const network = await p.getNetwork();
        if (network.chainId !== 1) {
          alert('Please connect to the Main Ethereum Network to continue.');
          return;
        }

        setProvider(p);
        const acct = (await p.listAccounts())[0];
        return acct;
      } else if (!account) {
        return setSelectedAccount();
      }
    } else {
      alert('MetaMask not found. Please download MetaMask @ metamask.io');
    }
  }

  // Validate individual form field
  function validatePercentage(value) {
    let error;
    if (value < 0 || value > 100) {
      error = 'Invalid percentage';
    }
    return error;
  }

  // Validate the whole form
  const PollFormSchema = yup.object({
    categories: yup.object(),
    firstName: yup.string().trim(),
    lastName: yup.string().trim(),
    email: yup.string().email('Please enter a valid email address'),
  });

  // User changes a poll value - update state
  function updatePercentages(value, categoryID) {
    setPercentages({
      ...percentages,
      [categoryID]: value,
    });
  }

  // Change the display amount of points remaining
  // Triggered by change in values
  useEffect(() => {
    const subtotal = calculateTotalPercentage(percentages);
    setPtsRemaining(100 - subtotal);
  }, [percentages]);

  // User submits the poll
  async function handleFormSubmit(values, actions) {
    setSubmitted(true);

    if (!provider) {
      const acct = await connectWallet();
      if (!acct) {
        return;
      }
    }
    if (!account) {
      await connectWallet();
    }

    // transform the allocations for submission
    // Format allocations
    const chosenAllocations = categories.map(c => {
      const cid = c.categoryID;
      let points = percentages[cid];
      if (points === '') {
        points = 0;
      }
      return {
        categoryID: cid,
        points: parseInt(points),
      };
    });

    // console.log('allocations:', allocations);

    // Update allocations for display after voting
    await setAllocations(chosenAllocations);

    // post form
    await sendPollData(chosenAllocations);

    actions.setSubmitting(false);
  }

  function sendPollData(allocations) {
    if (account && allocations.length > 0 && !alreadyVoted) {
      return postPoll(allocations);
    } else {
      // Should never get here
      alert('Problem submitting poll');
    }
  }

  function updateVotingStatus() {
    if (account) {
      const { endpoint, headers } = getEndpoint('GET');
      console.log('endpoint:', endpoint);
      fetch(endpoint, {
        method: 'GET',
        headers,
      })
        .then(res => {
          console.log('res:', res);
          if (res.status === 200) {
            return res.json();
          }
        })
        .then(json => {
          console.log('json:', json);
          // Already voted, show alert
          if (json.responded) {
            setAlreadyVoted(true);
            if (submitted) {
              alert('The connected account has already voted in this poll.');
            }
          }
        });
    }
  }

  useEffect(() => {
    // Do this every time the account changes
    updateVotingStatus();

    if (account !== '') {
      window.ethereum.on('accountsChanged', network => {
        console.log('MetaMask account changed:', network);
        window.location.reload();
      });
    }
  }, [account]);

  function getEndpoint(method) {
    const environment = getEnvironment();
    const apiHost =
      environment === Environment.production
        ? 'https://api.panvala.com'
        : environment === Environment.staging
        ? 'https://staging-api.panvala.com'
        : 'http://localhost:5001';

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': apiHost,
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type',
    };
    if (method === 'POST') {
      return { endpoint: `${apiHost}/api/polls/${pollID}`, headers };
    } else {
      return { endpoint: `${apiHost}/api/polls/${pollID}/status/${account}`, headers };
    }
  }

  // Posts poll to database
  async function postPoll(allocations) {
    function generateMessage(account, pollID) {
      // Always use checksum address in the message
      return `Response from ${account} for poll ID ${pollID}`;
    }

    console.log('panUtils:', panUtils);
    const message = generateMessage(account, pollID);

    const signer = provider.getSigner();
    let signature;
    try {
      signature = await signer.signMessage(message);
    } catch (error) {
      alert('Message signature rejected. Vote was not submitted to poll.');
      return;
    }

    const data = {
      response: {
        account,
        allocations,
      },
      signature,
    };

    console.log('data:', data);

    const { endpoint, headers } = getEndpoint('POST');

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    }).catch(err => {
      if (err.message.includes('Failed to fetch')) {
        alert(
          'Uh oh! Failed to submit the poll. Please verify each field and try again, or contact the Panvala team at info@panvala.com'
        );
      }
    });

    // Response errors
    if (res && res.status !== 200) {
      console.log('res:', res);
      const json = await res.json();
      console.log('json:', json);
      if (json.hasOwnProperty('errors') && json.errors.length > 0) {
        console.log('ERROR:', json.errors);
      }
      if (json.hasOwnProperty('msg')) {
        if (json.msg.includes('Invalid poll response request data')) {
          alert(
            'Poll form validation failed. Please verify each field and try again, or contact the Panvala team @ info@panvala.com'
          );
        }
        if (json.msg.includes('Signature does not match account')) {
          alert(
            'Message signature did not match the signing account. Vote was not submitted to poll.'
          );
        }
        if (json.msg.includes('Validation error')) {
          if (json.errors[1].message === 'account must be unique') {
            alert('Each account may only vote once per poll. Vote was not submitted to poll.');
          }
        }
      }
    } else {
      setModalOpen(true);
      setPtsRemaining(100);
      setPercentages({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' });
      setAlreadyVoted(true);
    }
  }

  return (
    <Layout>
      <SEO title="Poll" />

      {welcomeModalOpen && !account && (
        <div className="flex justify-center h5 absolute top-0 left-0 right-0">
          <ModalOverlay handleClick={() => setWelcomeModalOpen(false)} />
          <ModalBody>
            <ModalTitle>Welcome to the Panvala Poll</ModalTitle>
            <ModalCopy>
              This poll is for PAN holders to signal their preferences for the next batch of grant
              allocations. If you do not currently have a PAN balance but want to vote, or you would
              like to increase your voting power before the <b>{pollDeadline}</b> deadline, you can
              do so via Uniswap.
            </ModalCopy>
            <Box flex justifyContent="center">
              <a
                href="https://uniswap.exchange?outputCurrency=0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44"
                target="_blank"
                rel="noopener noreferrer"
                className="link b dim blue"
              >
                <Button p={3} mr={3} text="Get PAN Tokens" bg="#F5F6F9" color="black" />
              </a>
              <Button p={3} ml={3} text="Connect Wallet" onClick={connectWallet} />
            </Box>
          </ModalBody>
        </div>
      )}

      <section className="bg-gradient bottom-clip-up-1">
        <Nav account={account} balance={balance} handleClick={connectWallet} />

        {/* <!-- Instructions --> */}
        <ClipContainer p={['1rem 0 4rem', '2rem 3rem 4rem', '2rem 5rem 5rem', '5rem 10rem 8rem']}>
          <Box width={[1, 1, 0.5]} px={['4', '0']}>
            <h1 className="white f1-5 b ma0 mb4 w-80-l w-100">The Panvala Poll</h1>
            <div className="f5 lh-copy mb3">
              <p className="w-60 mb0 white b">
                We're polling PAN holders on their funding priorities in the Ethereum ecosystem.
              </p>
              <p className="white-60 fw4 ma0 w-50-l w-100">
                The results of the poll will shape Panvala's next quarterly budget of 2,000,000 PAN,
                which will be released on January 31.
              </p>
            </div>
            <div className="mv3 b">
              <button
                className="f6 link dim bn br-pill white bg-teal fw7 pointer pv3 ph4"
                onClick={handleViewPollClick}
              >
                View Poll
              </button>
            </div>
          </Box>
          <Box width={[1, 1, 0.5]} p={[4, 2]} display={['none', 'none', 'block']}>
            <img alt="" src={pollOne} className="w-100 center" />
          </Box>
        </ClipContainer>
      </section>

      {/* Fund work that matters */}
      <section className="cf w-100 bottom-clip-down bg-white flex justify-between items-center">
        <Box
          p={['3rem', '2rem']}
          mb={['1rem', '0']}
          flex
          alignItems="center"
          justifyContent="space-around"
        >
          <div className="w-100 w-25-ns dn dib-ns">
            <img alt="" src={pollTwo} className="center" />
          </div>
          <div className="w-100 w-50-ns dib">
            <h2>Fund work that matters</h2>
            <p className="lh-copy">
              PAN tokens have been granted to teams that the whole Ethereum community depends on.
              The more tokens you acquire to vote, the more work those teams can fund with their
              tokens.
            </p>
            <Button
              handleClick={connectWallet}
              bg={account ? '#2138B7' : '#46B0AA'}
              text={account ? 'Wallet connected!' : 'Connect your wallet'}
            />
          </div>
        </Box>
      </section>

      {/* Ballot */}
      <section id="poll-form" ref={pollFormRef} className="pv6 mb4 bg-gray full-clip-down-lg">
        <div className="w-100 w-60-ns center">
          {modalOpen ? (
            <Box flex flexDirection="column" justifyContent="center" alignItems="center">
              <ModalTitle>Thank you for voting!</ModalTitle>
              <Box color="#555" p={4} m={2} mx={5} textAlign="center" className="lh-copy">
                Thank you for voting in the poll for the current batch. Your vote helps decide which
                types of grants are awarded. Here is what you voted for:
              </Box>
              <Box width="75%" mt="3">
                <Box display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    pb="2"
                    px="2"
                    fontWeight="bold"
                    color="black"
                  >
                    <Box>Category</Box>
                    <Box>Allocation</Box>
                  </Box>
                  {categories.map((c, i) => (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      key={c.categoryID}
                      bg={i % 2 === 0 && '#F5F6F9'}
                      p={2}
                    >
                      <Box>{c.title}</Box>
                      <Box>{`${allocations.length && allocations[c.categoryID - 1].points}%`}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <ModalSubTitle>{`Current voting weight: ${balance} PAN`}</ModalSubTitle>
              <Box color="#555" p={4} m={2} mx={5} textAlign="center" className="lh-copy">
                Even though your vote has been submitted, you have until the <b>{pollDeadline}</b>{' '}
                deadline to increase the weight of your vote through holding more PAN tokens.
              </Box>
              <a
                href="https://uniswap.exchange?outputCurrency=0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44"
                target="_blank"
                rel="noopener noreferrer"
                className="link b dim blue"
              >
                <Button p={3} text="Increase Voting Weight" />
              </a>
            </Box>
          ) : alreadyVoted ? (
            <Box flex flexDirection="column" justifyContent="center" alignItems="center">
              <ModalTitle>Thank you for voting!</ModalTitle>
              <ModalSubTitle>{`Current voting weight: ${balance} PAN`}</ModalSubTitle>
              <Box color="#555" p={4} m={2} mx={5} textAlign="center" className="lh-copy">
                Thank you for voting in the poll for the current batch. Even though your vote has
                been submitted you can increase the weight of your vote through holding more PAN
                tokens.
              </Box>
              <a
                href="https://uniswap.exchange?outputCurrency=0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44"
                target="_blank"
                rel="noopener noreferrer"
                className="link b dim blue"
              >
                <Button p={3} text="Increase Voting Weight" />
              </a>
            </Box>
          ) : (
            <>
              <div className="tc pv4">
                <h2>Category Ballot</h2>
                <Box my={1} className="w-80 center tc lh-copy">
                  This poll is for PAN holders to signal their preferences for the next batch of
                  grant allocations. If you do not currently have a PAN balance but want to vote, or
                  you would like to increase your voting power before the <b>{pollDeadline}</b>{' '}
                  deadline, you can do so via Uniswap.
                  <Box flex justifyContent="center" my={3}>
                    <a
                      href="https://uniswap.exchange?outputCurrency=0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link b dim blue"
                    >
                      <Button text="Get PAN Tokens" />
                    </a>
                  </Box>
                </Box>
              </div>

              <Box flex justifyContent="center" my={3} p={3}>
                Please distribute 100 percentage points between the following categories:
              </Box>

              <div className="bg-white shadow lh-copy black">
                <Formik
                  initialValues={{
                    categories: categories.reduce((prev, current) => {
                      return { ...prev, [current.categoryID]: '' };
                    }, {}),
                    firstName: '',
                    lastName: '',
                    email: '',
                  }}
                  validate={values => {
                    return PollFormSchema.validate(values).then(() => {
                      // validate the sum of points
                      const totalPercentage = calculateTotalPercentage(percentages);
                      if (totalPercentage < 100) {
                        return { poll: 'Please allocate all 100 points' };
                      } else if (totalPercentage > 100) {
                        return { poll: 'Please allocate no more than 100 points' };
                      }
                    }).catch(error => {
                      return { [error.path]: error.message }
                    });
                  }}
                  validateOnBlur={true}
                  validateOnChange={false}
                  onSubmit={handleFormSubmit}
                >
                  {props => (
                    <form onSubmit={props.handleSubmit}>
                      {categories.map((category, index) => {
                        const { description, title, previous, categoryID } = category;
                        const identifier = `poll-points-category-${categoryID}`;

                        const name = `categories.${categoryID}`;

                        return (
                          <div key={identifier} className="cf pa3 bb bw-2 b--black-10">
                            <div className="fl w-80 pa2 pr4">
                              <div className="f4 b">{title}</div>
                              <p dangerouslySetInnerHTML={{ __html: description }}></p>
                            </div>
                            <div className="fl w-20 pa2 f5 tr">
                              <div className="b ttu f6 o-50">previous batch</div>
                              <div className="pb3">{previous}%</div>
                              <div className="b ttu f6 o-50">
                                <label className="ma0 mb3">Batch five</label>
                              </div>
                              <div>
                                <FieldText
                                  type="number"
                                  name={name}
                                  id={identifier}
                                  max="100"
                                  min="0"
                                  placeholder="%"
                                  // validate the individual percentages on blur
                                  onBlur={() => {
                                    props.validateField(name);
                                  }}
                                  onChange={e => {
                                    props.handleChange(e);
                                    updatePercentages(e.target.value, category.categoryID);
                                  }}
                                  value={props.values.categories[categoryID]}
                                  validate={validatePercentage}
                                  className="f6 input-reset b--black-10 pv3 ph2 db w-100 br3 mt2 tr"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* <-- name and email --> */}
                      <div className="pa4 bb bw-2 b--black-10 black-60">
                        <Box color="black" display="flex" justifyContent="flex-end" mb={4}>
                          Points Remaining:&nbsp;<b>{ptsRemaining}</b>
                        </Box>
                        <div className="cf pv2">
                          <div className="fl w-50 pr3">
                            <FieldText
                              type="text"
                              id="firstName"
                              name="firstName"
                              label="First name (Optional)"
                              placeholder="Enter your first name"
                              className="w-100 pa2"
                              value={props.values.firstName}
                              onChange={props.handleChange}
                            />
                          </div>
                          <div className="fl w-50">
                            <FieldText
                              type="text"
                              id="lastName"
                              name="lastName"
                              label="Last Name (Optional"
                              placeholder="Enter your last name"
                              className="w-100 pa2"
                              value={props.values.lastName}
                              onChange={props.handleChange}
                            />
                          </div>
                        </div>
                        <div className="pv2">
                          <FieldText
                            type="text"
                            id="email"
                            name="email"
                            label="Email (Optional)"
                            placeholder="Enter your email"
                            className="w-100 pa2"
                            value={props.values.email}
                            onChange={props.handleChange}
                          />
                        </div>
                      </div>

                      <div className="cf pa4">
                        <div className="f5 tl pb3 lh-copy">
                          The final poll results will be calculated using the balance of PAN tokens
                          in your account on {pollDeadline}.
                        </div>
                        <div className="f5 tl pb4 lh-copy">
                          <b>
                            Reminder: You will not lose any tokens or ETH for participating in this
                            poll.
                          </b>
                        </div>
                        {/* Form-level error messages */}
                        <div>
                          {props.errors.poll ? (
                            <div className="red pb2">{props.errors.poll}</div>
                          ) : null}
                        </div>
                        <div className="fr w-100 w-70-l flex-column items-end">
                          <div className="flex justify-end">
                            <input
                              type="submit"
                              name="submit"
                              className="f6 link dim bn br-pill pv3 ph4 bg-teal white fw7"
                              value="Submit Vote"
                              disabled={props.isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Poll;
