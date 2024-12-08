import { Button, IconButton, Tooltip } from "@mui/material";

import DataTable from "../../../../components/DataTable";
import TableCustom from "../../../../components/TableCustom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { VehicleApi } from "../../../../utils/vehicleApi";
import ModalAlert from "../../../../components/Modal";
import { useState } from "react";
import customToast from "../../../../components/ToastCustom";
import Cookies from "js-cookie";

const VehicleList = (props) => {
  const {
    data,
    handleGetData,
    selectionModel,
    handleSelectionModeChange,
    handelDetail,
    handleShowDetail,
    handleClick,
    onChangeRowsPerPage,
    handleChangePage,
    total,
    page,
    pageSize,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [idVehicle, setIdVehicle] = useState(null);
  const [codeVehicle, setCodeVehicle] = useState("");
  const isManager = Cookies.get("isManager");

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, code) => {
    setIdVehicle(id);
    setCodeVehicle(code);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.deleteVehicle(idVehicle);
      customToast.success("Xóa thành công");

      handleGetData();
      setOpenModal(false);
      setIdVehicle(null);
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
      contentAlign:'center',
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Tên xe",
      contentAlign:'center',
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "images",
      headerName: "Ảnh",
      contentAlign:'center',
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={params.row.images[0]?.url}
              alt=""
              style={{ aspectRatio: 1, width: "60px", backgroundSize: "cover" }}
            />
          </div>
        );
      },
    },
    {
      field: "description",
      flex: 300,
      headerName: "Mô tả",
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "type",
      headerName: "Loại xe",
      contentAlign:'center',
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "licensePlate",
      headerName: "Biển số xe",
      contentAlign:'center',
      flex: 120,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "floorNumber",
      headerName: "Số tầng",
      contentAlign:'center',
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "action",
      headerName: "Thao tác",
      contentAlign:'center',
      flex: 80,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          isManager == "true" &&
          <div>
            {" "}
            <Tooltip title="Xem chi tiết">
              <IconButton>
                <VisibilityIcon
                  onClick={() => handelDetail(params.id)}
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
            <span>Mã xe: {codeVehicle} </span>
          </div>
        }
      />
    </div>
  );
};

export default VehicleList;
