import { IconButton, Tooltip } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import Badge from "../../../../components/Badge";
import TableCustom from "../../../../components/TableCustom";

const StaffList = (props) => {
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
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "code",
      headerName: "Mã nhân viên",
      flex: 40,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    {
      field: "fullName",
      headerName: "Tên nhân viên",
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
      contentAlign: "center",
      flex: 120,
      headerAlign: "center",
      headerClassName: "theme",
      sortable: false,
    },
    // {
    //   field: "birthDay",
    //   headerName: "Ngày sinh",
    //   contentAlign: "center",
    //   flex: 120,
    //   headerAlign: "center",
    //   headerClassName: "theme",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         <span>
    //           {params.row?.birthDay
    //             ? moment(params.row.birthDay).format("DD/MM/YYYY")
    //             : "Chưa xác định"}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "gender",
      headerName: "Giới tính",
      flex: 100,
      headerAlign: "center",
      contentAlign: "center",
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
      field: "isManage",
      headerName: "Chức vụ",
      flex: 100,
      headerAlign: "center",
      contentAlign: "center",
      headerClassName: "theme",
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <span>
              {params.row?.isManage === true ? "Quản lý" : "Nhân viên"}
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
                  onClick={() => handelDetail(params.row.code)}
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

export default StaffList;
