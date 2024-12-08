import { Button } from "@mui/material";

import moment from "moment";
import { useState } from "react";
import "../../../../assets/scss/default.scss";
import TableCustom from "../../../../components/TableCustom";
import Badge from "../../../../components/Badge";
import { convertCurrency } from "../../../../data/curren";

const DashboardTicketList = (props) => {
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
      field: "code",
      headerName: "Mã tuyến",
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Tên tuyến",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "fromStation",
      headerName: "Nơi đi",
      flex: 130,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div style={{ padding: "5px" }}>
            <span
              style={{
                fontSize: "0.8rem",
              }}
            >
              {params?.row?.fromStation?.name}({params?.row?.fromStation?.code})
            </span>
          </div>
        );
      },
    },
    {
      field: "toStation",
      headerName: "Nơi đến",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div style={{ padding: "5px" }}>
            <span
              style={{
                fontSize: "0.8rem",
              }}
            >
              {params?.row?.toStation?.name}({params?.row?.toStation?.code})
            </span>
          </div>
        );
      },
    },

    {
      field: "totalTickets",
      headerName: "Số vé đặt",
      flex: 80,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "total",
      headerName: "Doanh số trước CK",
      flex: 140,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return <div>{convertCurrency(params?.row.totalRevenue)}</div>;
      },
    },
    {
      field: "promotion",
      headerName: "Chiết khấu",
      flex: 80,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return <div>{convertCurrency(params?.row.totalDiscount)}</div>;
      },
    },
    {
      field: "finalTotal",
      headerName: "Doanh số sau CK",
      flex: 130,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return <div>{convertCurrency(params?.row.finalTotalRevenue)}</div>;
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

export default DashboardTicketList;
