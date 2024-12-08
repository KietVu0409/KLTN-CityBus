
import moment from "moment";
import { useState } from "react";
import ModalAlert from "../../../../components/Modal";
import TableCustom from "../../../../components/TableCustom";


const CustomerList = (props) => {
  const {
    idGroup,
    data,
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
  const [idCustomer, setIdCustomer] = useState("");
  const [nameCustomer, setNameCustomer] = useState("");
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenModal = (id, name) => {
    setIdCustomer(id)
    setNameCustomer(name);
    setOpenModal(true);
  };

  const handleConfirm = async () => {
    
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Tên",
      contentAlign:'center',
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "email",
      flex: 50,
      headerName: "Email",
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "phone",
      headerName: "Điện thoại",
      flex: 50,
      headerAlign: "center",
      contentAlign:'center',
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "gender",
      headerName: "Giới tính",
      contentAlign:'center',
      flex: 70,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.gender === "F"
                ? "Nữ"
                : params.row?.gender === "M"
                ? "Nam"
                : "Chưa xác định"}
            </span>
          </div>
        );
      },
    },
    {
      field: "birthday",
      headerName: "Ngày sinh",
      flex: 70,
      headerAlign: "center",
      contentAlign:'center',
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.birthday !== undefined &&
              params.row?.birthday !== null
                ? moment(params.row.birthday).format("DD-MM-YYYY")
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
        pagination={false}
        total={total}
        page={page}
        pageSize={pageSize}
      />
      <ModalAlert
        open={openModal}
        handleClose={() => handleCloseModal()}
        handleCancel={() => handleCloseModal()}
        handleConfirm={() => handleConfirm()}
        title={"Xác nhận xóa khách hàng khỏi nhóm"}
        description={
          "Thao tác sẽ không thể hoàn tác, bạn có chắc chắn muốn tiếp tục không?"
        }
        type={"error"}
        icon={true}
        renderContentModal={
          <div className="view-input-discount">
            <span>Tên khách hàng: {nameCustomer}</span>
          </div>
        }
      />
    </div>
  );
};

export default CustomerList;
