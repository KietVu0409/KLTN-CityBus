import {
  Autocomplete,
  Chip,
  createFilterOptions,
  TextField,
  Tooltip,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import "./index.scss";
import { useState } from "react";

const AutocompletePromotion = (props) => {
  const {
    name,
    listOption = [],
    limitTags = 1,
    error,
    showLabel,
    helperText,
    label,
    children,
    defaultValue,
    placeholder,
    multiple = false,
    isStaff = false,
    handleChange,
    valueTable,
    handleSelectTaskCategory,
    isOptionEqualToValue,
    formatItem,
    ...rest
  } = props;
  const { control } = useFormContext();
 
console.log(listOption);
  const filterData = (data, valueFilter) => {
    return data?.filter(
      (item) =>
        !valueFilter
          ?.map((el) => el?.title || el?.code)
          .includes(item?.title || item?.code)
    );
  };

  const filterOptions = createFilterOptions({
    ignoreAccents: false,
    ignoreCase: true,
    matchFrom: "any",
    stringify: (options) => `${options.title} ${options.code}`,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, name } }) => {
        return (
          <Autocomplete
            name={name}
            value={value}
            multiple={multiple}
            options={multiple ? filterData(listOption, value) : listOption}
            limitTags={limitTags}
            filterOptions={filterOptions}
            disableCloseOnSelect={multiple}
            filterSelectedOptions={multiple}
            noOptionsText={"Không có dữ liệu"}
            isOptionEqualToValue={isOptionEqualToValue}
            className={`autocompletePromotion ${
              multiple && value?.length ? "multiple" : ""
            }`}
            getOptionLabel={(option) => {
              if (isStaff) {
                return `${option.fullName} - ${option.code}`;
              }
              return option?.name || option?.fullName || option?.title || "";
            }}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
            {...rest}
            renderTags={(value, getTagProps) => {
              return value.map((option, index) => (
                <Tooltip title={option?.title} arrow placement="bottom">
                  <Chip
                    variant="outlined"
                    label={`${option?.title}`}
                    {...getTagProps({ index })}
                  />
                </Tooltip>
              ));
            }}
            renderInput={(params) => (
              <TextField
                placeholder={multiple && value?.length ? "" : placeholder}
                {...params}
                error={error}
                helperText={helperText}
              />
            )}
          />
        );
      }}
    />
  );
};

export default AutocompletePromotion;
