/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter } from 'ethers';
import { Provider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import { TransactionOverrides } from '.';

export class Gatekeeper extends Contract {
  functions: {
    voteTokenBalance(arg0: string): Promise<BigNumber>;

    delegate(arg0: string): Promise<string>;

    ballots(arg0: number | string | BigNumber): Promise<boolean>;

    requests(
      arg0: number | string | BigNumber
    ): Promise<{
      metadataHash: (string)[];
      resource: string;
      approved: boolean;
      expirationTime: BigNumber;
      epochNumber: BigNumber;
      0: (string)[];
      1: string;
      2: boolean;
      3: BigNumber;
      4: BigNumber;
    }>;

    incumbent(arg0: string): Promise<string>;

    slates(
      arg0: number | string | BigNumber
    ): Promise<{
      recommender: string;
      metadataHash: (string)[];
      status: number;
      staker: string;
      stake: BigNumber;
      epochNumber: BigNumber;
      resource: string;
      0: string;
      1: (string)[];
      2: number;
      3: string;
      4: BigNumber;
      5: BigNumber;
      6: string;
    }>;

    epochStart(epoch: number | string | BigNumber): Promise<BigNumber>;

    slateRequests(slateID: number | string | BigNumber): Promise<(BigNumber)[]>;

    didCommit(epochNumber: number | string | BigNumber, voter: string): Promise<boolean>;

    getCommitHash(epochNumber: number | string | BigNumber, voter: string): Promise<string>;

    getFirstChoiceVotes(
      epochNumber: number | string | BigNumber,
      resource: string,
      slateID: number | string | BigNumber
    ): Promise<BigNumber>;

    getSecondChoiceVotes(
      epochNumber: number | string | BigNumber,
      resource: string,
      slateID: number | string | BigNumber
    ): Promise<BigNumber>;

    didReveal(epochNumber: number | string | BigNumber, voter: string): Promise<boolean>;

    contestStatus(epochNumber: number | string | BigNumber, resource: string): Promise<number>;

    contestSlates(
      epochNumber: number | string | BigNumber,
      resource: string
    ): Promise<(BigNumber)[]>;

    contestDetails(
      epochNumber: number | string | BigNumber,
      resource: string
    ): Promise<{
      status: number;
      allSlates: (BigNumber)[];
      stakedSlates: (BigNumber)[];
      lastStaked: BigNumber;
      voteWinner: BigNumber;
      voteRunnerUp: BigNumber;
      winner: BigNumber;
      0: number;
      1: (BigNumber)[];
      2: (BigNumber)[];
      3: BigNumber;
      4: BigNumber;
      5: BigNumber;
      6: BigNumber;
    }>;

    getWinningSlate(epochNumber: number | string | BigNumber, resource: string): Promise<BigNumber>;

    hasPermission(requestID: number | string | BigNumber): Promise<boolean>;

    slateSubmissionDeadline(
      epochNumber: number | string | BigNumber,
      resource: string
    ): Promise<BigNumber>;

    slateSubmissionPeriodActive(resource: string): Promise<boolean>;

    recommendSlate(
      resource: string,
      requestIDs: (number | string | BigNumber)[],
      metadataHash: (string)[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    stakeTokens(
      slateID: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    withdrawStake(
      slateID: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    depositVoteTokens(
      numTokens: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    withdrawVoteTokens(
      numTokens: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    delegateVotingRights(
      _delegate: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    commitBallot(
      voter: string,
      commitHash: string,
      numTokens: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    revealBallot(
      epochNumber: number | string | BigNumber,
      voter: string,
      resources: (string)[],
      firstChoices: (number | string | BigNumber)[],
      secondChoices: (number | string | BigNumber)[],
      salt: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    revealManyBallots(
      epochNumber: number | string | BigNumber,
      _voters: (string)[],
      _ballots: ((string)[])[],
      _salts: (number | string | BigNumber)[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    finalizeContest(
      epochNumber: number | string | BigNumber,
      resource: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    donateChallengerStakes(
      epochNumber: number | string | BigNumber,
      resource: string,
      startIndex: number | string | BigNumber,
      count: number | string | BigNumber,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    requestPermission(
      metadataHash: (string)[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    startTime(): Promise<BigNumber>;
    COMMIT_PERIOD_START(): Promise<BigNumber>;
    parameters(): Promise<string>;
    REVEAL_PERIOD_START(): Promise<BigNumber>;
    EPOCH_LENGTH(): Promise<BigNumber>;
    SLATE_SUBMISSION_PERIOD_START(): Promise<BigNumber>;
    token(): Promise<string>;
    currentEpochNumber(): Promise<BigNumber>;
    slateCount(): Promise<BigNumber>;
    requestCount(): Promise<BigNumber>;
    isCurrentGatekeeper(): Promise<boolean>;
  };
  filters: {
    PermissionRequested(
      epochNumber: number | string | BigNumber | null,
      resource: string | null,
      requestID: null,
      metadataHash: null
    ): EventFilter;

    SlateCreated(
      slateID: null,
      recommender: string | null,
      requestIDs: null,
      metadataHash: null
    ): EventFilter;

    SlateStaked(slateID: null, staker: string | null, numTokens: null): EventFilter;

    VotingTokensDeposited(voter: string | null, numTokens: null): EventFilter;

    VotingTokensWithdrawn(voter: string | null, numTokens: null): EventFilter;

    VotingRightsDelegated(voter: string | null, delegate: null): EventFilter;

    BallotCommitted(
      epochNumber: number | string | BigNumber | null,
      committer: string | null,
      voter: string | null,
      numTokens: null,
      commitHash: null
    ): EventFilter;

    BallotRevealed(
      epochNumber: number | string | BigNumber | null,
      voter: string | null,
      numTokens: null
    ): EventFilter;

    ContestAutomaticallyFinalized(
      epochNumber: number | string | BigNumber | null,
      resource: string | null,
      winningSlate: null
    ): EventFilter;

    ContestFinalizedWithoutWinner(
      epochNumber: number | string | BigNumber | null,
      resource: string | null
    ): EventFilter;

    VoteFinalized(
      epochNumber: number | string | BigNumber | null,
      resource: string | null,
      winningSlate: null,
      winnerVotes: null,
      totalVotes: null
    ): EventFilter;

    VoteFailed(
      epochNumber: number | string | BigNumber | null,
      resource: string | null,
      leadingSlate: null,
      leaderVotes: null,
      runnerUpSlate: null,
      runnerUpVotes: null,
      totalVotes: null
    ): EventFilter;

    RunoffFinalized(
      epochNumber: number | string | BigNumber | null,
      resource: string | null,
      winningSlate: null,
      winnerVotes: null,
      losingSlate: null,
      loserVotes: null
    ): EventFilter;

    StakeWithdrawn(slateID: null, staker: string | null, numTokens: null): EventFilter;
  };
}
