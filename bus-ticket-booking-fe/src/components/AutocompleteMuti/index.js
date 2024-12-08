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

const AutocompleteMulti = (props) => {
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
  const newListOption = [
    {id:'all', name: "Tất cả các chuyến", code: "ALL_TRIP" },
    ...listOption,
  ];
  const [selectAll, setSelectAll] = useState(false);

  const filterData = (data, valueFilter) => {
    return data?.filter(
      (item) =>
        !valueFilter
          ?.map((el) => el?.id || el?.code)
          .includes(item?.id || item?.code)
    );
  };

  const filterOptions = createFilterOptions({
    ignoreAccents: false,
    ignoreCase: true,
    matchFrom: "any",
    stringify: (options) => `${options.code} ${options.name}`,
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, name } }) => {
        return (
          <Autocomplete
            name={name}
            value={selectAll ? [{ name: "Tất cả các chuyến", code: "ALL_TRIP" }] : value}
            multiple={multiple}
            options={
              selectAll
                ? [{ name: "Tất cả các chuyến", code: "ALL_TRIP" }]
                : multiple
                ? filterData(newListOption, value)
                : newListOption
            }
            limitTags={limitTags}
            filterOptions={filterOptions}
            disableCloseOnSelect={multiple}
            filterSelectedOptions={multiple}
            noOptionsText={"Không có dữ liệu"}
            isOptionEqualToValue={isOptionEqualToValue}
            className={`autocomplete ${
              multiple && value?.length ? "multiple" : ""
            }`}
            getOptionLabel={(option) => {
              if (isStaff) {
                return `${option.fullName} - ${option.code}`;
              }
              return option?.name || option?.fullName || "";
            }}
            onChange={(event, newValue) => {
              if (newValue.some((option) => option.code === "ALL_TRIP")) {
                onChange(newValue);
                setSelectAll(true);
              } else {
                onChange(newValue);
                setSelectAll(false);
              }
            }}
            {...rest}
            renderTags={(value, getTagProps) => {
              return value.map((option, index) => (
                <Tooltip title={option?.name} arrow placement="bottom">
                  <Chip
                    variant="outlined"
                    label={`${option?.name}`}
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

export default AutocompleteMulti;
