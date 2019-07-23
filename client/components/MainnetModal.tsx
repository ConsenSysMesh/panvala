import Modal, { ModalTitle, ModalDescription } from './Modal';

import React from 'react';
import Button from './Button';

const MainnetModal = () => {
  const [modalIsOpen, setOpenModal] = React.useState(true);
  return (
    <Modal handleClick={() => setOpenModal(false)} isOpen={modalIsOpen}>
      <>
        <ModalTitle>{'Hello'}</ModalTitle>
        <ModalDescription className="flex flex-wrap">
          Panvala is in Beta and on the Ethereum Mainnet. Use it wisely. Don't store more crypto
          than you need and only share data with people you trust. By using the app you assume full
          responsibility for all risks concerning your data and funds.
        </ModalDescription>
        <Button type="default" onClick={() => setOpenModal(false)} large>
          {'Confirm and Continue'}
        </Button>
      </>
    </Modal>
  );
};

export default MainnetModal;