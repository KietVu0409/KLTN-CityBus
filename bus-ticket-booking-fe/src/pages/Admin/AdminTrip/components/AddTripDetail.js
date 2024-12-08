import { yupResolver } from "@hookform/resolvers/yup";
import InfoIcon from "@mui/icons-material/Info";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import "../../../../assets/scss/default.scss";
import AutocompleteCustom from "../../../../components/AutocompleteCustom";
import FormControlCustom from "../../../../components/FormControl";
import InputField from "../../../../components/InputField";
import customToast from "../../../../components/ToastCustom";
import { VehicleApi } from "../../../../utils/vehicleApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import SelectCustom from "../../../../components/SelectCustom";
import { TripApi } from "../../../../utils/tripApi";
import moment from "moment";


const AddTripDetail = (props) => {
  const { setShowDrawerCreate, showDrawerCreate, idTrip, handleGetData } =
    props;
  const [images, setImages] = useState();
  const [urlImage, setUrlImage] = useState();
  const [optionVehicle, setOptionVehicle] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const firstDay = new Date();
  const lastDay = new Date(currentYear, currentMonth, 31);
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });

  const handelGetOptionVehicle = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.getList();
      setOptionVehicle(response?.data?.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handelGetOptionVehicle();
  }, []);
  const schema = yup.object().shape({
    code: yup
      .string()
      .matches(/^\S*$/, "Mã không chưa khoảng trắng")
      .matches(/^[A-Za-z0-9]*$/, "Không chứa kí tự đặc biệt")
      .required("Mã không được phép bỏ trống"),

    codeVehicle: yup
      .object()
      .typeError("Vui lòng chọn xe")
      .required("Vui lòng chọn xe"),
  });

  const defaultValues = {
    code: "",
    codeVehicle: "",
  };

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  const watchCodeVehicle = watch("codeVehicle");
  const watchType = watch("vehicleType");
  const watchLicensePlate = watch("licensePlate");

  useEffect(() => {
    const codeVehicle = watchCodeVehicle;
    if (codeVehicle == null) {
      setValue("vehicleType", "");
      setValue("licensePlate", "");
    } else {
      setValue("vehicleType", codeVehicle?.type);
      setValue("licensePlate", codeVehicle?.licensePlate);
    }
  }, [watchCodeVehicle]);

  useEffect(() => {
    reset();
    setSelectedDate({
      ...selectedDate,
      startDate: firstDay,
      endDate: lastDay,
    });
  }, [showDrawerCreate]);

  const onSubmit = async (value) => {
    const params = {
      code: value.code,
      vehicleId: value.codeVehicle.id,
      tripId: idTrip,
      departureTime: new Date(selectedDate?.startDate) ,
    };
    console.log(params);
    try {
      const tripApi = new TripApi();
      const res = await tripApi.createTripDetail(params);
      customToast.success("Thêm mới thành công");
      handleGetData();
      setShowDrawerCreate(false);
      reset();
    } catch (error) {
      customToast.error(error?.response?.data?.message);
    }
    handleGetData();
  };
  const buildOptionSelect = (option, props) => {
    return (
      <div style={{ width: "250px" }} {...props}>
        <Grid container style={{ alignItems: "center" }}>
          <Grid item style={{ marginLeft: "5px" }}>
            <div className={"class-display"}>
              <span style={{ fontSize: "13px", color: "#0C59CC" }}>
                {" "}
                {option?.code}
              </span>
              <span style={{ fontSize: "13px" }}>- {option?.name}</span>
            </div>
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  };
  return (
    <div>
      <Dialog
        open={showDrawerCreate}
        onClose={() => setShowDrawerCreate(false)}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#fff",
            height: "100vh",
            width: "100vw",
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
          }}
        >
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
          Thêm chuyến đi chi tiết
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="content">
                  <Grid container spacing={1.5}>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom label={"Mã tuyến"} fullWidth isMarked>
                        <InputField
                          name={"code"}
                          placeholder={"Nhập mã tuyến"}
                          error={Boolean(errors.code)}
                          helperText={errors?.code?.message}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom label={"Chọn xe"} fullWidth isMarked>
                        <AutocompleteCustom
                          name={"codeVehicle"}
                          placeholder={"Chọn xe"}
                          error={Boolean(errors?.codeVehicle)}
                          helperText={errors?.codeVehicle?.message}
                          options={optionVehicle || []}
                          optionLabelKey={"name"}
                          renderOption={buildOptionSelect}
                        />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom label={"Loại xe"} fullWidth>
                        <InputField disabled name={"vehicleType"} />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom label={"Biển số"} fullWidth>
                        <InputField disabled name={"licensePlate"} />
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom
                        label={"Ngày khởi hành"}
                        fullWidth
                        isMarked
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
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
                      </FormControlCustom>
                    </Grid>
                    <Grid item xs={6} className="auto-complete">
                      <FormControlCustom
                        label={"Thời gian khởi hành"}
                        fullWidth
                        isMarked
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            value={dayjs(selectedDate?.startDate)}
                            onChange={(e) => {
                              setSelectedDate({
                                ...selectedDate,
                                startDate: new Date(e),
                              });
                            }}
                            inputVariant="outlined"
                            format="h:mm a"
                            className={"date-picker"}
                          />
                        </LocalizationProvider>
                      </FormControlCustom>
                    </Grid>
                    
                  </Grid>
                </div>

                <div className="footer-drawer" style={{ marginTop: 50 }}>
                  <Grid
                    container
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={6} display="flex" justifyContent="end">
                      <Button
                        className="btn-secondary-disable"
                        //   onClick={goBack}
                        onClick={() => setShowDrawerCreate(false)}
                        variant="outlined"
                        style={{ width: "80%" }}
                      >
                        Quay lại
                      </Button>
                    </Grid>
                    <Grid item xs={6} display="flex" justifyContent="end">
                      <LoadingButton
                        //   className={
                        //     !isEmpty(errors)
                        //       ? "btn-primary-disable"
                        //       : "btn-tertiary-normal"
                        //   }
                        // onClick={onSubmit}
                        type="submit"
                        color="primary"
                        variant="contained"
                        style={{ width: "80%", marginRight: 50 }}
                      >
                        {"Thêm mới "}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </div>
              </form>
            </FormProvider>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTripDetail;
