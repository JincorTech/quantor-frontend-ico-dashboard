import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const DateFormat = 'YYYY-MM-DD';

const RenderInput = (props) => {
  const { value, onChange } = props.input;

  const handleChange = (value) => {
    onChange(value.format(DateFormat));
  };

  return (
    <DatePicker
      selected={value ? moment(value, DateFormat) : null}
      dateFormat={DateFormat}
      onChange={handleChange}
      placeholderText="Choose your date of birth..."
      />
  );
};

export default RenderInput;
