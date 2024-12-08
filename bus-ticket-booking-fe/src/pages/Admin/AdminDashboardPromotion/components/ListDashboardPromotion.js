import { Button } from "@mui/material";

import moment from "moment";
import { useState } from "react";
import "../../../../assets/scss/default.scss";
import TableCustom from "../../../../components/TableCustom";
import { convertCurrency } from "../../../../data/curren";

const DashboardPromotionList = (props) => {
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
      headerName: "Mã CTKM",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      contentAlign: "center",
    },
    {
      field: "title",
      headerName: "Tiêu đề CTKM",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "startDate",
      flex: 85,
      headerName: "Ngày bắt đầu",
      contentAlign: "center",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.startDate !== undefined &&
              params.row?.startDate !== null
                ? moment(params.row.startDate).format("DD-MM-YYYY")
                : "chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      field: "endDate",
      flex: 85,
      headerName: "Ngày kết thúc",
      contentAlign: "center",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.endDate !== undefined && params.row?.endDate !== null
                ? moment(params.row.endDate).format("DD-MM-YYYY")
                : "chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      field: "title",
      headerName: "Chiết khấu(%)",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.promotionDetail?.percentDiscount}</span>
          </div>
        );
      },
    },

    {
      field: "title",
      headerName: "Chiết khấu(VND)",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.promotionDetail?.reductionAmount
                ? convertCurrency(params.row?.promotionDetail?.reductionAmount)
                : ""}
            </span>
          </div>
        );
      },
    },
    {
      field: "maxBudget",
      headerName: "Ngân sách tổng",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{convertCurrency(params.row?.maxBudget)}</span>
          </div>
        );
      },
    },
    {
      field: "useBudget",
      headerName: "Ngân sách đã sử dụng",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{convertCurrency(params.row?.useBudget)}</span>
          </div>
        );
      },
    },
    {
      field: "Budget",
      headerName: "Ngân sách còn lại",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{convertCurrency(params.row?.maxBudget - params.row?.useBudget)}</span>
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

export default DashboardPromotionList;
