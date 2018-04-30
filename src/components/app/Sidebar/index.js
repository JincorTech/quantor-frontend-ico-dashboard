import React from 'react';
import { Link, IndexLink } from 'react-router';
import { translate } from 'react-i18next';
import s from './styles.css';
import { namedRoutes } from '../../../routes';
import Globals from '../../../locales/globals';
import Button from '../../common/Button';

const Sidebar = (props) => {
  const {
    t,
    closeSidebar,
    kyc,
    location,
    logout
  } = props;

  const { pathname } = location;

  return (
    <div className={s.sidebar}>
      <div className={s.close}>
        <button onClick={() => closeSidebar()}>
          <img src={require('../../../assets/images/icons/close.svg')} />
        </button>
      </div>

      <div className={s.navigation}>
        <IndexLink
          onClick={() => closeSidebar()}
          className={s.link}
          activeClassName={s.active}
          to={namedRoutes.dashboard}>{t('dashboard')}</IndexLink>

        <Link
          onClick={() => closeSidebar()}
          className={s.link}
          activeClassName={s.active}
          to={namedRoutes.transactions}>{t('transactions')}</Link>

        <Link
          onClick={() => closeSidebar()}
          className={s.link}
          activeClassName={s.active}
          to={namedRoutes.referrals}>{t('partnerProgram')}</Link>

        {/* <Link
          onClick={() => closeSidebar()}
          className={s.disabled}
          activeClassName={s.active}
          to={namedRoutes.sendTokens}>{t('sendTokens')}</Link> */}

        <Link
          onClick={() => closeSidebar()}
          className={s.link}
          activeClassName={s.active}
          to={namedRoutes.account}>{t('account')}</Link>

        {!kyc
          ? <a
            className={pathname === namedRoutes.verification ? s.activeLink : s.link}
            href={namedRoutes.verification}>{t('verification')}</a>
          : null}
      </div>

      <div className={s.signOut}>
        <Button
          type="button"
          size="small"
          styl="secondary"
          onClick={() => logout()}>
          {t('signOut')}
        </Button>
      </div>

      <div className={s.socials}>
        <a href={Globals.facebookLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/facebook.svg')} />
        </a>
        <a href={Globals.twitterLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/twitter.svg')} />
        </a>
        <a href={Globals.googlePlusLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/googleplus.svg')} />
        </a>
        <a href={Globals.redditLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/reddit.svg')} />
        </a>
        <a href={Globals.mediumLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/medium.svg')} />
        </a>
        <a href={Globals.youtubeLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/youtube.svg')} />
        </a>
        <a href={Globals.telegramLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/telegram.svg')} />
        </a>
        <a href={Globals.linkedInLink} target="_blank">
          <img src={require('../../../assets/images/social-icons/linkedin.svg')} />
        </a>
      </div>
    </div>
  );
};

const TranslatedComponent = translate('app')(Sidebar);

export default TranslatedComponent;
