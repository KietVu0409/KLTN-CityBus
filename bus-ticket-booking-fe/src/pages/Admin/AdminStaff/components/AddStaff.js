import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Drawer, Grid } from "@mui/material";

import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";

import { LoadingButton } from "@mui/lab";
import { useEffect, useMemo, useState } from "react";
import "../../../../assets/scss/default.scss";
import FormControlCustom from "../../../../components/FormControl";
import InputField from "../../../../components/InputField";
import SelectCustom from "../../../../components/SelectCustom";
import customToast from "../../../../components/ToastCustom";
import { DistrictApi } from "../../../../utils/districtApi";
import { ProvinceApi } from "../../../../utils/provinceApi";
import { StaffApi } from "../../../../utils/staffApi";
import { WardApi } from "../../../../utils/wardApi";

const AddStaff = (props) => {
  const { setShowDrawer, showDrawer, handleGetData } = props;
  const [optionsProvince, setOptionsProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState({});
  const [optionsDistrict, setOptionsDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({});
  const [optionsWard, setOptionsWard] = useState([]);




  const getDataProvince = async () => {
    try {
      const provinceApi = new ProvinceApi();
      const res = await provinceApi.getAllProvince();
      const data = res?.data?.data
      const newData = data.filter(item => item.code !== 0);
      const options = [];
      newData.map((item) =>
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
  useEffect(() => {
    getDataProvince();
  }, []);

  

  const optionGender = [
    {
      id: 1,
      code: "M",
      name: "Nam",
    },
    {
      id: 2,
      code: "F",
      name: "Nữ",
    },
    {
      id: 3,
      code: "O",
      name: "Khác",
    },
  ];

  const defaultValues = useMemo(() => ({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    wardCode: "",
    gender: "",
    customerGroupId: "",
  }));

  const schema = yup.object().shape({
    fullName: yup
      .string()
      .typeError("Tên không được phép bỏ trống")
      .required("Tên không được phép bỏ trống"),
    phone: yup
      .string()
      .typeError("Số điện thoại không được phép bỏ trống")
      .matches(/^0\d{9,}$/, "Số điện thoại không đúng định dạng")
      .required("Số điện thoại không được phép bỏ trống"),
      email: yup
      .string()
      .typeError("Email không được phép bỏ trống")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không đúng định dạng")
      .required("Email không được phép bỏ trống"),
      
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
      .required("Quận/huyện không được bỏ trống"),
  });

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

  const goBack = () => {
    reset();
    setShowDrawer(false);
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  useEffect(() => {
    reset();
  }, [showDrawer]);

  const onSubmit = async (value) => {

    const params = {
      fullName: value.fullName,
      phone: value.phone,
      email: value?.email,
      gender: value?.gender.code,
      address: value.address,
      wardCode: value.wardCode.code,
      note: value?.note,
    };
    try {
      const staffApi = new StaffApi();
      const res = await staffApi.create(params);
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
              <span>Thêm nhân viên</span>
            </div>
          </div>
          <div className="content-drawer">
            <div className="title-group">
              <span>Thông tin nhân viên</span>
            </div>
            <div className="content">
              <Grid container spacing={1.5}>
                <Grid item xs={6} className="auto-complete">
                  <FormControlCustom
                    label={"Tên nhân viên"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      name={"fullName"}
                      placeholder={"Nhập tên nhân viên"}
                      error={Boolean(errors.fullName)}
                      helperText={errors?.fullName?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Số điện thoại"} fullWidth isMarked>
                    <InputField
                      name={"phone"}
                      placeholder={"Nhập số điện thoại"}
                      helperText={errors?.phone?.message}
                      error={Boolean(errors.phone)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Email"} fullWidth>
                    <InputField
                      name={"email"}
                      placeholder={"Nhập email"}
                      helperText={errors?.email?.message}
                      error={Boolean(errors.email)}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Giới tính"} fullWidth>
                    <SelectCustom
                      name={"gender"}
                      placeholder={"Chọn giới tính"}
                      error={Boolean(errors?.gender)}
                      helperText={errors?.gender?.message}
                      options={optionGender}
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
                  <FormControlCustom
                    label={"Số nhà, tên đường"}
                    fullWidth
                    isMarked
                  >
                    <InputField
                      name={"address"}
                      placeholder={"Nhập số nhà, tên đường"}
                      error={Boolean(errors.address)}
                      helperText={errors?.address?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom label={"Ghi chú"} fullWidth>
                    <InputField
                      name={"note"}
                      className="input-note"
                      placeholder={""}
                      error={Boolean(errors.note)}
                      helperText={errors?.note?.message}
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

export default AddStaff;
