import { Button, IconButton, Tooltip } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import { useState } from "react";
import Badge from "../../../../components/Badge";
import ModalAlert from "../../../../components/Modal";
import TableCustom from "../../../../components/TableCustom";
import customToast from "../../../../components/ToastCustom";
import { PriceListApi } from "../../../../utils/priceListApi";
import Cookies from "js-cookie";

const PriceList = (props) => {
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
  const [idPriceList, setIdPriceList] = useState(null);
  const [namePriceList, setNamePriceList] = useState("");
  const [codePriceList, setCodePriceList] = useState("");
  const isManager = Cookies.get("isManager");

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, name, code) => {
    setIdPriceList(id);
    setNamePriceList(name);
    setCodePriceList(code);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    try {
      const priceListApi = new PriceListApi();
      const response = await priceListApi.deleteById(idPriceList);
      customToast.success("Xóa thành công");

      handleGetData();
      setOpenModal(false);
      setIdPriceList(null);
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
      flex: 40,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign:'center',
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
      field: "name",
      headerName: "Tên bảng giá",
      contentAlign:'center',
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "startDate",
      flex: 130,
      headerName: "Ngày bắt đầu",
      contentAlign:'center',
      headerAlign: "center",
      headerClassName: "theme",
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.startDate !== undefined && params.row?.startDate !== null
                ? moment(params.row.startDate).format("DD-MM-YYYY")
                : "chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      field: "endDate",
      flex: 130,
      headerName: "Ngày kết thúc",
      contentAlign:'center',
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
      field: "note",
      headerName: "Ghi chú",
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      contentAlign:'center',
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Badge
              type={params?.row?.status == "Kích hoạt" ? "success" : "danger"}
              content={params?.row?.status == "Kích hoạt" ? "Hoạt động" : "Tạm ngưng"}
            />
          </div>
        );
      },
    },
    
    {
      field: "action",
      headerName: "",
      flex: 30,
      headerAlign: "center",
      headerClassName: "theme",
      contentAlign:'center',
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
            <span>Mã bảng giá: {codePriceList} </span>
          </div>
        }
      />
    </div>
  );
};

export default PriceList;
