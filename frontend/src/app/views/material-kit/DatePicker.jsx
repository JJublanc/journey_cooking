import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

export default function MaterialUIDatePickers() {
  const [selectedDate, setSelectedDate] = useState(new Date("2014-08-18T21:11:54"));
  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(props) => (
            <TextField {...props} variant="standard" id="mui-pickers-date" label="Date picker" />
          )}
        />
    </LocalizationProvider>
  );
}
