import { IconButton, Tooltip } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import Badge from "../../../../components/Badge";
import TableCustom from "../../../../components/TableCustom";

const UserList = (props) => {
  const {
    data,
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
      field: "fullName",
      headerName: "Tên khách hàng",
      // contentAlign:'center',
      flex: 150,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },

    {
      field: "email",
      flex: 100,
      headerName: "Email",
      // contentAlign:'center',
      headerAlign: "center",
      headerClassName: "theme",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      contentAlign:'center',
      flex: 100,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 70,
      headerAlign: "center",
      contentAlign:'center',
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
                : "Khác"}
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      contentAlign:'center',
      flex: 130,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Badge
              type={
                params?.row?.status == "Chưa kích hoạt"
                  ? "warning"
                  : params?.row?.status == "Tạm khóa"
                  ? "danger"
                  : "success"
              }
              content={params?.row?.status}
            />
          </div>
        );
      },
    },
    {
      field: "customerGroup",
      headerName: "Nhóm khách hàng",
      flex: 150,
      headerAlign: "center",
      contentAlign:'center',
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.customerGroup != null
                ? params.row.customerGroup.name
                : ""}
            </span>
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "",
      flex: 30,
      headerAlign: "center",
      contentAlign:'center',
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
            
          </div>
        );
      },
    },
  ];

  return (
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
  );
};

export default UserList;
