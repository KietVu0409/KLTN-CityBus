import moment from "moment";
import { convertCurrency } from "../../../../data/curren";
import TableCustom from "../../../../components/TableCustom";
import PrintIcon from "@mui/icons-material/Print";

const TicketOrderListOrderRefund = (props) => {
  const {
    data,
    handleGetData,
    selectionModel,
    handleSelectionModeChange,
    handleShowDetail,
    onClickPrint,
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
      flex: 90,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.ticketDetail?.code}</span>
          </div>
        );
      },
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
            <span>{params.row?.ticketDetail?.seat?.code}</span>
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
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.ticketDetail?.seat?.vehicle?.name}</span>
          </div>
        );
      },
    },
    {
      field: "vehicleLicensePlate",
      headerName: "Biển số",
      contentAlign: "center",
      flex: 90,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row?.ticketDetail?.seat?.vehicle?.licensePlate}</span>
          </div>
        );
      },
    },
    {
      field: "startDate",
      flex: 120,
      headerName: "Thời gian đi",
      contentAlign: "center",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {moment(
                params.row?.ticketDetail?.ticket?.tripDetail?.departureTime
              ).format("DD-MM-YYYY HH:MM")}
            </span>
          </div>
        );
      },
    },

    {
      field: "total",
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
              {params.row?.total
                ? convertCurrency(params.row?.total)
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

export default TicketOrderListOrderRefund;
