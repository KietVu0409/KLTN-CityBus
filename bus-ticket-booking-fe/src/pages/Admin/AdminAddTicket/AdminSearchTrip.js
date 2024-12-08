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
import FormControlCustom from "../../../components/FormControl";
import SearchInput from "../../../components/InputSearch";
import SelectCustom from "../../../components/SelectCustom";
import customToast from "../../../components/ToastCustom";
import OrderList from "../AdminOrder/components/OrderList";
import { ProvinceApi } from "../../../utils/provinceApi";
import TripDetailList from "./TripDetailList";
import { TripApi } from "../../../utils/tripApi";
import { useNavigate } from "react-router-dom";

const AdminSearchTrip = (props) => {
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromProvince, setFromProvince] = useState(null);
  const [toProvince, setToProvince] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [filterParams, setFilterParams] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const now = new Date();

  const onBookingTrip = (code, departureTime) => {
    if(new Date(departureTime) > now){
      navigate(`/admin/booking-trip/create-ticket/${code}`);
    }else{
      customToast.error("Chuyến này đã khởi hành không thể đặt vé")
    }
    
  };

  const getDataProvince = async () => {
    try {
      setLoading(true);
      const provinceApi = new ProvinceApi();
      const res = await provinceApi.getAllProvince();
      const data = res?.data?.data;
      const newData = data.filter((item) => item.code !== 0);
      setOptionsProvince(newData);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    getDataProvince();
    handleGetData();
  }, []);

  const handleGetData = async (id) => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.getTripDetail({
        page: page + 1,
        pageSize: pageSize,
        departureTime: new Date(startDate),
        isPriceDetailExist:0,
        ...filterParams,
      });

      const data = response?.data?.data;
      setTotal(response?.data?.pagination?.total);
      const updatedData = await Promise.all(
        data.map(async (item) => {
          const response1 = await tripApi.getTripDetailById(item.id);

          item.trip = response1?.data?.data?.trip;
          item.vehicle = response1?.data?.data?.vehicle;

          return item;
        })
      );
      console.log(updatedData);
      setData(updatedData);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

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
    fromProvince: null,
    toProvince: null,
    startDate: null,
  };
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;
  const watchFrom = watch("fromProvince");
  const watchTo = watch("toProvince");
  useEffect(() => {
    const params = {
      fromProvinceCode: watchFrom?.code,
      toProvinceCode: watchTo?.code,
      departureTime: new Date(startDate),
    };
    setFilterParams(params);
  }, [watchFrom, watchTo, startDate]);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Helmet>
        <title> CITY BUS - Đặt vé xe</title>
      </Helmet>
      <Grid container className={"align-items-center header_title"}>
        <Grid item md={7}>
          <h2 className={"txt-title"} style={{ marginTop: 10 }}>
            ĐẶT VÉ XE KHÁCH HÀNG
          </h2>
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
              <FormControlCustom label="Nơi đi" fullWidth>
                <div className="view-input">
                  <SelectCustom
                    placeholder={"Nơi đi"}
                    name={"fromProvince"}
                    options={optionsProvince}
                  />
                </div>
              </FormControlCustom>
              <FormControlCustom label="Nơi đến" fullWidth>
                <div className="view-input">
                  <SelectCustom
                    placeholder={"Nơi đến"}
                    name={"toProvince"}
                    options={optionsProvince}
                  />
                </div>
              </FormControlCustom>
              <FormControlCustom label="Ngày đi" fullWidth>
                <div className="view-input" style={{ marginRight: 10 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(startDate)}
                      onChange={(e) => {
                        setStartDate(new Date(e));
                      }}
                      className={"date-picker"}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              </FormControlCustom>
            </Box>
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
          Tổng số chuyến: {total}
        </span>
        <span className="txt-price"> </span>
      </Grid>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }}>
          <TripDetailList
            data={data || []}
            handleChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            handleShowDetail={onBookingTrip}
            total={total}
            handleGetData={handleGetData}
            page={page}
            pageSize={pageSize}
          ></TripDetailList>
        </div>
      </div>
    </Box>
  );
};

export default AdminSearchTrip;
