import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Checkbox, Stack, TableFooter, TablePagination } from "@mui/material";
import "./index.scss";
import { GridOverlay } from "@mui/x-data-grid";
import noData from "../../assets/no-data.png";
import { isEmpty } from "lodash";

const TableCustom = (props) => {
  const {
    rows,
    columns,
    onSelectAllClick,
    onRowClick,
    onChangeRowsPerPage,
    checkboxSelection = false,
    checkBoxAlignment = "center",
    headerCheckBoxAlignment = "center",
    loadOnServerSide = false,
    selected = [],
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    pagination = true,
    page,
    pageSize,
    total,
  } = props;

  const renderRow = (row, column, rowsIndex) => {
    let params = {
      id: row?.id,
      row,
      column,
      rowsIndex,
    };
    let res = row?.[column.field];
    if (column.renderCell) {
      res = column.renderCell(params);
    }
    if (column.field === "stt") {
      res = rowsIndex + 1;
    }
    return res;
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * pageSize - rows.length) : 0;

  const renderNoRowsOverlay = () => {
    return (
      <GridOverlay className="gird-overlay">
        <Stack alignItems="center" justifyContent="center" spacing={2}>
          <p>Không có dữ liệu</p>
        </Stack>
      </GridOverlay>
    );
  };

  return (
    <TableContainer
      className="table-custom"
      component={Paper}
      // sx={{ maxHeight: 400, maxWidth: 1100 }}
    >
      <Table
        stickyHeader
        size="small"
        aria-label="a dense table"
        padding="none"

      >
        <TableHead>
          <TableRow>
            {checkboxSelection && (
              <TableCell align={headerCheckBoxAlignment} padding="checkbox" style={{backgroundColor: "#f5f5f5"}}>
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected &&
                    selected?.length > 0 &&
                    selected.length < rows.length
                  }
                  checked={
                    selected &&
                    rows?.length > 0 &&
                    selected?.length === rows?.length
                  }
                  onChange={
                    loadOnServerSide ? onSelectAllClick : handleSelectAllClick
                  }
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
            )}
            {columns?.map((header) => (
              <TableCell
                key={header.field}
                width={header.flex}
                align={header.headerAlign}
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  height: "70px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {header.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row, index) => {
            const isItemSelected = isSelected(row.id);
            return (
              <TableRow
                key={row.id}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={checkboxSelection && isItemSelected}
              >
                {checkboxSelection && (
                  <TableCell
                    align={checkBoxAlignment}
                    padding="checkbox"
                    onClick={(event) => {
                      loadOnServerSide
                        ? onRowClick(event, row.id)
                        : handleClick(event, row.id);
                    }}
                  >
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": "check-box-" + index,
                      }}
                    />
                  </TableCell>
                )}
                {columns?.map((column) => (
                  <TableCell
                    width={column.flex}
                    align={column.contentAlign}
                    padding='normal'
                    style={{height: "10px", fontSize: "13px", color:'black' }}
                  >
                    {renderRow(row, column, index)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
          {/* {emptyRows > 0 && (
            <TableRow
              style={{
                height: 33 * emptyRows,
              }}
            >
              <TableCell colSpan={rows.length} />
            </TableRow>
          )} */}
        </TableBody>
      </Table>
      {isEmpty(rows) && (
        <div className={"btn-add-product"} style={{ display: "block" }}>
          <div className={"view-btn-add"}>
            <img src={noData} className="empty-data" />
            <span>Không có dữ liệu</span>
          </div>
        </div>
      )}
      {pagination &&(<TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={total || 0}
        rowsPerPage={pageSize || 0}
        page={page || 0}
        onPageChange={handleChangePage}
        labelRowsPerPage={"Số hàng hiển thị"}
        onRowsPerPageChange={onChangeRowsPerPage}
      />) }
    </TableContainer>
  );
};
export default TableCustom;
