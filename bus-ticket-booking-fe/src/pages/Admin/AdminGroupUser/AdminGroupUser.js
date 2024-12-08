import { Box, Button, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchInput from "../../../components/InputSearch";
import { FormProvider, useForm } from "react-hook-form";
import FormControlCustom from "../../../components/FormControl";
import SelectCustom from "../../../components/SelectCustom";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import UserGroupList from "./components/ListGroupUser";
import { GroupCusApi } from "../../../utils/groupCusApi";
import customToast from "../../../components/ToastCustom";
import { Helmet } from "react-helmet";
import AddGroupUser from "./components/AddGroupUser";
import InfoGroupUser from "./components/InfoGroupUser";
import Cookies from "js-cookie";

const AdminGroupUser = (props) => {
  const [loadings, setLoadings] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const [idGroupCustomer, setIdGroupCustomer] = useState(null);
  const [detailGroupCustomer, setDetailGroupCustomer] = useState("");
  const isManager = Cookies.get("isManager");

  const handleGetData = async () => {
    try {
      const groupCusApi = new GroupCusApi();
      const response = await groupCusApi.getAll({
        page: page + 1,
        pageSize: pageSize,
        ...filterParams,
      });
      setData(response);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    setFilterParams({ ...filterParams, keywords: searchValue });
  }, [searchValue]);

  useEffect(() => {
    handleGetData();
  }, [page, pageSize, filterParams]);

  const handleSearch = (e) => {
    setFilterParams({ keywords: searchValue || undefined });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const resetFilterParams = () => {
    handleGetData();
    setPage(0);
    setPageSize(10);
    setSearchValue("");
    customToast.success("Làm mới dữ liệu thành công");
  };
  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdGroupCustomer(id);
  };
  const getDetailGroupCustomer = async (id) => {
    if (!id) return;
    const customerGroupApi = new GroupCusApi();
    const response = await customerGroupApi.getGroupCusById(id);
    setDetailGroupCustomer(response.data.data);
  };
  useEffect(() => {
    getDetailGroupCustomer(idGroupCustomer);
  }, [idGroupCustomer, showDrawerDetail]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Nhóm khách hàng</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 10 }}>
            NHÓM KHÁCH HÀNG
          </h2>
        </Grid>
        <Grid item md={5}>
          <Box
            style={{ display: "flex", justifyContent: "flex-end" }}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Button
              className={"btn-create"}
              style={{ marginTop: 10, marginRight: 20 }}
              variant="contained"
              color="info"
              startIcon={<RefreshOutlinedIcon />}
              onClick={resetFilterParams}
            >
              <span className={"txt"}>Làm mới</span>
            </Button>
            {isManager == "true" && (
              <Button
                variant="contained"
                color="warning"
                className={"btn-create"}
                startIcon={<AddIcon />}
                style={{ marginTop: 10, marginRight: 20 }}
                onClick={() => {
                  setShowDrawerCreate(true);
                }}
              >
                <span className={"txt"}>Thêm mới</span>
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: 10 }} />
      <Grid className="search" container style={{ marginTop: 10 }}>
        <Grid item md={4} style={{ marginTop: 3 }}>
          <div style={{ marginBottom: 5 }}>
            <span className="txt-find">Tìm kiếm</span>
          </div>

          <SearchInput
            className="txt-search"
            placeholder={"Nhập thông tin tìm kiếm"}
            value={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
          />
        </Grid>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 10,
        }}
        md={6}
      >
        <span
          className="title-price"
          style={{
            color: "#000",
            marginRight: 5,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Tổng số nhóm khách hàng: {data?.data?.pagination?.total}
        </span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <UserGroupList
            data={data?.data?.data || []}
            handleChangePage={handleChangePage}
            handelDetail={handelDetail}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            handleGetData={handleGetData}
            page={page}
            pageSize={pageSize}
          ></UserGroupList>
        </div>
      </div>
      <AddGroupUser
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></AddGroupUser>
      <InfoGroupUser
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataGroupCustomer={detailGroupCustomer}
        handleGetData={handleGetData}
      ></InfoGroupUser>
    </Box>
  );
};

export default AdminGroupUser;
