import * as React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import { AxiosResponse } from 'axios';

import Header from './Header';
import { IProposal, ISlate, IAppContext } from '../interfaces';
import { getAllProposals, getAllSlates } from '../utils/api';
import { convertEVMSlateStatus } from '../utils/status';

export const AppContext: any = React.createContext({});

const LayoutWrapper = styled.div`
  font-family: 'Roboto';
  min-height: 100vh;
`;
const ContentWrapper = styled.div`
  margin: 2em 12em;
`;

type Props = {
  title: string;
};

export default class Layout extends React.Component<Props> {
  state: IAppContext = {
    slates: [],
    proposals: [],
    selectedSlate: '',
    slateStakingDeadline: '',
    proposalDeadline: '',
  };

  // runs once, onload
  async componentDidMount() {
    // const slatesFromIpfs: any[] = await Promise.all(slateMultihashes.map(mh => ipfsGetData(mh)));
    // const slatesWithMHs = slates.map((s, i) => ({ ...s, hash: slateMultihashes[i] }));
    const slates: ISlate[] | AxiosResponse = await getAllSlates();
    const proposals: IProposal[] | AxiosResponse = await getAllProposals();

    let proposalData;
    if (Array.isArray(proposals)) {
      // sort by createdAt
      const sortedProposals = proposals.sort((a: IProposal, b: IProposal) => {
        const timestampA = format(a.createdAt, 'x');
        const timestampB = format(b.createdAt, 'x');
        return parseInt(timestampA) - parseInt(timestampB);
      });
      proposalData = sortedProposals;
    }

    let slateData;
    if (Array.isArray(slates)) {
      slateData = slates.map((s: any) => {
        // convert from number to string
        s.status = convertEVMSlateStatus(s.status);
        return s;
      });
    }

    this.setState({
      slates: slateData,
      proposals: proposalData,
      slateStakingDeadline: 1539044131,
      proposalDeadline: 1539044131,
    });
  }

  handleNotify = (note: string, custom: string) => {
    if (custom) {
      (toast as any)[custom](note);
    } else {
      toast(note);
    }
  };

  handleSelectSlate = async (slateId: string) => {
    const selectedSlate: ISlate | undefined = this.state.slates.find(
      slate => slate.title === slateId
    );
    console.log('this.state:', this.state);
    return this.setState({ selectedSlate });
  };

  handleGetAllProposals = async () => {
    const proposals = await getAllProposals();
    return this.setState({ proposals });
  };

  render() {
    const { children, title } = this.props;
    const { slates, proposals, selectedSlate, slateStakingDeadline, proposalDeadline } = this.state;

    return (
      <LayoutWrapper>
        <Head>
          <title>{title}</title>
        </Head>

        <ContentWrapper>
          <Header />

          <AppContext.Provider
            value={{
              onHandleSelectSlate: this.handleSelectSlate,
              onNotify: this.handleNotify,
              onGetAllProposals: this.handleGetAllProposals,
              slates,
              proposals,
              selectedSlate,
              slateStakingDeadline,
              proposalDeadline,
            }}
          >
            {children}
          </AppContext.Provider>
        </ContentWrapper>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          draggable={false}
          closeOnClick
          pauseOnHover
        />
      </LayoutWrapper>
    );
  }
}
