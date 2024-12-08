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

import { useEffect, useState } from "react";
import InputField from "../../../../components/InputField";
import FormControlCustom from "../../../../components/FormControl";
import "../../../../assets/scss/default.scss";
import { LoadingButton } from "@mui/lab";
import customToast from "../../../../components/ToastCustom";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import "./EditPriceList.scss";
import SelectCustom from "../../../../components/SelectCustom";
import { PriceListApi } from "../../../../utils/priceListApi";

const AddPriceList = (props) => {
  const { setShowDrawer, showDrawer, handleGetData } = props;
  const currentYear = new Date().getFullYear();
  
  const currentMonth = new Date().getMonth();
  const firstDay = new Date();
  const lastDay = new Date(currentYear, currentMonth, 31);
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });
  const optionStatus = ["Kích hoạt", "Tạm ngưng"];

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

  const defaultValues = {
    code: "",
    name: "",
    note: "",
    status: "",
  };

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;

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
      code: value.code,
      name: value.name,
      status: value.status,
      note: value?.note,
      startDate: new Date(selectedDate?.startDate),
      endDate: new Date(selectedDate?.endDate),
    };
    try {
      const priceListApi = new PriceListApi();
      const res = await priceListApi.create(params);
      customToast.success("Thêm mới thành công");
      handleGetData();
      setShowDrawer(false);
      reset();
    } catch (error) {
      customToast.error(error.response.data.message);
    }
    handleGetData();
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
              <span>Tạo mới bảng giá</span>
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
                        value={dayjs(selectedDate?.startDate)}
                        onChange={(e) => {
                          setSelectedDate({
                            ...selectedDate,
                            startDate: new Date(e),
                          });
                        }}
                        className={"date-picker"}
                        format="DD/MM/YYYY"
                        renderInput={(params) => (
                          <InputField
                            name={"startDate"}
                            placeholder={"Nhập tên bảng giá"}
                            helperText={errors?.name?.message}
                            error={Boolean(errors.name)}
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
                  {"Thêm mới "}
                </LoadingButton>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default AddPriceList;
