import React, { ReactNode } from 'react';
import Modal from 'react-modal';

import globalStyles from '../../App.module.sass';
import styles from './ModalComponent.module.sass';

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  content: ReactNode;
  customClassName: string;
  additionalButtonClassName?: string;
}

const ModalComponent: React.FC<ModalComponentProps & { additionalButtonClassName?: string }> = ({
  isOpen,
  onRequestClose,
  content,
  customClassName,
  additionalButtonClassName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={{
        base: `${styles.modalContent} ${customClassName !== '' ? customClassName : ''}`,
        afterOpen: '',
        beforeClose: styles.modalContentAfterClose,
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: '',
        beforeClose: styles.modalOverlayAfterClose,
      }}
      closeTimeoutMS={300}
      contentLabel="Example Modal"
    >
      <button
        className={`${globalStyles.btn_reset} ${styles.modalClose} ${additionalButtonClassName ? additionalButtonClassName : ''
          }`}
        onClick={onRequestClose}
      ></button>
      {content}
    </Modal>
  );
};


export default ModalComponent;
