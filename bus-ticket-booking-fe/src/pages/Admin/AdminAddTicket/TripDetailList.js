
import moment from "moment";
import { useState } from "react";

import TableCustom from "../../../components/TableCustom";
import { Button } from "@mui/material";
import Badge from "../../../components/Badge";

const TripDetailList = (props) => {
  const {
    data,
    handleGetData,
    selectionModel,
    handleSelectionModeChange,
    handleShowDetail,
    handelDetail,
    handleClick,
    onChangeRowsPerPage,
    handleChangePage,
    total,
    page,
    pageSize,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const [idGroup, setIdGroup] = useState(null);
  const [nameGroup, setNameGroup] = useState("");
  const [codeGroup, setCodeGroup] = useState("");

 
  const columns = [
    {
      field: "code",
      headerName: "Mã ",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
          onClick={() => handleShowDetail(params?.row?.code, params?.row?.departureTime)}
            style={{ backgroundColor: 'transparent' }}
            disabled={false}
            color="primary"
          >
            <span
              style={{
                textDecorationLine: 'underline',
                color: '#1A89AC',
                fontSize: '0.8rem',
                display: 'inline-block',
                textTransform: 'none',
              }}
            >
              {params?.row?.code}
            </span>
          </Button>
        );
      },
    },
    {
      field: "departureTime",
      headerName: "Giờ khởi hành",
      contentAlign: "center",
      flex: 110,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.departureTime !== undefined &&
              params.row?.departureTime !== null
                ? moment(params.row.departureTime).format("DD-MM-YYYY HH:mm")
                : "chưa xác định"}
            </span>
          </div>
        );
      },
    },

    {
      field: "expectedTime",
      flex: 110,
      headerName: "Thời gian dự kiến",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.expectedTime !== undefined &&
              params.row?.expectedTime !== null
                ? moment(params.row.expectedTime).format("DD-MM-YYYY HH:mm")
                : "chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Badge
              type={params?.row?.status == "Còn vé" ? "success" : "danger"}
              content={params?.row?.status }
            />
          </div>
        );
      },
    },
    {
        field: "fromStation",
        headerName: "Nơi xuất phát",
        flex: 150,
        headerAlign: "center",
        headerClassName: "theme",
        sortable: false,
        renderCell: (params) => {
            return (
              <div>
                <span>
                  {params.row?.trip?.fromStation?.name}
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
        sortable: false,
        renderCell: (params) => {
            return (
              <div>
                <span>
                  {params.row?.trip?.toStation?.name}
                </span>
              </div>
            );
          },
      },
    
    {
      field: "note",
      headerName: "Loại xe",
      flex: 80,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params?.row?.vehicle?.type}</span>
          </div>
        );
      },
    },
    {
      field: "note",
      headerName: "Biển số",
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params?.row?.vehicle?.licensePlate}</span>
          </div>
        );
      },
    },
  ];

  return (
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
  );
};

export default TripDetailList;
