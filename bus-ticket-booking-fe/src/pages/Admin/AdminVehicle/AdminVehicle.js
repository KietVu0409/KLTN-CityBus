import { Box, Button, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchInput from "../../../components/InputSearch";
import VehicleList from "./components/VehicleList";
import { FormProvider, useForm } from "react-hook-form";
import FormControlCustom from "../../../components/FormControl";
import SelectCustom from "../../../components/SelectCustom";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { VehicleApi } from "../../../utils/vehicleApi";
import customToast from "../../../components/ToastCustom";
import { Helmet } from "react-helmet";
import AddVehicle from "./components/AddVehicle";
import DetailVehicle from "./components/DetailVehicle";
import Cookies from "js-cookie";

const AdminVehicle = (props) => {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [filterParams, setFilterParams] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [typeSearch, setTypeSearch] = useState(null);
  const [floorNumber, setFloorNumber] = useState(null);
  const [type, setType] = useState("");
  const [showDrawerDetail, setShowDrawerDetail] = useState(false);
  const [idVehicle, setIdVehicle] = useState(null);
  const [detailVehicle, setDetailVehicle] = useState("");

  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const isManager = Cookies.get("isManager");

  const floorNumberFilter = [
    {
      id: 1,
      code: "1",
      name: "Một tầng",
    },
    {
      id: 2,
      code: "2",
      name: "Hai tầng",
    },
  ];

  const handelGetType = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.getType();
      const typeTmp = [];
      response?.data?.data.map((item) => {
        typeTmp.push({
          code: item.key,
          name: item.value,
        });
      });
      setType(typeTmp);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  const handleGetData = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.getAll({
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

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    setSearchValue('');
  }, []);

  useEffect(() => {
    handelGetType();
  }, []);

  useEffect(() => {
    handleGetData();
  }, [page, pageSize, filterParams]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };
  const defaultValues = {
    typeSearch: null,
    floorNumber: null,
  };
  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;

  const watchType = watch("typeSearch");
  const watchFloorNumber = watch("floorNumber");

  useEffect(() => {
    const params = {
      ...filterParams,
      type: watchType?.name,
      floorNumber: watchFloorNumber?.id,
    };
    setFilterParams(params);
  }, [watchType, watchFloorNumber]);

  const handelDetail = (id) => {
    setShowDrawerDetail(true);
    setIdVehicle(id);
  };
  const getDetailVehicle = async (id) => {
    if (!id) return;
    const vehicleApi = new VehicleApi();
    const response = await vehicleApi.getById(id);
    setDetailVehicle(response.data.data);
  };
  useEffect(() => {
    getDetailVehicle(idVehicle);
  }, [idVehicle, showDrawerDetail]);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Quản lý xe</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 20 }}>
            DANH SÁCH XE
          </h2>
        </Grid>
        {isManager == "true" && <Grid item md={5}>
        <Box
          style={{ display: "flex", justifyContent: "flex-end" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
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
      </Grid>}
        
      </Grid>
      <Divider style={{ marginTop: 20 }} />
      <Grid
        className="search"
        container
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <FormProvider {...methods}>
          <Grid item md={6} style={{ marginRight: 200 }}>
            <Box
              style={{ display: "flex", justifyContent: "flex-start" }}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <FormControlCustom label="Loại xe" fullWidth>
                <div className="view-input" style={{ marginRight: 20 }}>
                  <SelectCustom
                    placeholder={"Tất cả"}
                    name={"typeSearch"}
                    options={type}
                  />
                </div>
              </FormControlCustom>
              <FormControlCustom label="Số tầng" fullWidth>
                <div className="view-input" style={{ marginRight: 20 }}>
                  <SelectCustom
                    placeholder={"Tất cả"}
                    name={"floorNumber"}
                    options={floorNumberFilter}
                  />
                </div>
              </FormControlCustom>
            </Box>
          </Grid>
          <Grid item md={4} style={{ marginTop: 3 }}>
            <div style={{ marginBottom: 5 }}>
              <span className="txt-find" style={{ marginBottom: 20 }}>
                Tìm kiếm
              </span>
            </div>

            <SearchInput
              className="txt-search"
              placeholder={"Tìm kiếm theo tên, mô tả xe"}
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
          marginRight: 10,
          color: "#000",
          fontSize: 15,
          fontWeight: "bold",
        }}
        md={6}
      >
        <span className="title-price">Tổng số xe: </span>
        <span className="txt-price">{data?.data?.pagination?.total}</span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <VehicleList
            data={data?.data?.data || []}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            handleGetData={handleGetData}
            handelDetail={handelDetail}
            page={page}
            pageSize={pageSize}
          ></VehicleList>
        </div>
      </div>
      <AddVehicle
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></AddVehicle>
      <DetailVehicle
        setShowDrawerDetail={setShowDrawerDetail}
        showDrawerDetail={showDrawerDetail}
        dataVehicle={detailVehicle}
        handleGetData={handleGetData}
      ></DetailVehicle>
    </Box>
  );
};

export default AdminVehicle;
