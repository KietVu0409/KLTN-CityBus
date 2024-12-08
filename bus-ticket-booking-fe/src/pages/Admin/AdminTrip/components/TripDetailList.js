import { Button, IconButton, Tooltip } from "@mui/material";

import DataTable from "../../../../components/DataTable";
import TableCustom from "../../../../components/TableCustom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import ModalAlert from "../../../../components/Modal";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import customToast from "../../../../components/ToastCustom";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { TripApi } from "../../../../utils/tripApi";
import Badge from "../../../../components/Badge";
import Cookies from "js-cookie";

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
  const isManager = Cookies.get("isManager");

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, name, code) => {
    setIdGroup(id);
    setNameGroup(name);
    setCodeGroup(code);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.deleteTripDetail(idGroup);
      customToast.success("Xóa thành công");

      handleGetData();
      setOpenModal(false);
      setIdGroup(null);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const columns = [
    {
      field: "stt",
      headerName: "STT ",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "code",
      headerName: "Mã ",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "departureTime",
      headerName: "Giờ khởi hành",
      contentAlign: "center",
      flex: 160,
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
      flex: 160,
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
              content={params?.row?.status}
            />
          </div>
        );
      },
    },
    {
      field: "vehicle",
      headerName: "Mã xe",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params?.row?.vehicle?.code}</span>
          </div>
        );
      },
    },
    {
      field: "vehicle",
      headerName: "Tên xe",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>{params?.row?.vehicle?.name}</span>
          </div>
        );
      },
    },
    {
      field: "note",
      headerName: "Loại xe",
      flex: 110,
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
      flex: 100,
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
    {
      field: "action",
      headerName: "Thao tác",
      flex: 100,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          isManager == "true" && (
            <div>
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
                      handleOpenModal(
                        params?.row?.id,
                        params?.row?.name,
                        params?.row?.code
                      )
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
          )
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
            <span>Mã nhóm: {codeGroup} </span>
          </div>
        }
      />
    </div>
  );
};

export default TripDetailList;
