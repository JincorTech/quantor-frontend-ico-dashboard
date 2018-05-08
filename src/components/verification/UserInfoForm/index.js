import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import s from './styles.css';

import {
  emailValidate,
  fullNameValidate,
  numberValidator,
  required
} from '../../../utils/validators';

import RenderInput from '../../forms/RenderInput';
import Button from '../../common/Button';

class UserInfoForm extends Component {
  render() {
    const {
      spinner,
      handleSubmit,
      invalid,
      error
    } = this.props;

    return (
      <div>
        <div className={s.title}>{'Fill the fields to continue verification process'}</div>

        {error && <div className={s.error}>{error}</div>}

        <form id="verification_info_form" onSubmit={handleSubmit}>
          <div className={s.field}>
            <Field
              component={RenderInput}
              name="name"
              type="text"
              placeholder={'Full Name'}
              validate={[fullNameValidate, required]}
              isBright />
          </div>
          <div className={s.field}>
            <Field
              component={RenderInput}
              name="email"
              type="text"
              placeholder={'Email'}
              validate={[emailValidate, required]}
              isBright/>
          </div>
          <div className={s.field}>
            <Field
              component={RenderInput}
              name="phone"
              type="text"
              placeholder={'Phone Number'}
              validate={[numberValidator, required]}
              isBright />
          </div>
          <div className={s.field}>
            <Field
              component={RenderInput}
              name="country"
              type="text"
              placeholder={'Country'}
              validate={required}
              isBright />
          </div>
          <div className={s.button}>
            <Button type="submit" spinner={spinner} disabled={invalid} isBright>{'Submit'}</Button>
          </div>
        </form>
      </div>
    );
  }
}

const FormComponent = reduxForm({
  form: 'verificationInfoForm',
  initialValues: {
    name: '',
    email: '',
    phone: '',
    country: ''
  }
})(UserInfoForm);

export default FormComponent;