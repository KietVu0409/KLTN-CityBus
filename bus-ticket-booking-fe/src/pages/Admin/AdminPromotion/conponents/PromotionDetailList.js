import { Button, IconButton, Tooltip } from "@mui/material";
import moment from "moment";
import { useState } from "react";

import DataTable from "../../../../components/DataTable";
import ModalAlert from "../../../../components/Modal";
import TableCustom from "../../../../components/TableCustom";
import customToast from "../../../../components/ToastCustom";
import { convertCurrency } from "../../../../data/curren";
import { PriceListApi } from "../../../../utils/priceListApi";
import { PromotionApi } from "../../../../utils/promotionApi";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";

const PromotionDetailList = (props) => {
  const {
    data,
    selectionModel,
    handleSelectionModeChange,
    handleShowDetail,
    handleClick,
    onChangeRowsPerPage,
    getPromotionLine,
    handleChangePage,
    total,
    page,
    pageSize,
  } = props;

  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [code, setCode] = useState("");
  const isManager = Cookies.get("isManager");

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, code) => {
    setId(id);
    setCode(code);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.deletePromotionLine(id);
      customToast.success("Xóa thành công");

      getPromotionLine();
      setOpenModal(false);
      setId(null);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const columns = [
    {
      field: "code",
      headerName: "Mã",
      flex: 50,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <span
            style={{
              color: "#1A89AC",
              fontSize: "0.8rem",
              display: "inline-block",
              textTransform: "none",
            }}
          >
            {params.row?.code}
          </span>
        );
      },
    },
    {
      field: "couponCode",
      headerName: "Mã áp dụng",
      contentAlign: "center",
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "title",
      headerName: "Tiêu đề",
      contentAlign: "center",
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "type",
      headerName: "Loại khuyến mãi",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <span>{moment(params.row?.startDate).format("DD/MM/YYYY")}</span>
        );
      },
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      contentAlign: "center",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return <span>{moment(params.row?.endDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: "action",
      headerName: "Thao tác",
      contentAlign: "center",
      flex: 70,
      headerAlign: "center",
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
            <span>Mã: {code} </span>
          </div>
        }
      />
    </div>
  );
};

export default PromotionDetailList;
