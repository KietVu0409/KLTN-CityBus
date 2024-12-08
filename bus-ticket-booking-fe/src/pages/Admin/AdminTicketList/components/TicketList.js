import { Button } from "@mui/material";

import moment from "moment";
import { useState } from "react";
import "../../../../assets/scss/default.scss";
import TableCustom from "../../../../components/TableCustom";
import { convertCurrency } from "../../../../data/curren";

const TicketList = (props) => {
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
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 100,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <span>{moment(params.row.createdAt)?.format("DD/MM/YYYY")}</span>
        );
      },
    },
    {
      field: "code",
      headerName: "Mã HD",
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => handleShowDetail(params.id)}
            style={{ backgroundColor: "transparent" }}
            disabled={false}
            color="primary"
            size="small"
          >
            <span
              style={{
                textDecorationLine: "underline",
                color: "#1A89AC",
                fontSize: "0.75rem",
                display: "inline-block",
                textTransform: "none",
              }}
            >
              {params?.row?.code}
            </span>
          </Button>
        );
      },
    },
    {
      field: "customer",
      headerName: "Khách hàng",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div style={{ padding: "5px" }}>
            <div
              style={{
                borderRadius: "15px",
                padding: "2px 5px",
              }}
              className={"padding-status"}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                }}
              >
                {params?.row?.customer?.fullName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 120,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <div
              style={{
                borderRadius: "15px",
                padding: "2px 5px",
                backgroundColor:
                  params?.row?.status == "Chờ thanh toán"
                    ? "#949b36"
                    : "#e54242",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
              className={"padding-status"}
            >
              <span
                style={{
                  color: "white",
                  fontSize: "0.8rem",
                }}
              >
                {params?.row?.status}
              </span>
            </div>
          </div>
        );
      },
    },

    {
      field: "total",
      headerName: "Tổng tiền",
      flex: 80,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>{convertCurrency(params?.row?.total)}</span>
          </div>
        );
      },
    },

    {
      field: "finalTotal",
      headerName: "Thành tiền",
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>{convertCurrency(params?.row?.finalTotal)}</span>
          </div>
        );
      },
    },

    {
      field: "note",
      headerName: "Ghi chú",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "staff",
      headerName: "NV tạo đơn",
      flex: 80,
      editable: true,
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
              {params?.row?.staff?.fullName}
            </span>
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

export default TicketList;
