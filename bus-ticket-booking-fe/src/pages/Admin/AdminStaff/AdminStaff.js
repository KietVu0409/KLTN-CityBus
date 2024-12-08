import AddIcon from "@mui/icons-material/Add";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Box, Button, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import SearchInput from "../../../components/InputSearch";
import customToast from "../../../components/ToastCustom";
import { CustomerApi } from "../../../utils/customerApi";
import { StaffApi } from "../../../utils/staffApi";
import StaffList from "./components/StaffList";
import AddStaff from "./components/AddStaff";
import InfoStaff from "./components/InfoStaff";

const AdminStaff = (props) => {
  const [loadings, setLoadings] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const [idStaff, setIdStaff] = useState(null);
  const [detailStaff, setDetailStaff] = useState("");
  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdStaff(id);
  };

  const getDetailStaff = async (id) => {
    if (!id) return;
    const staffApi = new StaffApi();
    const response = await staffApi.getByCode(id);
    setDetailStaff(response.data.data);
  };
  useEffect(() => {
    getDetailStaff(idStaff);
  }, [idStaff, showDrawerDetail]);

  const handleGetData = async () => {
    try {
      const staffApi = new StaffApi();
      const response = await staffApi.getAll({
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
    setFilterParams({ ...filterParams, keyword: searchValue });
  }, [searchValue]);

  useEffect(() => {
    handleGetData();
  }, [page, pageSize, filterParams]);

  const handleSearch = (e) => {
    setFilterParams({ keyword: searchValue || undefined });
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
        <title> CITY BUS - Quản lý nhân viên</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 20 }}>
            DANH SÁCH NHÂN VIÊN
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
              placeholder={"Tìm kiếm nhân viên"}
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
        <span className="title-price">Tổng số nhân viên: </span>
        <span className="txt-price" style={{ marginLeft: 5 }}>
          {data?.data?.pagination?.total}
        </span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <StaffList
            data={data?.data?.data || []}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            handleGetData={handleGetData}
            handelDetail={handelDetail}
            page={page}
            pageSize={pageSize}
          ></StaffList>
        </div>
      </div>
      <AddStaff
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></AddStaff>
      <InfoStaff
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataStaff={detailStaff}
        handleGetData={handleGetData}
      ></InfoStaff>
    </Box>
  );
};

export default AdminStaff;
