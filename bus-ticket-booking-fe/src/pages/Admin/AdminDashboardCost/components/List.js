import { Button } from "@mui/material";

import moment from "moment";
import { useState } from "react";
import "../../../../assets/scss/default.scss";
import TableCustom from "../../../../components/TableCustom";
import { convertCurrency } from "../../../../data/curren";

const DashboardCostList = (props) => {
  const {
    data,
    handleGetData,
    selectionModel,
    handleSelectionModeChange,
    handleShowDetail,
    handleClick,
    onChangeRowsPerPage,
    handleChangePage,
    total,
    page,
    pageSize,
  } = props;

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "fullName",
      headerName: "Khách hàng",
      flex: 140,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 90,
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "customerGroupName",
      headerName: "Nhóm khách hàng",
      flex: 140,
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "numberOfOrders",
      headerName: "Số đơn đặt vé",
      flex: 120,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
    },

    {
      field: "total",
      headerName: "Doanh số trước CK",
      flex: 140,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return <div>{convertCurrency(params?.row.total)}</div>;
      },
    },
    {
      field: "promotion",
      headerName: "Chiết khấu",
      flex: 80,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            {convertCurrency(params?.row.total - params?.row.finalTotal)}
          </div>
        );
      },
    },
    {
      field: "finalTotal",
      headerName: "Doanh số sau CK",
      flex: 130,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            {convertCurrency(params?.row.finalTotal)}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <TableCustom
        rows={data}
        columns={columns}
        {...props}
        // checkboxSelection
        handleSelectAllClick={handleSelectionModeChange}
        handleClick={handleClick}
        selected={selectionModel}
        handleShowDetail={handleShowDetail}
        handleChangePage={handleChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  );
};

export default DashboardCostList;
