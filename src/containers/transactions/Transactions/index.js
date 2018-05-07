import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import s from './styles.css';

import { fetchTransactions, stopTransactionsPolling, openDetailsPopup } from '../../../redux/modules/transactions/transactions';
import { openMakeDepositPopup } from '../../../redux/modules/app/makeDepositPopup';

import GatewayTransaction from '../../../components/transactions/GatewayTransaction';
import Transaction from '../../../components/transactions/Transaction';
import Button from '../../../components/common/Button';
import GatewayTransactionDetailsPopup from '../GatewayTransactionDetailsPopup';

class Transactions extends Component {
  componentWillMount() {
    this.props.fetchTransactions();
  }

  componentWillUnmount() {
    this.props.stopTransactionsPolling();
  }

  _getSortedTransactions() {
    const { transactions } = this.props;

    return []
      .concat(transactions)
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  render() {
    const {
      t,
      transactions,
      openMakeDepositPopup,
      openDetailsPopup
    } = this.props;

    const renderTransactions = () => (
      <div className={s.main}>
        <div className={s.title}>{t('latestTransactions')}</div>
        {this._getSortedTransactions().map((t) => (
          t.type === 'gateway_transaction'
            ? <GatewayTransaction key={t.id} paymentData={t} openDetailsPopup={openDetailsPopup} />
            : <Transaction key={`${t.id}${t.type}${t.from}${t.to}`} {...t} />
        ))}
      </div>
    );

    const renderMock = () => (
      <div className={s.main}>
        <div className={s.title}>{t('noTransactions')}</div>
        <div className={s.subtitle}>{t('needDeposit')}</div>
        <div className={s.button}>
          <Button size="small" onClick={() => openMakeDepositPopup()}>{t('makeDeposit')}</Button>
        </div>
      </div>
    );

    return (
      <div className={s.wrapper}>
        {transactions.length > 0 ? renderTransactions() : renderMock()}
        <GatewayTransactionDetailsPopup/>
      </div>
    );
  }
}

const TranslatedComponent = translate('transactions')(Transactions);

export default connect(
  (state) => ({
    transactions: state.transactions.transactions.transactions
  }),
  {
    fetchTransactions,
    stopTransactionsPolling,
    openMakeDepositPopup,
    openDetailsPopup
  }
)(TranslatedComponent);
