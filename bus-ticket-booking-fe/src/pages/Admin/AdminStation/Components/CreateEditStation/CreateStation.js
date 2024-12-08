import React, { useMemo } from "react";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import FormControlCustom from "../../../../../components/FormControl";
import InputField from "../../../../../components/InputField";
import SelectCustom from "../../../../../components/SelectCustom";
import { ProvinceApi } from "../../../../../utils/provinceApi";
import "./index.scss";
import { DistrictApi } from "../../../../../utils/districtApi";
import { WardApi } from "../../../../../utils/wardApi";
import UploadImage from "../../../../../components/UploadImage";
import { isEmpty } from "lodash";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import customToast from "../../../../../components/ToastCustom";
import { UploadApi } from "../../../../../utils/uploadApi";
import { StationApi } from "../../../../../utils/stationApi";
const CreateStation = ({ setShowDrawer, showDrawer, handleGetData }) => {
  const [images, setImages] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [urlImage, setUrlImage] = useState([]);
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [optionsWard, setOptionsWard] = useState([]);

  const getDataProvince = async () => {
    try {
      const provinceApi = new ProvinceApi();
      const res = await provinceApi.getAllProvince();

      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );

      setOptionsProvince(options);
    } catch (error) {}
  };

  const getDataDistrict = async (provinceCode) => {
    try {
      const districtApi = new DistrictApi();
      const res = await districtApi.getDistrictByProvinceId(provinceCode);
      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );
      setOptionsDistrict(options);
    } catch (error) {}
  };

  const getDataWard = async (districtCode) => {
    try {
      const wardApi = new WardApi();
      const res = await wardApi.getWardByDistrictId(districtCode);
      const options = [];
      res.data.data.map((item) =>
        options.push({ name: item.name, code: item.code })
      );
      setOptionsWard(options);
    } catch (error) {}
  };

  const defaultValues = useMemo(() => ({
    code: "",
    name: "",
    address: "",
    wardCode: null,
    provinceId: null,
    districtId: null,
  }));

  const schema = yup.object().shape({
    code: yup.string().required("Mã bến xe không được phép bỏ trống"),
    name: yup.string().required("Tên bến xe không được phép bỏ trống"),
    address: yup.string().required("Địa chỉ không được phép bỏ trống"),

    wardCode: yup
      .object()
      .typeError("Phường/thị xã không được bỏ trống")
      .required("Phường/thị xã không được bỏ trống"),
    provinceId: yup
      .object()
      .typeError("Tỉnh/thành phố không được bỏ trống")
      .required("Tỉnh/thành phố không được bỏ trống"),
    districtId: yup
      .object()
      .typeError("Quận/huyện không được bỏ trống")
      .required("Quận/huyện không được phép bỏ trống"),
  });

  useEffect(() => {
    reset({ ...defaultValues });
    setImages([]);
    setUrlImage([]);
  }, [showDrawer]);

  useEffect(() => {
    getDataProvince();
  }, []);

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  const provinceWatch = watch("provinceId");
  const districtWatch = watch("districtId");

  useEffect(() => {
    const province = provinceWatch;
    if (!province) setOptionsDistrict([]);
    else {
      getDataDistrict(province.code);
    }
  }, [provinceWatch]);

  useEffect(() => {
    const district = districtWatch;
    if (!district) setOptionsWard([]);
    else {
      getDataWard(district.code);
    }
  }, [districtWatch]);

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };

  const getUrlFromIMG = async (fromData) => {
    setLoadingUpload(true);
    let data = new FormData();
    data.append("images", fromData.file, fromData.file.name);
    const uploadApi = new UploadApi();
    const response = await uploadApi.uploadMutiFile(data);
    setLoadingUpload(false);

    return response?.data?.data?.images[0]?.url;
  };

  const onChange = async (imageList, addUpdateIndex) => {
    if (addUpdateIndex) {
      imageList[addUpdateIndex] = await getUrlFromIMG(
        imageList[addUpdateIndex]
      );
    }
    setImages(imageList);
  };

  const onSubmit = async (value = defaultValues) => {
    const imageParams = [];
    images.map((item) => {
      imageParams.push({ url: item });
    });

    const params = {
      code: value.code,
      name: value.name,
      address: value.address,
      wardCode: value.wardCode.code,
      images: imageParams,
    };
    try {
      const stationApi = new StationApi();
      const res = await stationApi.createStation(params);
      customToast.success("Thêm mới thành công");
      handleGetData();
      setShowDrawer(false);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
    handleGetData();
  };

  const goBack = () => {
    reset();
    setShowDrawer(false);
    setImages([]);
    setUrlImage([]);
  };
  useEffect(() => {
    handleGetData();
    reset();
  }, [showDrawer]);

  return (
    <Drawer
      PaperProps={{
        sx: { width: "45%" },
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
              <span style={{ fontSize: 30, fontWeight: "bolder" }}>
                Tạo mới
              </span>
            </div>
          </div>
          <div className="content-drawer" style={{ marginTop: 30 }}>
            <div
              className="title-group"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <span
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Tạo mới bến xe
              </span>
            </div>
            <div className="content" style={{ marginLeft: 40 }}>
              <Grid container spacing={2} style={{ marginTop: 10 }}>
                <Grid item xs={6}>
                  <FormControlCustom label={"Mã bến xe"} fullWidth isMarked>
                    <InputField
                      name={"code"}
                      placeholder={"Nhập mã bến xe"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Tên bến xe"} fullWidth isMarked>
                    <InputField
                      name={"name"}
                      placeholder={"Nhập tên bến xe"}
                      error={Boolean(errors.name)}
                      helperText={errors?.name?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4}>
                  <FormControlCustom label={"Chọn địa chỉ"} fullWidth isMarked>
                    <SelectCustom
                      name={"provinceId"}
                      placeholder={"Chọn tỉnh/thành phố"}
                      error={Boolean(errors?.provinceId)}
                      helperText={errors?.provinceId?.message}
                      options={optionsProvince}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 23 }}>
                  <FormControlCustom label={""} fullWidth>
                    <SelectCustom
                      name={"districtId"}
                      placeholder={"Chọn quận/huyện"}
                      error={Boolean(errors?.districtId)}
                      helperText={errors?.districtId?.message}
                      options={optionsDistrict}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={4} style={{ marginTop: 23 }}>
                  <FormControlCustom label={""} fullWidth>
                    <SelectCustom
                      name={"wardCode"}
                      placeholder={"Chọn phường/thị xã"}
                      error={Boolean(errors?.wardCode)}
                      helperText={errors?.wardCode?.message}
                      options={optionsWard}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom label={"Địa chỉ"} fullWidth isMarked>
                    <InputField
                      name={"address"}
                      placeholder={"Nhập địa chỉ"}
                      error={Boolean(errors.address)}
                      helperText={errors?.address?.message}
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
            <div style={{ marginLeft: 40, marginTop: 10 }}>
              <span>Hình ảnh bến xe</span>
            </div>
            <div className="view-image">
              <div className="image-product">
                <UploadImage
                  onChange={onChange}
                  images={images}
                  isLoading={loadingUpload}
                />
              </div>
            </div>

            <div className="content"></div>
          </div>

          <div className="footer-drawer">
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
              style={{ marginTop: 20 }}
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
                  {"Lưu thông tin"}
                </LoadingButton>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default CreateStation;
