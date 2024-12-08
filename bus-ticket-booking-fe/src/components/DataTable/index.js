import { Stack, SxProps, Theme } from '@mui/material';
import {
  DataGrid,
  GridCallbackDetails,
  GridColumns,
  GridEventListener,
  GridInputSelectionModel,
  GridOverlay,
  GridRowParams,
  GridSelectionModel,
} from '@mui/x-data-grid';

// import noDataTable from "../../assets/icons/noDataTable.svg";
import './index.scss';



const DataTable = (props) => {
  const {
    rows,
    columns,
    page,
    pageSize,
    rowsPerPageOptions = [0, 5, 10],
    checkboxSelection,
    rowCount,
    pagination,
    loading,
    sxCustom,
    hideFooterPagination,
    disableSelectionOnClick,
    selectionModel,
    onPageChange = undefined,
    onPageSizeChange = undefined,
    onSelectRow = undefined,
    getDetailPanelContent = undefined,
    onRowDoubleClick = undefined,
  } = props;

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
    <>
      <DataGrid
        sx={{
          ...sxCustom,
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#76B8CD1A',
          },
          '&. MuiDataGrid-menuIcon': {
            display: 'none!important',
            pointerEvents: 'none!important',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            minHeight: '20em!important',
          },
        }}
        className="h-[100%!important] data-table"
        rows={rows}
        columns={columns}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        rowsPerPageOptions={rowsPerPageOptions}
        autoHeight={true}
        disableSelectionOnClick={disableSelectionOnClick}
        pagination={pagination}
        rowCount={rowCount}
        loading={loading}
        checkboxSelection={checkboxSelection}
        hideFooterSelectedRowCount={true}
        onSelectionModelChange={onSelectRow}
        getDetailPanelContent={getDetailPanelContent}
        hideFooterPagination={hideFooterPagination}
        components={{
          NoRowsOverlay: () => renderNoRowsOverlay(),
          NoResultsOverlay: () => renderNoRowsOverlay(),
        }}
        selectionModel={selectionModel}
        onRowDoubleClick={onRowDoubleClick}
        componentsProps={{
          pagination: {
            labelRowsPerPage: 'Số hàng hiển thị: ',
          },
        }}
      />
    </>
  );
};

export default DataTable;
