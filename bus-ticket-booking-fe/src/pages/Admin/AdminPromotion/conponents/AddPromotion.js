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
import "./index.scss";
import SelectCustom from "../../../../components/SelectCustom";
import { PriceListApi } from "../../../../utils/priceListApi";
import UploadSingle from "../../../../components/UploadImage/uploadSingle";
import { PromotionApi } from "../../../../utils/promotionApi";
import { UploadApi } from "../../../../utils/uploadApi";

const AddPromotion = (props) => {
  const { setShowDrawer, showDrawer, handleGetData } = props;
  const currentYear = new Date().getFullYear();
  
  const currentMonth = new Date().getMonth();
  const firstDay = new Date();
  const lastDay = new Date(currentYear, currentMonth, 31);
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

  const schema = yup.object().shape({
    code: yup
      .string()
      .matches(/^\S*$/, "Mã không chưa khoảng trắng")
      .matches(/^[A-Za-z0-9]*$/, "Không chứa kí tự đặc biệt")
      .required("Mã không được phép bỏ trống"),
    name: yup
      .string()
      .typeError("Tên khuyến mãi không được phép bỏ trống")
      .required("Tên khuyến mãi không được phép bỏ trống"),
    status: yup
      .string()
      .typeError("Trạng thái không được phép bỏ trống")
      .required("Trạng thái không được phép bỏ trống"),
      description:yup
      .string()
      .typeError("Mô tả không được phép bỏ trống")
      .required("Mô tả không được phép bỏ trống"),
  });

  const defaultValues = {
    code: "",
    name: "",
    description: "",
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
    setImages([]);
    setUrlImage([]);
    handleGetData();
  }, [showDrawer]);

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

  const onSubmit = async (value) => {
    console.log(value);
    const params = {
      code: value.code,
      name: value.name,
      status: value.status,
      description: value?.description,
      startDate: new Date(selectedDate?.startDate),
      endDate: new Date(selectedDate?.endDate),
      image: urlImage,
    };
    try {
      const promotionApi = new PromotionApi();
      const res = await promotionApi.create(params);
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
              <span>Tạo mới khuyến mãi</span>
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
            <div style={{ marginLeft: 40, marginTop: 10 }}>
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

export default AddPromotion;
