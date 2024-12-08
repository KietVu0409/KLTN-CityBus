import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import moment from "moment";


export default function InputSearchTrip(props) {
	return (
		<div className="w-full search_trip">
			<div className="flex search_trips_input grid grid-cols-6">
				<div className="search_input col-span-5">
					<div className="flex">
						<div className="input-1">
							<Autocomplete
								disablePortal
								id="combo-box-demo"
								sx={{width: 300}}
								renderInput={(params) => <TextField {...params} label="Điểm đi" />}
							/>
						</div>
						<div className="input-2">
							<Autocomplete
								
								disablePortal
								id="combo-box-demo"
								
								sx={{width: 300}}
								renderInput={(params) => <TextField {...params} label="Điểm đến" />}
							/>
						</div>
						<div className="input-3">
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label="Ngày đi"
									
									views={["year", "month", "day"]}
									format="DD-MM-YYYY"
									
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</div>
					</div>
				</div>
				<div className="search_trips_button col-span-1 text-center">
					<LoadingButton className="w-full h-full" color="primary" loadingPosition="start" variant="contained">
						Tìm chuyến
					</LoadingButton>
				</div>
			</div>
		</div>
	);
}
