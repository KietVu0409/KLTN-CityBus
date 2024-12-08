import { Box, Button, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchInput from "../../../components/InputSearch";
import { FormProvider, useForm } from "react-hook-form";
import FormControlCustom from "../../../components/FormControl";
import SelectCustom from "../../../components/SelectCustom";
import UserList from "./components/UserList";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Helmet } from "react-helmet";
import { CustomerApi } from "../../../utils/customerApi";
import customToast from "../../../components/ToastCustom";
import AddUser from "./components/AddUser";
import InfoUser from "./components/InfoUser";

const AdminUser = (props) => {
  const [loadings, setLoadings] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const [idCustomer, setIdCustomer] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState("");
  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdCustomer(id);
  };

  const getDetailCustomer = async (id) => {
    if (!id) return;
    const customerApi = new CustomerApi();
    const response = await customerApi.getById(id);
    setDetailCustomer(response.data.data);
  };
  useEffect(() => {
    getDetailCustomer(idCustomer);
  }, [idCustomer, showDrawerDetail]);

  const handleGetData = async () => {
    try {
      const customerApi = new CustomerApi();
      const response = await customerApi.getAll({
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

  const defaultValues = {
    brand: null,
    status: null,
    supplier: null,
    outOfDate: null,
    branch: null,
  };

  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;
  const resetFilterParams = () => {
    handleGetData();
    setPage(0);
    setPageSize(10);
    setSearchValue("");
    customToast.success("Làm mới dữ liệu thành công");
  };
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Quản lý khách hàng</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 20 }}>
            DANH SÁCH KHÁCH HÀNG
          </h2>
        </Grid>
        <Grid item md={5}>
          <Box
            style={{ display: "flex", justifyContent: "flex-end" }}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Button
              className={"btn-create"}
              style={{ marginTop: 20, marginRight: 20 }}
              variant="contained"
              color="info"
              startIcon={<RefreshOutlinedIcon />}
              onClick={resetFilterParams}
            >
              <span className={"txt"}>Làm mới</span>
            </Button>
            <Button
              variant="contained"
              color="warning"
              className={"btn-create"}
              startIcon={<AddIcon />}
              style={{ marginTop: 20, marginRight: 20 }}
              onClick={() => {
                setShowDrawerCreate(true);
              }}
            >
              <span className={"txt"}>Thêm mới</span>
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: 20 }} />
      <Grid
        className="search"
        container
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <FormProvider {...methods}>
          <Grid item md={4} style={{ marginTop: 3 }}>
            <div style={{ marginBottom: 5 }}>
              <span className="txt-find" style={{ marginBottom: 20 }}>
                Tìm kiếm
              </span>
            </div>

            <SearchInput
              className="txt-search"
              placeholder={"Tìm kiếm khách hàng"}
              value={searchValue}
              setSearchValue={setSearchValue}
              handleSearch={handleSearch}
            />
          </Grid>
        </FormProvider>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
          marginRight: 30,
          fontWeight: "bold",
        }}
        md={6}
      >
        <span className="title-price">Tổng số khách hàng: </span>
        <span className="txt-price" style={{ marginLeft: 5 }}>
          {data?.data?.pagination?.total}
        </span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <UserList
            data={data?.data?.data || []}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            handleGetData={handleGetData}
            handelDetail={handelDetail}
            page={page}
            pageSize={pageSize}
          ></UserList>
        </div>
      </div>
      <AddUser
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></AddUser>
      <InfoUser
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataCustomer={detailCustomer}
        handleGetData={handleGetData}
      ></InfoUser>
    </Box>
  );
};

export default AdminUser;
