import React, { useMemo } from "react";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from '@mui/material/styles';
import TripDetailList from "./TripDetailList";
import { TripApi } from "../../../../utils/tripApi";
import customToast from "../../../../components/ToastCustom";
import AddTripDetail from "./AddTripDetail";
import FormControlCustom from "../../../../components/FormControl";
import SelectCustom from "../../../../components/SelectCustom";
import EditTripDetail from "./EditTripDetail";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const useStyles = styled((theme) => ({
  dialogRoot: {
    minWidth: "90%",
    maxWidth: "90%",
    maxHeight: "90%",
    position: "fixed",
    top: "25%",
    left: "25%",
    transform: "translate(-25%, -25%)",
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
}));

const TripDetail = (props) => {
  const { setShowDrawerDetail, showDrawerDetail, dataTrip } = props;
  const [images, setImages] = useState();
  const [urlImage, setUrlImage] = useState();
  const classes = useStyles();
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterParams, setFilterParams] = useState(null);
  const [showDrawerCreate, setShowDrawerCreate] = useState(false);
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);
  const [idTripDetail, setIdTripDetail] = useState(null);
  const [dataTripDetail, setDataTripDetail] = useState("");
  const currentYear = new Date().getFullYear();
  const firstDay = new Date(currentYear, 0, 1);
  const lastDay = new Date(currentYear, 11, 31);
  const [disable, setDisable] = useState(true);
  const [total, setTotal] = useState(0);
  const isManager = Cookies.get("isManager");
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });
  const filterStatus = [
    {
      id: 1,
      code: null,
      name: "Tất cả",
    },
    {
      id: 2,
      code: "Còn vé",
      name: "Còn vé",
    },
    {
      id: 3,
      code: "Hết vé",
      name: "Hết vé",
    },
  ];

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

  const handleGetData = async (id) => {
    try {
      const tripApi = new TripApi();
      const response = await tripApi.getTripDetail({
        tripId: dataTrip.id,
        page: page + 1,
        pageSize: pageSize,
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
      setData(updatedData);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  console.log(data);
  console.log(total);
  useEffect(() => {
    handleGetData(dataTrip?.id);
  }, [dataTrip, page, pageSize, filterParams]);

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
  const { handleSubmit, reset, watch, setValue } = methods;
  const watchStatus = watch("status");
  const watchTime = watch("time");

  useEffect(() => {
    const params = {
      ...filterParams,
      status: watchStatus?.code,
      minDepartureTime: new Date(selectedDate?.startDate),
      maxDepartureTime: new Date(selectedDate?.endDate),
    };
    setFilterParams(params);
  }, [watchStatus, watchTime, selectedDate?.startDate, selectedDate?.endDate]);

  useEffect(() => {
    const now = new Date();

    if (watchTime?.code === "option") {
      // setSelectedDate({ ...selectedDate, dateFrom: '', dateTo: '' });
    } else {
      const currentYear = new Date().getFullYear();
      const firstDay = new Date(currentYear, 0, 1);
      const lastDay = new Date(currentYear, 11, 31);

      setSelectedDate({
        ...selectedDate,
        startDate: firstDay,
        endDate: lastDay,
      });
    }
  }, [watchTime]);
  useEffect(() => {
    if (watchTime?.code === "option") {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [watchTime]);

  const handelShowDetail = (id) => {
    setShowDrawerEdit(true);
    setIdTripDetail(id);
  };

  useEffect(() => {
    if (!showDrawerEdit) {
      setIdTripDetail("");
    }
  }, [showDrawerEdit]);

  useEffect(() => {
    setValue("status", filterStatus[0]);
  }, [showDrawerDetail]);

  const getDetailDataTripDetail = async (id) => {
    if (!id) return;
    const tripApi = new TripApi();
    const response = await tripApi.getTripDetailById(id);
    setDataTripDetail(response.data.data);
  };
  useEffect(() => {
    getDetailDataTripDetail(idTripDetail);
  }, [idTripDetail]);
  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogRoot }}
        open={showDrawerDetail}
        onClose={() => setShowDrawerDetail(false)}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#fff",
            height: "100vh",
            width: "1200vw",
            maxWidth: 1200,
          },
        }}
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            textAlign: "center",
            fontSize: 23,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <InfoIcon
              style={{
                display: "block",
                fill: "#1a89ac",
                marginRight: 10,
                marginTop: 5,
                borderRadius: "50%",
                padding: 2,
                backgroundColor: "#fff",
              }}
            />
            Danh sách chuyến đi chi tiết của tuyến #
            <span style={{ color: "blue" }}>{dataTrip?.code}</span>
          </div>
          {isManager == "true" && (
            <Button
              variant="contained"
              color="warning"
              className={"btn-create"}
              startIcon={<AddIcon />}
              onClick={() => {
                setShowDrawerCreate(true);
              }}
            >
              Thêm mới
            </Button>
          )}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div className="row" style={{ marginBottom: 20 }}>
              <div className="col-7">
                <FormProvider {...methods}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <FormControlCustom label="Thời gian" fullWidth>
                      <div className="view-input" style={{ marginRight: 10 }}>
                        <SelectCustom
                          options={filterDateTime}
                          placeholder={"Tất cả"}
                          name={"time"}
                        />
                      </div>
                    </FormControlCustom>
                    <FormControlCustom label="Ngày khởi hành" fullWidth>
                      <div className="view-input" style={{ marginRight: 10 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            disabled={disable}
                            value={dayjs(selectedDate?.startDate)}
                            onChange={(e) => {
                              setSelectedDate({
                                ...selectedDate,
                                startDate: new Date(e),
                              });
                            }}
                            className={"date-picker"}
                            renderInput={(params) => <TextField {...params} />}
                            format="DD/MM/YYYY"
                          />
                        </LocalizationProvider>
                      </div>
                    </FormControlCustom>

                    <FormControlCustom label="Ngày đến" fullWidth>
                      <div className="view-input" style={{ marginRight: 10 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            disabled={disable}
                            value={dayjs(selectedDate?.endDate)}
                            onChange={(e) => {
                              setSelectedDate({
                                ...selectedDate,
                                endDate: new Date(e),
                              });
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
                          options={filterStatus}
                        />
                      </div>
                    </FormControlCustom>
                  </div>
                </FormProvider>
              </div>
            </div>

            <Divider />

            <TripDetailList
              data={data || []}
              total={total}
              handleGetData={handleGetData}
              handleChangePage={handleChangePage}
              handleShowDetail={handelShowDetail}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              pageSize={pageSize}
            ></TripDetailList>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setShowDrawerDetail(false)}
            style={{ marginBottom: 1 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <AddTripDetail
        setShowDrawerCreate={setShowDrawerCreate}
        showDrawerCreate={showDrawerCreate}
        handleGetData={handleGetData}
        idTrip={dataTrip.id}
      ></AddTripDetail>
      <EditTripDetail
        setShowDrawerEdit={setShowDrawerEdit}
        showDrawerEdit={showDrawerEdit}
        handleGetData={handleGetData}
        idTrip={dataTrip.id}
        dataTripDetail={dataTripDetail}
      ></EditTripDetail>
    </div>
  );
};

export default TripDetail;
