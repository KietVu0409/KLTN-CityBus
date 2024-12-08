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
import Cookies from "js-cookie";

const UserGroupList = (props) => {
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
      const groupCusApi = new GroupCusApi();
      const response = await groupCusApi.deleteById(idGroup);
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
      headerName: "STT",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "code",
      headerName: "Mã nhóm",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "name",
      headerName: "Tên nhóm",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "description",
      flex: 150,
      headerName: "Mô tả",
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "note",
      headerName: "Ghi chú",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "action",
      headerName: "Thao tác",
      flex: 50,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            {" "}
            <Tooltip title="Xem chi tiết">
              <IconButton>
                <VisibilityIcon
                  style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    width: 17,
                    height: 17,
                  }}
                  onClick={() => handelDetail(params.id)}
                />
              </IconButton>
            </Tooltip>
            {isManager == "true" && (
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
            )}
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
            <span>Mã nhóm: {codeGroup} </span>
          </div>
        }
      />
    </div>
  );
};

export default UserGroupList;
