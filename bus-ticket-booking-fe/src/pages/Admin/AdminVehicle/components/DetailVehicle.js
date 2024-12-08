import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Drawer, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import EditVehicle from "./EditVehicle";
import "./index.scss";

const DetailVehicle = (props) => {
  const { setShowDrawerDetail, showDrawerDetail, dataVehicle, handleGetData } =
    props;

  const [seatsFloor1, setSeatsFloor1] = useState([]);
  const [seatsFloor2, setSeatsFloor2] = useState([]);
  const [showDrawerEdit, setShowDrawerEdit] = useState(false);

  const handleSeat = async () => {
    const seat1 = [];
    const seat2 = [];
    if (dataVehicle.seats) {
      for (let i = 0; i < dataVehicle.seats.length; i++) {
        if (dataVehicle.seats[i].floor == 1) {
          seat1.push(dataVehicle.seats[i]);
        } else {
          seat2.push(dataVehicle.seats[i]);
        }
      }
    }
    setSeatsFloor1(seat1);
    setSeatsFloor2(seat2);
  };

  useEffect(() => {
    handleSeat();
  }, [dataVehicle]);

  return (
    <Drawer
      PaperProps={{
        sx: { width: "45%", minWidth: "39rem" },
      }}
      anchor={"right"}
      open={showDrawerDetail}
      className="drawer"
      onClose={() => setShowDrawerDetail(false)}
    >
      <div className="title-drawer">
        <div className="btn-close" onClick={() => setShowDrawerDetail(false)}>
          <ArrowBackIosIcon className="icon-back" />
        </div>
        <div>
          <span>Chi tiết</span>
        </div>
      </div>
      <div className="content-drawer">
        <div className="title-group">
          <span>Thông tin xe</span>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => setShowDrawerEdit(true)}
          >
            sửa thông tin
          </Button>
        </div>
      </div>
      <div
        className="row"
        style={{ marginLeft: 20, marginTop: 20, width: "97%" }}
      >
        <div className="col-3">
          <span style={{ color: "#000", fontSize: 16 }}>Mã xe:</span>{" "}
        </div>
        <div className="col-8">
          <span variant="h6" style={{ fontSize: 16 }}>
            {dataVehicle.code}
          </span>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Tên xe:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>{dataVehicle.name}</Typography>
        </div>
        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Loại xe:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>{dataVehicle.type}</Typography>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Biển số xe:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataVehicle.licensePlate}
          </Typography>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Số tầng:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataVehicle.floorNumber}
          </Typography>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Tổng số ghế:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataVehicle.totalSeat}
          </Typography>
        </div>
        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Mô tả:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {dataVehicle?.description}
          </Typography>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Ngày tạo:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <Typography style={{ fontSize: 16 }}>
            {moment(dataVehicle.createdAt).format("DD/MM/YYYY")}
          </Typography>
        </div>

        <div className="col-12"></div>
        <div className="col-3" style={{ marginTop: 10 }}>
          <span style={{ color: "#000", fontSize: 16, marginTop: 20 }}>
            Hình ảnh:
          </span>{" "}
        </div>
        <div className="col-8" style={{ marginTop: 10 }}>
          <img
            src={dataVehicle?.images?.[0]?.url ||''}
            alt=""
            style={{ aspectRatio: 1, width: "100px", backgroundSize: "cover" }}
          />
        </div>

        <div className="col-12"></div>
      </div>
      
      <EditVehicle
        setShowDrawer={setShowDrawerEdit}
        showDrawer={showDrawerEdit}
        dataVehicle={dataVehicle}
        setShowDrawerDetail={setShowDrawerDetail}
        handleGetData={handleGetData}
      ></EditVehicle>
    </Drawer>
  );
};

export default DetailVehicle;
