import React, { Component } from 'react';
import { connect } from 'react-redux';
import s from './styles.css';

import notify from '../../../utils/notifications';

import { get } from '../../../utils/fetch';

import Spinner from '../../common/Spinner';

class Verification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: '',
      message: '',
      reference: '',
      signature: '',
      status_code: ''
    };
  }

  componentDidMount() {
    get('/kyc/init').then(({ message }) => {
      this.setState({ message });
    });
  }

  render() {
    const { kycStatus } = this.props;

    const renderPage = () => {
      switch (kycStatus) {
        case 'verified':
          return renderSuccess();
        case 'failed':
          return renderFailed();
        case 'pending':
          return renderPending();
        default:
          return renderPlugin();
      }
    };

    const renderFailed = () => (
      <div className={s.status}>
        <div className={s.title}>Verification failure.</div>
        <div className={s.text}>
          We were unable to match your account information automatically and uploaded documents.
          Please reload the page and try again or contact Starflow support.<br/><br/>
          <a href="mailto:support@starflow.com">support@starflow.com</a>
        </div>
      </div>
    );

    const renderSuccess = () => (
      <div className={s.status}>
        <div className={s.title}>Account verification complete</div>
        <div className={s.text}>
          Your personal data has been verified successfully,
          and now you have full access to Starflow crowdsale.
        </div>
      </div>
    );

    const renderPending = () => (
      <div className={s.status}>
        <div className={s.title}>Your account is being verified…</div>
        <div className={s.text}>
          Your documents are successfully uploaded and being processed now.
          This may take up to 15 minutes, please be patient and don’t try to
          relaunch the verification process.
        </div>
      </div>
    );

    const renderPlugin = () => (
      this.state.message
        ? <iframe style={{ width: '702px', height: '502px', border: 'none' }} src={this.state.message} id="api-frame" />
        : <div className={s.spinner}>
          <Spinner color="#f52c5a" />
        </div>
    );

    return (
      <div>
        {renderPage()}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    kycStatus: state.app.app.user.kycStatus
  }),
  {
    notify
  }
)(Verification);
