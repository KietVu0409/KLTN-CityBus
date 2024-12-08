import { OutlinedInputProps, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import './index.scss';


const InputField = (props) => {
  const {
    defaultValue,
    control,
    name,
    className,
    error = false,
    helperText = undefined,
    label = undefined,
    disabled = false,
    placeholder = undefined,
    multiline = false,
    rows = undefined,
    minRows = undefined,
    maxRows = undefined,
    type = undefined,
    InputProps = undefined,
    ...inputProps
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          disabled={disabled}
          className={`${className} input-field font-size-1`}
          label={label}
          variant="outlined"
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          minRows={minRows}
          maxRows={maxRows}
          type={type}
          InputProps={InputProps}
          {...inputProps}
          {...field}
        />
      )}
    />
  );
};

export default InputField;
