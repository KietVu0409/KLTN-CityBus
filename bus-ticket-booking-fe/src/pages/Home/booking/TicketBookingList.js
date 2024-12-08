import moment from "moment";
import TableCustom from "../../../components/TableCustom";
import { convertCurrency, numberFormat } from "../../../data/curren";

const TicketBookingList = (props) => {
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
      field: "code",
      headerName: "Mã vé",
      flex: 40,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Mã ghế",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.seat?.code}</span>
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Tên ghế",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.seat?.name}</span>
          </div>
        );
      },
    },

    {
      field: "vehicleName",
      headerName: "Tên xe",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "vehicleLicensePlate",
      headerName: "Biển số",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "startDate",
      flex: 130,
      headerName: "Thời gian đi",
      contentAlign: "center",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {moment(params.row.startDate).format("DD-MM-YYYY HH:MM")}
            </span>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Gía vé",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.price
                ? convertCurrency(params.row?.price)
                : "chưa xác định"}
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
        pagination={false}
      />
    </div>
  );
};

export default TicketBookingList;
