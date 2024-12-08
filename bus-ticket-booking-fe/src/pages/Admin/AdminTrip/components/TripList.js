import { Button, IconButton, Tooltip, Typography } from "@mui/material";

import DataTable from "../../../../components/DataTable";
import TableCustom from "../../../../components/TableCustom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { useState } from "react";
import ModalAlert from "../../../../components/Modal";
import { TripApi } from "../../../../utils/tripApi";
import customToast from "../../../../components/ToastCustom";
import Badge from "../../../../components/Badge";
import Cookies from "js-cookie";

const TripList = (props) => {
  const {
    data,
    selectionModel,
    handleSelectionModeChange,
    handleShowDetail,
    handelDetail,
    handleGetData,
    handleClick,
    onChangeRowsPerPage,
    handleChangePage,
    total,
    page,
    pageSize,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [idTrip, setIdTrip] = useState(null);
  const [codeTrip, setCodeTrip] = useState("");
  const isManager = Cookies.get("isManager");

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, code) => {
    setIdTrip(id);
    setCodeTrip(code);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.deleteTrip(idTrip);
      customToast.success("Xóa thành công");
      handleGetData();
      setOpenModal(false);
      setIdTrip(null);
      setCodeTrip("");
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      flex: 40,
      headerAlign: "center",
      contentAlign:'center',
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "code",
      headerName: "Mã",
      flex: 30,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Tên chuyến",
      flex: 170,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "fromStation",
      flex: 140,
      headerName: "Nơi đi",
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <span>
            {params?.row?.fromStation?.name}({params?.row?.fromStation?.code})
          </span>
        );
      },
    },
    {
      field: "toStation",
      headerName: "Nơi đến",
      flex: 140,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <span
           
          >
            {params?.row?.toStation?.name}({params?.row?.toStation?.code})
          </span>
        );
      },
    },
    // {
    //   field: "startDate",
    //   headerName: "Ngày bắt đầu",
    //   flex: 113,
    //   headerAlign: "center",
    //   contentAlign: "center",
    //   headerClassName: "theme",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <span>{moment(params.row?.startDate).format("DD/MM/YYYY")}</span>
    //     );
    //   },
    // },
    // {
    //   field: "endDate",
    //   headerName: "Ngày kết thúc",
    //   flex: 110,
    //   headerAlign: "center",
    //   contentAlign: "center",
    //   headerClassName: "theme",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <span>
    //           {params.row?.endDate !== undefined && params.row?.endDate !== null
    //             ? moment(params.row.endDate).format("DD/MM/YYYY")
    //             : "chưa xác định"}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "travelHours",
      headerName: "Thời gian di chuyển (giờ)",
      flex: 110,
      headerAlign: "center",
      contentAlign:'center',
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 200,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Badge
              type={params?.row?.status == "Kích hoạt" ? "success" : "danger"}
              content={
                params?.row?.status == "Kích hoạt" ? "Hoạt động" : "Tạm ngưng"
              }
            />
          </div>
        );
      },
    },
    {
      field: "TripDetails",
      headerName: "Chuyến chi tiết",
      flex: 120,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            {" "}
            <Button onClick={() => handelDetail(params.id)}>Xem</Button>
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Thao tác",
      flex: 110,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          isManager == "true" &&
          <div>
            {" "}
            <Tooltip title="Cập nhật">
              <IconButton>
                <BorderColorIcon
                  onClick={() => handleShowDetail(params.id)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    width: 17,
                    height: 17,
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa">
              <IconButton>
                <DeleteIcon
                  onClick={() =>
                    handleOpenModal(params?.row?.id, params?.row?.code)
                  }
                  style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    width: 17,
                    height: 17,
                  }}
                />
              </IconButton>
            </Tooltip>
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
      <ModalAlert
        open={openModal}
        handleClose={() => handleCloseModal()}
        handleCancel={() => handleCloseModal()}
        handleConfirm={() => handleConfirm()}
        title={"Xác nhận xóa"}
        description={
          "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
        }
        type={"error"}
        icon={true}
        renderContentModal={
          <div className="view-input-discount">
            <span>Mã chuyến: {codeTrip} </span>
          </div>
        }
      />
    </div>
  );
};

export default TripList;
