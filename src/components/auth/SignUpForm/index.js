import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import iso3311a2 from 'iso-3166-1-alpha-2';
import s from './styles.css';

import { namedRoutes } from '../../../routes';
import {
  emailValidate,
  passwordValidate,
  fullNameValidate,
  required,
  // phone,
  date
} from '../../../utils/validators';

import RenderInput from '../../forms/RenderInput';
import RenderDatePicker from '../../forms/RenderDatePicker';
import RenderPassword from '../../forms/RenderPassword';
import RenderCheckbox from '../../forms/RenderCheckbox';
import Button from '../../common/Button';
import Globals from '../../../locales/globals';

const RestrictedCountriesCodes = [
  'US', 'UM', 'VI', 'CN', 'SG', 'CA', 'KR', 'EC', 'GT', 'VN', 'BD'
];

const Step = Object.freeze({
  Step1: 0,
  Step2: 1
});

class SignUpForm extends Component {
  constructor() {
    super();
    this.state = {
      step: Step.Step1
    };
  }

  componentDidMount() {
    const { change } = this.props;

    const utmSource = window.localStorage.getItem('utm_source');
    const utmMedium = window.localStorage.getItem('utm_medium');
    const utmCampaign = window.localStorage.getItem('utm_campaign');
    const gtm = window.localStorage.getItem('gtm');

    change('source.utm_source', utmSource);
    change('source.utm_medium', utmMedium);
    change('source.utm_campaign', utmCampaign);
    change('source.gtm', gtm);
  }

  renderStep1 = () => {
    const { t, spinner, invalid } = this.props;

    return (
      <React.Fragment>
        <div className={s.field}>
          <Field
            component={RenderInput}
            name="email"
            type="text"
            placeholder={t('email')}
            validate={emailValidate}
            isBright />
        </div>

        <div className={s.field}>
          <Field
            component={RenderPassword}
            name="password"
            type="password"
            placeholder={t('password')}
            validate={passwordValidate} />
        </div>

        <Button onClick={() => {
          this.setState({ step: Step.Step2 });
        }} spinner={spinner} disabled={invalid} isBright>Next step</Button>
      </React.Fragment>
    );
  }

  renderStep2 = () => {
    const {
      t, referralCode, spinner, invalid
    } = this.props;

    return (
      <React.Fragment>
        <div className={s.field}>
          <Field
            component={RenderInput}
            name="firstName"
            type="text"
            placeholder={'First Name'}
            validate={fullNameValidate}
            isBright />
        </div>

        <div className={s.field}>
          <Field
            component={RenderInput}
            name="lastName"
            type="text"
            placeholder={'Last Name'}
            validate={fullNameValidate}
            isBright />
        </div>

        {/* <div className={s.field}>
            <Field
              component={RenderInput}
              name="phone"
              type="text"
              placeholder={'Phone Number'}
              validate={phone}
              isBright/>
          </div> */}

        {/* <div className={s.phoneHint}>
            For example +79083971234
          </div> */}

        <Field
          className={s.select}
          name="country"
          component="select"
          validate={required}>
          <option value=''>&nbsp;&nbsp;Choose your country...</option>
          {iso3311a2.getCodes()
            .filter((code) => !RestrictedCountriesCodes.includes(code))
            .map((code) =>
              <option key={code} value={code}>&nbsp;&nbsp;{iso3311a2.getCountry(code)}</option>)}
        </Field>

        <Field
          className={s.dob}
          name="dob"
          component={RenderDatePicker}
          validate={date} />

        {this.renderReferralField(referralCode)}

        <div className={s.description}>
          {t('passwordLengthDescription')}
        </div>

        <div className={s.checkbox}>
          <Field
            component={RenderCheckbox}
            label={<span>
              {t('iAgreeWith')} <a href={Globals.agreementLink} target="_blank"><span className={s.terms}>{t('termsOfServices')}</span></a>
            </span>}
            name="agreeTos"
            validate={required} />
        </div>

        <div className={s.checkbox}>
          <Field
            component={RenderCheckbox}
            label={<span className={s.agreeCountries}>
              I'm not a citizen or resident of the USA, including District of Columbia,
              United States Virgins Islands, China, Singapore, Canada,
              South Korea, Ecuador, Guatemala, Vietnam, Bangladesh.
              </span>}
            name="agreeCountries"
            validate={required} />
        </div>

        <div className={s.agreeCountriesHint}>
          *Both citizens and residents of these countries
          are restricted to participate in token-sale
          </div>

        <div className={s.button}>
          <Button type="submit" spinner={spinner} disabled={invalid} isBright>{t('submit')}</Button>
        </div>
      </React.Fragment>
    );
  }

  renderReferralField = (code) => {
    const { t } = this.props;

    if (code) {
      this.props.change('referral', code);
      return (
        <Field
          component={RenderInput}
          name="referral"
          type="hidden"
          disabled />
      );
    }

    return (
      <div className={s.field}>
        <Field
          component={RenderInput}
          name="referral"
          type="text"
          placeholder={t('referralCode')}
          isBright />
      </div>
    );
  };

  render() {
    const {
      t,
      handleSubmit,
      error
    } = this.props;

    return (
      <div>
        <div className={s.title}>{t('signUp')}</div>

        {error && <div className={s.error}>{error}</div>}

        <form id="mk_lk_signup" onSubmit={handleSubmit}>
        {
          this.state.step === Step.Step1 ? this.renderStep1() : this.renderStep2()
        }
        </form>

        <div className={s.footer}>
          <Link to={namedRoutes.signIn}>{t('signIn')}</Link> {t('ifYouHaveAccount')}
        </div>
      </div>
    );
  }
}

const FormComponent = reduxForm({
  form: 'signUp',
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    // phone: '',
    country: '',
    dob: '',
    password: '',
    referral: '',
    agreeTos: false,
    agreeCountries: false,
    source: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      gtm: ''
    }
  }
})(SignUpForm);

const TranslatedComponent = translate('auth')(FormComponent);

export default TranslatedComponent;
