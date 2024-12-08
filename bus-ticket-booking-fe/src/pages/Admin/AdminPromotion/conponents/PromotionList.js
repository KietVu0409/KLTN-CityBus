import { Button, IconButton, Tooltip } from "@mui/material";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { useState } from "react";
import Badge from "../../../../components/Badge";
import TableCustom from "../../../../components/TableCustom";
import ModalAlert from "../../../../components/Modal";
import { PromotionApi } from "../../../../utils/promotionApi";
import customToast from "../../../../components/ToastCustom";
import Cookies from "js-cookie";


const PromotionList = (props) => {
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
  const [openModal, setOpenModal] = useState(false);
  const [idPromotion, setIdPromotion] = useState(null);
  const [codePromotion, setCodePromotion] = useState("");
  const isManager = Cookies.get("isManager");

    const handleCloseModal = () => {
      setOpenModal(false);
    };
    const handleOpenModal = (id, code) => {
      setIdPromotion(id);
      setCodePromotion(code);
      setOpenModal(true);
    };

    const handleConfirm = async () => {
      try {
        const promotionApi = new PromotionApi();
        const response = await promotionApi.deleteById(idPromotion);
        customToast.success("Xóa thành công");

        handleGetData();
        setOpenModal(false);
        setIdPromotion(null);
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
      contentAlign: "center",
      flex: 30,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
          onClick={() => handleShowDetail(params?.row?.code)}
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
      field: "image",
      headerName: " Hình ảnh",
      contentAlign: "center",
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
              src={params.row.image}
              alt=""
              style={{ aspectRatio: 1, width: "50px", backgroundSize: "cover" }}
            />
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "Tiêu đề",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "startDate",
      flex: 120,
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
      flex: 120,
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
      field: "status",
      headerName: "Trạng thái",
      contentAlign: "center",
      flex: 115,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Badge
              type={
                params?.row?.status == "Đang hoạt động"
                  ? "success"
                  : params?.row?.status == "Ngừng hoạt động"
                  ? "danger"
                  : "warning"
              }
              content={params?.row?.status}
            />
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Thao tác",
      contentAlign: "center",
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          isManager == "true" &&
          <div>
            {" "}
            <Tooltip title="Xóa">
              <IconButton>
                <DeleteIcon
                onClick={() =>
                  handleOpenModal(
                    params?.row?.id,
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
            <span>Mã bảng giá: {codePromotion} </span>
          </div>
        }
      />
    </div>
  );
};

export default PromotionList;
