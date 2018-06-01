import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import BigNum from 'bignumber.js';
import { translate } from 'react-i18next';
import s from './styles.css';

import { ethInvest } from '../../../utils/validators';

import { openKycAlertPopup } from '../../../redux/modules/app/kycAlertPopup';
import { openTxFeeHelp } from '../../../redux/modules/dashboard/txFeeHelp';
import { selectCurrency, createTransaction } from '../../../redux/modules/dashboard/paymentGateway';

import RenderInput from '../../../components/forms/RenderInput';
import Button from '../../../components/common/Button';

import GatewayPaymentPopup from '../../../containers/dashboard/GatewayPaymentPopup';

class BuyTokensGatewayForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonText: '',
      totalAmount: '',
      purchaseIsValid: false
    };

    this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
  }

  getCurrencyRateFromProps(props) {
    return props.currencies[props.selectedCurrency].rate_btc;
  }

  getCurrencyRate() {
    return this.getCurrencyRateFromProps(this.props);
  }

  getEthRateFromProps(props) {
    return props.currencies.ETH.rate_btc;
  }

  getEthRate() {
    return this.getEthRateFromProps(this.props);
  }

  handleChangeCurrency(event) {
    this.props.selectCurrency(event.target.value);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currencyValue || !nextProps.currencies) {
      return;
    }

    if (Number.isNaN(Number.parseFloat(nextProps.currencyValue))) {
      return;
    }

    const currencyValue = new BigNum(Number.parseFloat(nextProps.currencyValue));
    const currencyRate = new BigNum(this.getCurrencyRateFromProps(nextProps));
    const ethTxFee = new BigNum(nextProps.ethTxFee);
    const ethRate = new BigNum(this.getEthRateFromProps(nextProps));
    const minInvest = new BigNum(0.00001);

    if (currencyValue.toNumber() && currencyValue.isGreaterThanOrEqualTo(minInvest)) {
      const eth = currencyValue.multipliedBy(currencyRate).dividedBy(ethRate);
      const tokens = eth.dividedBy(nextProps.ethTokenPrice);
      const expectedFee = nextProps.selectedCurrency === 'ETH'
        ? ethTxFee
        : ethTxFee.multipliedBy(ethRate).dividedBy(currencyRate);
      const currencyAmount = currencyValue.plus(expectedFee);
      this.props.change('tokens', tokens.toFixed(3));
      this.setState({
        buttonText: ` for ${currencyAmount.toString()} ${nextProps.selectedCurrency}`,
        totalAmount: `${currencyAmount}`,
        purchaseIsValid: tokens.isGreaterThanOrEqualTo(77500)
      });
    } else {
      this.props.change('tokens', '');
      this.setState({ buttonText: '' });
    }
  }

  render() {
    const {
      spinner,
      invalid,
      kycStatus,
      openKycAlertPopup,
      ethTxFee,
      minInvest,
      openTxFeeHelp,
      selectedCurrency,
      currencies,
      createTransaction,
      t
    } = this.props;

    const renderButton = () => {
      if (kycStatus === 'verified') {
        return (
          <Button
            onClick={() => createTransaction({
              amount: this.state.totalAmount,
              currency: selectedCurrency
            })}
            disabled={invalid || !this.state.purchaseIsValid}
            spinner={spinner}>Purchase tokens{this.state.buttonText}</Button>
        );
      }

      return (
        <Button
          disabled={invalid || !this.state.purchaseIsValid}
          onClick={() => openKycAlertPopup()}>Purchase tokens{this.state.buttonText}</Button>
      );
    };

    const renderIfAvailable = (num) => {
      if (num) return Number(num).toFixed(5);

      return 0;
    };

    return (
      <div className={s.form}>
        <form>
          <select className={s.select}
                  value={selectedCurrency}
                  onChange={this.handleChangeCurrency}>
            {Object.keys(currencies).map((currency) =>
              <option key={currency} value={currency}>{currency}</option>)}
          </select>
          <div className={s.field}>
            <Field
              component={RenderInput}
              tip={selectedCurrency}
              size="large"
              name="currencyValue"
              placeholder={`0 ${selectedCurrency}`}
              validate={ethInvest}/>
          </div>

          <div className={s.field}>
            <Field
              component={RenderInput}
              tip={t('tokenName')}
              size="large"
              name="tokens"
              placeholder={`0 ${t('tokenName')}`}
              disabled/>
          </div>

          <div className={s.gas}>
            <span title={ethTxFee}>
              Purchising Tx fee: {renderIfAvailable(ethTxFee)} ETH
            </span>
            <span title={minInvest}>
              Min. contribution: 77 500 QNT
            </span>
          </div>

          <div className={s.button}>
            {renderButton()}
          </div>

          <div className={s.terms}>
            By purchasing the tokens you agree with <a target="_blank" href="http://qntr.co/tsa">Token Sale Agreement</a>
          </div>
        </form>

        <div className={s.tip}>
          <p>
            Now you can purchase QNT tokens with {selectedCurrency}.<br/>
            Use this calculator to evaluate the transaction rates.
          </p>
          <p>
            Enter the amount of {selectedCurrency} you want to contribute and find out the
            amount of QNT tokens you will get.
            Please note that a little bit {selectedCurrency} adding on top to cover the tx fee.<br/>
            <a onClick={() => openTxFeeHelp()}>What is the tx fee?</a>
          </p>
        </div>

        <GatewayPaymentPopup/>
      </div>
    );
  }
}

const FormComponent = reduxForm({
  form: 'buyTokensGateway',
  initialValues: {
    currencyValue: ''
  }
})(BuyTokensGatewayForm);

const formSelector = formValueSelector('buyTokensGateway');

const TranslatedComponent = translate('dashboard')(FormComponent);

export default connect(
  (state) => ({
    spinner: state.dashboard.buyTokens.spinner,
    kycStatus: state.app.app.user.kycStatus,
    ethTokenPrice: state.dashboard.dashboard.tokenPrice.ETH,
    ethTxFee: state.dashboard.txFee.expectedTxFee,
    minInvest: state.dashboard.txFee.minInvest,
    currencyValue: formSelector(state, 'currencyValue'),
    ...state.dashboard.paymentGateway
  }),
  {
    openKycAlertPopup,
    openTxFeeHelp,
    selectCurrency,
    createTransaction
  }
)(TranslatedComponent);
