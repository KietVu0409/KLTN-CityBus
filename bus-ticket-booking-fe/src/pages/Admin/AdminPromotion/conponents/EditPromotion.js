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
import { PromotionApi } from "../../../../utils/promotionApi";
import { UploadApi } from "../../../../utils/uploadApi";
import UploadSingle from "../../../../components/UploadImage/uploadSingle";

const EditPromotion = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    handleGetData,
    dataPromotion,
    getDetailPromotion,
  } = props;
  const now = new Date();
  const currentYear = new Date().getFullYear();
  const firstDay = new Date(dataPromotion?.startDate);
  const lastDay = new Date(dataPromotion?.endDate);
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorMessageStartDate, setErrorMessageStartDate] = useState("");
  const [errorEndDate, setErrorEndDate] = useState(false);
  const [errorMessageEndDate, setErrorMessageEndDate] = useState("");
  const [images, setImages] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [urlImage, setUrlImage] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: firstDay,
    endDate: lastDay,
  });
  const [optionStatus, setOptionStatus] = useState([]);

  const handelOptionStatus = async () => {
    try {
      const promotionApi = new PromotionApi();
      const response = await promotionApi.getStatus();

      setOptionStatus(response?.data.data);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    handelOptionStatus();
  }, []);
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
      code: dataPromotion?.code,
      name: dataPromotion?.name,
      description: dataPromotion?.description,
      status: dataPromotion?.status,
      image: dataPromotion?.image || "",
    }),
    [dataPromotion]
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

    setImages([dataPromotion?.image] || []);
    setUrlImage(dataPromotion?.image || []);
    setSelectedDate({
      startDate: new Date(dataPromotion?.startDate),
      endDate: new Date(dataPromotion?.endDate),
    });
  }, [dataPromotion]);

  const onChange = (imageList) => {
    // data for submit
    funcUpload(imageList);
    setImages(imageList);
  };

  const getUrlFromIMG = async (fromData) => {
    setLoadingUpload(true);
    let data = new FormData();
    data.append("images", fromData[0].file, fromData[0].file.name);
    const uploadApi = new UploadApi();
    const response = await uploadApi.uploadMutiFile(data);

    setUrlImage(response?.data?.data?.images[0]?.url);
    setLoadingUpload(false);
  };

  const funcUpload = async (image) => {
    function readFileAsync() {
      return new Promise((resolve, reject) => {
        const file = image;
        getUrlFromIMG(file).then((response) => {
          if (!response) {
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: response?.data?.id,
              url: response?.data?.url,
              name: response?.data?.name,
              type: "image",
            });
          };
          reader.onerror = reject;
          // reader.readAsBinaryString(file);
        });
      });
    }
    await readFileAsync();
  };

  const onRemove = () => {
    setUrlImage("");
  };

  const goBack = () => {
    setImages([]);
    setUrlImage([]);
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
      description: value?.description,
      startDate:
        firstDay <= now
          ? undefined
          : new Date(selectedDate?.startDate),
      endDate: new Date(selectedDate?.endDate),
      image: urlImage,
    };
    console.log(params);
    try {
      const promotionApi = new PromotionApi();
      const res = await promotionApi.updateById(dataPromotion?.id, params);
      customToast.success("Cập nhật thành công");
      getDetailPromotion();
      setShowDrawer(false);
      reset();
    } catch (error) {
      customToast.error(error.response.data.error);
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
              <span>Thông tin khuyến mãi</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom label={"Mã khuyến mãi"} fullWidth isMarked>
                    <InputField
                      name={"code"}
                      placeholder={"Nhập mã khuyến mãi"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                      disabled
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom
                    label={"Tên khuyến mãi"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      name={"name"}
                      placeholder={"Nhập tên khuyến mãi"}
                      helperText={errors?.name?.message}
                      error={Boolean(errors.name)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label="Ngày bắt đầu" fullWidth isMarked>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={firstDay <= now ? true : false}
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
                  <FormControlCustom label={"Mô tả"} fullWidth isMarked>
                    <InputField
                      className="input-note"
                      name={"description"}
                      helperText={""}
                      placeholder={"Nhập mô tả"}
                      rows={3}
                      multiline
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
            <div style={{ marginLeft: 20, marginTop: 10 }}>
              <span>Hình ảnh</span>
            </div>
            <div className="view-image">
              <div className="image-product">
                <UploadSingle
                  onChange={onChange}
                  images={!isEmpty(urlImage) ? images : ""}
                  onRemove={onRemove}
                />
              </div>
              {errors.image && (
                <span style={{ fontSize: "0.875rem", color: "red" }}>
                  {errors?.image?.message}
                </span>
              )}
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

export default EditPromotion;
