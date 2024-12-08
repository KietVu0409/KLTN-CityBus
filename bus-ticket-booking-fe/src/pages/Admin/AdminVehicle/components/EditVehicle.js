import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Divider, Drawer, Grid } from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import * as yup from "yup";

import { useEffect, useMemo, useState } from "react";
import InputField from "../../../../components/InputField";
import FormControlCustom from "../../../../components/FormControl";
import "../../../../assets/scss/default.scss";
import { LoadingButton } from "@mui/lab";
import customToast from "../../../../components/ToastCustom";
import { GroupCusApi } from "../../../../utils/groupCusApi";
import SelectCustom from "../../../../components/SelectCustom";
import UploadSingle from "../../../../components/UploadImage/uploadSingle";
import { VehicleApi } from "../../../../utils/vehicleApi";
import { UploadApi } from "../../../../utils/uploadApi";

const EditVehicle = (props) => {
  const {
    setShowDrawer,
    showDrawer,
    dataVehicle,
    setShowDrawerDetail,
    handleGetData,
  } = props;

  const [type, setType] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [images, setImages] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [urlImage, setUrlImage] = useState([]);
  const floorNumberFilter = [
    {
      code: 1,
      name: "Một tầng",
    },
    {
      code: 2,
      name: "Hai tầng",
    },
  ];
  const handelGetType = async () => {
    try {
      const vehicleApi = new VehicleApi();
      const response = await vehicleApi.getType();
      const typeTmp = [];
      response?.data?.data.map((item) => {
        typeTmp.push({
          code: item.key,
          name: item.value,
        });
      });
      setType(typeTmp);
    } catch (error) {
      customToast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    handelGetType();
  }, []);

  const schema = yup.object().shape({
    code: yup
      .string()
      .matches(/^\S*$/, "Mã không chưa khoảng trắng")
      .matches(/^[A-Za-z0-9]*$/, "Không chứa kí tự đặc biệt")
      .required("Mã không được phép bỏ trống"),
    name: yup.string().required("Tên xe không được phép bỏ trống"),
    type: yup
      .object()
      .typeError("Loại xe không được phép bỏ trống")
      .required("Loại xe không được phép bỏ trống"),
      floorNumber: yup
      .number()
      .typeError("Vui lòng điền đúng định dạng")
      .required("Vui lòng nhập số tầng"),
    totalSeat: yup
      .number()
      .typeError("Vui lòng điền đúng định dạng")
      .required("Vui lòng nhập số ghế"),
    licensePlate: yup.string().required("Biển số xe không được phép bỏ trống"),
  });

  const defaultValues = useMemo(
    () => ({
      code: dataVehicle?.code,
      name: dataVehicle?.name,
      note: dataVehicle?.note,
      description: dataVehicle?.description,
      type: {
        code:
          dataVehicle?.type == "xe limousine"
            ? "LIMOUSINE"
            : dataVehicle?.type == "xe giường nằm"
            ? "SLEEPER_BUS"
            : dataVehicle?.type == "xe ghế ngồi"
            ? "SEAT_BUS"
            : "OTHER",
        name: dataVehicle?.type,
      },
      floorNumber: dataVehicle?.floorNumber,
      totalSeat: dataVehicle?.totalSeat,
      licensePlate: dataVehicle?.licensePlate,
      image: dataVehicle?.images?.[0]?.url || "",
    }),
    [dataVehicle]
  );
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState, setValue, watch } = methods;
  const { errors } = formState;
  const watchType = watch("type");

  useEffect(() => {
    if (watchType?.code === "OTHER") {
      setValue("totalSeat", defaultValues.totalSeat);
      setDisabled(false);
    } else if (watchType?.code === "LIMOUSINE") {
      setValue("floorNumber", 2);
      setValue("totalSeat", 34);
      setDisabled(true);
    } else if (watchType?.code === "SLEEPER_BUS") {
      setValue("floorNumber", 2);
      setValue("totalSeat", 44);
      setDisabled(true);
    } else if (watchType?.code === "SEAT_BUS") {
      setValue("floorNumber", 1);
      setValue("totalSeat", 28);
      setDisabled(true);
    }
  }, [watchType]);

  useEffect(() => {
    reset({ ...defaultValues });
    setImages([dataVehicle?.images?.[0]?.url] || []);
    setUrlImage(dataVehicle?.images?.[0]?.url || []);
  }, [dataVehicle]);

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
    reset();
    setShowDrawer(false);
    setImages([]);
    setUrlImage([]);
  };

  const toggleDrawer = (open) => (event) => {
    setShowDrawer(open);
  };
  useEffect(() => {
    reset();
  }, [showDrawer]);

  const onSubmit = async (value) => {
    const params = {
        code: value.code,
        name: value.name,
        description: value?.description,
        type: value.type?.name,
        licensePlate: value.licensePlate,
        floorNumber: value.floorNumber,
        totalSeat: value.totalSeat,
        images: [
          {
            url: urlImage,
          },
        ],
      };
    
    try {
      const vehicleApi = new VehicleApi();
      const res = await vehicleApi.updateVehicle(dataVehicle.id, params);
      customToast.success("Cập nhật thành công");
      setShowDrawer(false);
      setShowDrawerDetail(false);
      handleGetData();
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
              <span>Thông tin xe</span>
            </div>
            <div className="content" style={{ marginLeft: 40 }}>
              <Grid container spacing={2} style={{ marginTop: 10 }}>
                <Grid item xs={6}>
                  <FormControlCustom label={"Mã xe"} fullWidth isMarked>
                    <InputField
                      name={"code"}
                      placeholder={"Nhập mã xe"}
                      error={Boolean(errors.code)}
                      helperText={errors?.code?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Tên xe"} fullWidth isMarked>
                    <InputField
                      name={"name"}
                      placeholder={"Nhập tên xe"}
                      error={Boolean(errors.name)}
                      helperText={errors?.name?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Loại xe"} fullWidth isMarked>
                    <SelectCustom
                      name={"type"}
                      placeholder={"Chọn loại xe"}
                      error={Boolean(errors?.type)}
                      helperText={errors?.type?.message}
                      options={type}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Số tầng"} fullWidth isMarked>
                  <InputField
                      disabled
                      name={"floorNumber"}
                      placeholder={"Nhập số tầng"}
                      error={Boolean(errors.floorNumber)}
                      helperText={errors?.floorNumber?.message}
                    />
                    
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Số ghế"} fullWidth isMarked>
                    <InputField
                      disabled
                      name={"totalSeat"}
                      placeholder={"Nhập số ghế"}
                      error={Boolean(errors.totalSeat)}
                      helperText={errors?.totalSeat?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={6}>
                  <FormControlCustom label={"Biển số"} fullWidth isMarked>
                    <InputField
                      name={"licensePlate"}
                      placeholder={"Nhập biển số xe"}
                      error={Boolean(errors.licensePlate)}
                      helperText={errors?.licensePlate?.message}
                    />
                  </FormControlCustom>
                </Grid>
                <Grid item xs={12}>
                  <FormControlCustom label={"Mô tả"} fullWidth>
                    <InputField
                      name={"description"}
                      className="input-note"
                      placeholder={""}
                      error={Boolean(errors.description)}
                      helperText={errors?.description?.message}
                      rows={3}
                      multiline
                    />
                  </FormControlCustom>
                </Grid>
              </Grid>
            </div>
            <div style={{ marginLeft: 40, marginTop: 10 }}>
              <span>Hình ảnh xe</span>
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

export default EditVehicle;
