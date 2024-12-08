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

const DetailStation = (props) => {
  const { setShowDrawerDetail, showDrawerDetail, dataStation } = props;
  const [images, setImages] = useState();
  const [urlImage, setUrlImage] = useState();
  return (
    <div>
      <Dialog
        open={showDrawerDetail}
        onClose={() => setShowDrawerDetail(false)}
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
          Thông tin bến xe
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div className="row">
              <div className="col-3">
                <Typography variant="h6">
                  <span style={{ color: "#000", fontSize: 18 }}>
                    Mã bến xe:
                  </span>{" "}
                </Typography>
              </div>
              <div className="col-8">
                <Typography variant="h6" style={{ fontSize: 18 }}>
                  {dataStation.code}
                </Typography>
              </div>
              <div className="col-12">
                <Divider />
              </div>
              <div className="col-3">
                <Typography variant="h6">
                  <span style={{ color: "#000", fontSize: 18 }}>
                    Tên bến xe:
                  </span>{" "}
                </Typography>
              </div>
              <div className="col-8">
                <Typography variant="h6" style={{ fontSize: 18 }}>
                  {dataStation.name}
                </Typography>
              </div>
              <div className="col-12">
                <Divider />
              </div>

              <div className="col-3">
                <Typography variant="h6">
                  <span style={{ color: "#000", fontSize: 18 }}>Địa chỉ:</span>{" "}
                </Typography>
              </div>
              <div className="col-8">
                <Typography variant="h6" style={{ fontSize: 18 }}>
                  {dataStation.fullAddress}
                </Typography>
              </div>
            </div>

            <Divider />

            <Typography variant="h6">
              <span style={{ color: "#000", marginRight: 50, fontSize: 18 }}>
                Hình ảnh:
              </span>
            </Typography>
            <ImageList
              sx={{
                width: 565,
                height: 330,
                marginTop: 1,
                borderColor: "#000",
                // border: 1,
                borderRadius: 1,
              }}
              cols={2}
              rowHeight={300}
            >
              {dataStation?.images?.map((item) => (
                <ImageListItem key={item.url}>
                  <img
                    src={`${item.url}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={dataStation.name}
                    loading="lazy"
                  />
                  <ImageListItemBar position="below" title={""} />
                </ImageListItem>
              ))}
            </ImageList>
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
    </div>
  );
};

export default DetailStation;
