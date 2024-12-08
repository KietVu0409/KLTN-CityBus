import AddIcon from "@mui/icons-material/Add";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Box, Button, Divider, Grid, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormControlCustom from "../../../components/FormControl";
import SearchInput from "../../../components/InputSearch";
import SelectCustom from "../../../components/SelectCustom";
import customToast from "../../../components/ToastCustom";
import { PromotionApi } from "../../../utils/promotionApi";
import "./AdminPromotion.scss";
import AddPromotion from "./conponents/AddPromotion";
import PromotionList from "./conponents/PromotionList";
import Cookies from "js-cookie";

const AdminPromotion = (props) => {
  const [loadings, setLoadings] = useState([]);
  const currentYear = new Date().getFullYear();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const [optionStatus, setOptionStatus] = useState([]);
  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const navigate = useNavigate();
  const isManager = Cookies.get("isManager");

  const filterDateTime = [
    {
      id: 1,
      code: "ALL",
      name: "Tất cả",
    },
    {
      id: 2,
      code: "option",
      name: "Tùy chọn",
    },
  ];

  const onDetailPromotion = (id) => {
    navigate(`/admin/promotion/detail/${id}`);
  };

  const handelOptionStatus = async () => {
    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.getStatus();

      setOptionStatus(response?.data.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  const [disable, setDisable] = useState(true);
  const handleGetData = async () => {
    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.getAll({
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
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    setSearchValue("");
    handelOptionStatus();
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const defaultValues = {
    startDate: null,
    endDate: null,
    status: null,
  };
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;
  const watchStatus = watch("status");
  const watchTime = watch("time");
  useEffect(() => {
    const params = {
      ...filterParams,
      status: watchStatus,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    setFilterParams(params);
  }, [watchStatus, watchTime, startDate, endDate]);
  useEffect(() => {
    const now = new Date();

    if (watchTime?.code === "option") {
      // setSelectedDate({ ...selectedDate, dateFrom: '', dateTo: '' });
    } else {
      const currentYear = new Date().getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      const lastDay = new Date(currentYear, 11, 31);

      setStartDate(null);
      setEndDate(null);
    }
  }, [watchTime]);
  useEffect(() => {
    if (watchTime?.code === "option") {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [watchTime]);
  const resetFilterParams = () => {
    // handleGetData()
    setPage(0);
    setPageSize(10);
    setSearchValue("");
    setStartDate(null);
    setEndDate(null);
    customToast.success("Làm mới dữ liệu thành công");
  };
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Chương trình khuyến mãi</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 10 }}>
            CHƯƠNG TRÌNH KHUYẾN MÃI
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
      <Grid
        className="search"
        container
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        <FormProvider {...methods}>
          <Grid item md={7} style={{ marginRight: 30 }}>
            <Box
              style={{ display: "flex", justifyContent: "flex-start" }}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <FormControlCustom label="Thời gian" fullWidth>
                <div className="view-input" style={{ marginRight: 10 }}>
                  <SelectCustom
                    options={filterDateTime}
                    placeholder={"Tất cả"}
                    name={"time"}
                  />
                </div>
              </FormControlCustom>
              <FormControlCustom label="Ngày bắt đầu" fullWidth>
                <div className="view-input" style={{ marginRight: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={disable}
                      onChange={(e) => {
                        setStartDate(new Date(e));
                      }}
                      value={dayjs(startDate)}
                      className={"date-picker"}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              </FormControlCustom>

              <FormControlCustom label="Ngày kết thúc" fullWidth>
                <div className="view-input" style={{ marginRight: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={disable}
                      value={dayjs(endDate)}
                      onChange={(e) => {
                        setEndDate(new Date(e));
                      }}
                      className={"date-picker"}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              </FormControlCustom>

              <FormControlCustom label="Trạng thái" fullWidth>
                <div className="view-input">
                  <SelectCustom
                    placeholder={"Tất cả"}
                    name={"status"}
                    options={optionStatus}
                  />
                </div>
              </FormControlCustom>
            </Box>
          </Grid>
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
        </FormProvider>
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
          Tổng số:{" "}
        </span>
        <span className="txt-price"> {data?.data?.pagination?.total}</span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <PromotionList
            data={data?.data?.data || []}
            handleShowDetail={onDetailPromotion}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            total={data?.data?.pagination?.total}
            handleGetData={handleGetData}
            page={page}
            pageSize={pageSize}
          ></PromotionList>
        </div>
      </div>
      <AddPromotion
        setShowDrawer={setShowDrawerCreate}
        showDrawer={showDrawerCreate}
        handleGetData={handleGetData}
      ></AddPromotion>
    </Box>
  );
};

export default AdminPromotion;
