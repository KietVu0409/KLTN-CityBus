import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import "./index.scss";

const SelectCustom = (props) => {
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
    optionLabelKey,
    freeSolo = false,
    style,
    renderOption,
    disabled = false,
    isAutoSelected = false,
    className = '',
  } = props;

  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onChangeDefault, value } }) => {
        return (
          <Autocomplete
            noOptionsText={'Không có dữ liệu'}
            options={options}
            autoSelect={isAutoSelected}
            value={value || ''}
            // inputValue={valueRender}
            limitTags={limitTags}
            multiple={multiple}
            disableCloseOnSelect={multiple}
            className={`${className} select-custom`}
            getOptionLabel={(option) => {
              return option[optionLabelKey || 'name'] || option;
            }}
            onChange={(event, newValue) => {
              if (onChange) {
                return onChange(event, newValue);
              }
              return onChangeDefault(newValue);
            }}
            // renderOption={(props: any, option: any) => renderOption(option)}
            defaultValue={defaultValue}
            freeSolo={freeSolo}
            style={style}
            disabled={disabled}
            renderInput={params => {
              if (params) {
                return (
                  <TextField
                    className={'font-size-1'}
                    placeholder={placeholder}
                    error={error}
                    helperText={helperText}
                    value={value}
                    {...params}
                  />
                );
              }
            }}
          />
        );
      }}
    />
  );
};

export default SelectCustom;
