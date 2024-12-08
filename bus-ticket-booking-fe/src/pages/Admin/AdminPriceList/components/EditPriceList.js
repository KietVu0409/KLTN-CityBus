import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid, TextField } from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as yup from "yup";

import { useEffect, useMemo, useState } from "react";
import InputField from "../../../../components/InputField";
import FormControlCustom from "../../../../components/FormControl";
import "../../../../assets/scss/default.scss";
import { LoadingButton } from "@mui/lab";
import customToast from "../../../../components/ToastCustom";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import SelectCustom from "../../../../components/SelectCustom";
import { PriceListApi } from "../../../../utils/priceListApi";

const EditPriceList = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    handleGetData,
    dataPriceList,
    getDetailPriceList,
  } = props;
  const now = new Date();
  const currentYear = new Date().getFullYear();
  const firstDay = new Date(dataPriceList?.startDate);
  const lastDay = new Date(dataPriceList?.endDate);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorMessageStartDate, setErrorMessageStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorMessageEndDate, setErrorMessageEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });
  const optionStatus = ["Kích hoạt", "Tạm ngưng"];

  const handleDateChangeStartDate = (e) => {
    const newDate = new Date(e);
    if (!newDate || isNaN(newDate.getTime())) {
      setErrorStartDate(true);
      setErrorMessageStartDate("Vui lòng chọn một ngày hợp lệ.");
      customToast.error("Vui lòng chọn một ngày hợp lệ.");
    } else {
      setSelectedDate({
        ...selectedDate,
        startDate: newDate,
      });
      setErrorStartDate(false);
      setErrorMessageStartDate("");
    }
  };

  const handleDateChangeEndDate = (e) => {
    const newDate = new Date(e);
    if (!newDate || isNaN(newDate.getTime())) {
      setErrorEndDate(true);
      setErrorMessageEndDate("Vui lòng chọn một ngày hợp lệ.");
      customToast.error("Vui lòng chọn một ngày hợp lệ.");
    } else {
      setSelectedDate({
        ...selectedDate,
        endDate: newDate,
      });
      setErrorEndDate(false);
      setErrorMessageEndDate("");
    }
  };

  const schema = yup.object().shape({
    code: yup
      .string()
      .typeError("Mã bảng giá không được phép bỏ trống")
      .required("Mã bảng giá hàng không được phép bỏ trống"),
    name: yup
      .string()
      .typeError("Tên bảng giá không được phép bỏ trống")
      .required("Tên bảng giá không được phép bỏ trống"),
    status: yup
      .string()
      .typeError("Trạng thái không được phép bỏ trống")
      .required("Trạng thái hàng không được phép bỏ trống"),
  });

  const defaultValues = useMemo(
    () => ({
      code: dataPriceList?.code,
      name: dataPriceList?.name,
      note: dataPriceList?.note,
      status: dataPriceList?.status,
    }),
    [dataPriceList]
  );
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;

  useEffect(() => {
    reset({ ...defaultValues });
    setSelectedDate({
      startDate: new Date(dataPriceList?.startDate),
      endDate: new Date(dataPriceList?.endDate),
    });
  }, [dataPriceList]);

  const goBack = () => {
    setSelectedDate({
      ...selectedDate,
      startDate: firstDay,
      endDate: lastDay,
    });
    reset();
    setShowDrawer(false);
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  useEffect(() => {
    reset();
    setSelectedDate({
      ...selectedDate,
      startDate: firstDay,
      endDate: lastDay,
    });
  }, [showDrawer]);

  const onSubmit = async (value) => {
    const params = {
      name: value?.name,
      status: value?.status,
      note: value?.note,
      startDate:
        firstDay <= now && dataPriceList?.status == "Kích hoạt"
          ? undefined
          : new Date(selectedDate?.startDate),
      endDate: new Date(selectedDate?.endDate),
    };
    try {
      const priceListApi = new PriceListApi();
      const res = await priceListApi.updateByCode(dataPriceList?.code, params);
      customToast.success("Cập nhật thành công");
      getDetailPriceList();
      setShowDrawer(false);
      reset();
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };

  return (
    <Drawer
      PaperProps={{
        sx: { width: "45%", minWidth: "39rem" },
      }}
      anchor={"right"}
      open={showDrawer}
      className="drawer"
      onClose={toggleDrawer(false)}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="title-drawer">
            <div className="btn-close" onClick={goBack}>
              <ArrowBackIosIcon className="icon-back" />
            </div>
            <div>
              <span>Cập nhật thông tin</span>
            </div>
          </div>
          <div className="content-drawer">
            <div className="title-group">
              <span>Thông tin bảng giá</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Mã bảng giá"} fullWidth isMarked>
                    <InputField
                      name={"code"}
                      placeholder={"Nhập mã bảng giá"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                      disabled
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Tên bảng giá"} fullWidth isMarked>
                    <InputField
                      name={"name"}
                      placeholder={"Nhập tên bảng giá"}
                      helperText={errors?.name?.message}
                      error={Boolean(errors.name)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label="Ngày bắt đầu" fullWidth isMarked>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={
                          firstDay <= now &&
                          dataPriceList?.status == "Kích hoạt"
                            ? true
                            : false
                        }
                        value={dayjs(selectedDate?.startDate)}
                        onChange={handleDateChangeStartDate}
                        className={"date-picker"}
                        format="DD/MM/YYYY"
                        renderInput={(params) => (
                          <InputField
                            {...params}
                            name={"startDate"}
                            placeholder={"Nhập ngày bắt đầu"}
                            error={errorStartDate}
                            helperText={errorMessageStartDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label="Ngày kết thúc" fullWidth isMarked>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(selectedDate?.endDate)}
                        onChange={handleDateChangeEndDate}
                        className={"date-picker"}
                        format="DD/MM/YYYY"
                        renderInput={(params) => (
                          <InputField
                            {...params}
                            name={"endDate"}
                            placeholder={"Nhập ngày kết thúc"}
                            error={errorEndDate}
                            helperText={errorMessageEndDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom label={"Trạng thái"} fullWidth isMarked>
                    <SelectCustom
                      name={"status"}
                      placeholder={"Chọn trạng thái"}
                      error={Boolean(errors?.status)}
                      helperText={errors?.status?.message}
                      options={optionStatus || []}
                    />
                  </FormControlCustom>
                </Grid>

                <Grid item xs={12}>
                  <FormControlCustom label={"Ghi chú"} fullWidth>
                    <InputField
                      className="input-note"
                      name={"note"}
                      helperText={""}
                      placeholder={"Nhập ghi chú"}
                      rows={3}
                      multiline
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
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
                  onClick={goBack}
                  variant="outlined"
                  style={{ width: "80%" }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item xs={6} display="flex" justifyContent="end">
                <LoadingButton
                  className={
                    !isEmpty(errors)
                      ? "btn-primary-disable"
                      : "btn-tertiary-normal"
                  }
                  // onClick={onSubmit}
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{ width: "80%", marginRight: 50 }}
                >
                  {"Cập nhật"}
                </LoadingButton>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default EditPriceList;
