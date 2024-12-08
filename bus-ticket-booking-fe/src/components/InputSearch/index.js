import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputAdornment, OutlinedInput, SxProps, Theme } from "@mui/material";
import "./index.scss";
const SearchInput = (props) => {
  const {
    placeholder,
    value,
    className,
    sx,
    // onChange = undefined,
    handleSearch,
    setSearchValue,
  } = props;
  return (
    <>
      <OutlinedInput
        sx={sx}
        type="text"
        className={`${className} search-input`}
        // variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(ev) => {
          setSearchValue(ev.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSearch();
            e.preventDefault();
          }
        }}
        color="primary"
        endAdornment={
          <InputAdornment
            sx={{
              cursor: "pointer",
            }}
            position="start"
            onClick={() => {
              if (handleSearch) {
                handleSearch();
              }
            }}
          >
            <SearchOutlinedIcon />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "Search",
        }}
        size="small"
      />
    </>
  );
};

export default SearchInput;
