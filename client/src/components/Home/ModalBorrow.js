import React from 'react';
import 'react-pure-modal/dist/react-pure-modal.min.css';
import PureModal from 'react-pure-modal';
import './ModalBorrow.css';

function ModalBorrow(props) {
  return (
    <>
      <PureModal
        className="modalAddToCart"
        shouldCloseOnEsc={true}
        isOpen={props.open}
        header={props.feedback ? 'Registration completed' : 'Good choice!'}
        onClose={props.close}
        footer="Thank you!"
      >
        {props.feedback ? (
          <p style={{ wordBreak: 'normal' }}>{props.feedback}</p>
        ) : (
          <>
            <div className="contact-label" id="contact-send">
              <p style={{ wordBreak: 'normal' }}>
                This book is already reserved and waiting for you in our branch!
              </p>
            </div>
            <div>
            </div>
          </>
        )}
      </PureModal>
    </>
  );
}

export default ModalBorrow;
