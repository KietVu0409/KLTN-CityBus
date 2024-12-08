import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import './index.scss';

const AutocompleteCustom = (props) => {
  const {
    name,
    options = [],
    limitTags = 1,
    error = false,
    helperText = '',
    defaultValue = undefined,
    placeholder = '',
    multiple = false,
    onChange,
    optionLabelKey = '',
    freeSolo = false,
    style,
    renderOption,
    onChangeValue,
    isFilterOption = false,
    isAutoSelected = false,
  } = props;

  const { control } = useFormContext();
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.code + option.name + option.phone + option.fullName,
  });
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onChangeDefault, value } }) => (
        <Autocomplete
          noOptionsText={'Không có dữ liệu'}
          options={options}
          value={value || ''}
          autoSelect={isAutoSelected}
          limitTags={limitTags}
          multiple={multiple}
          // disableCloseOnSelect={multiple}
          className={'select-custom '}
          getOptionLabel={(option) => {
            return option[optionLabelKey || 'name'] || option;
          }}
          filterOptions={(options, state) => {
            return filterOptions(options, state);
          }}
          onChange={(event, newValue) => {
            if (onChange) {
              return onChange(event, newValue);
            }
            return onChangeDefault(newValue);
          }}
          renderOption={(props, option, state) => renderOption(option, props, state)}
          defaultValue={defaultValue}
          freeSolo={freeSolo}
          style={style}
          renderInput={params => (
            <TextField
              onChange={(e) => {
                if (onChangeValue) {
                  return onChangeValue(e.target.value);
                }
              }}
              className={'font-size-1'}
              placeholder={placeholder}
              error={error}
              helperText={helperText}
              value={value}
              {...params}
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteCustom;
