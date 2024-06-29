import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

export default function MaterialUIDatePickers() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  function handleDateChange(date) {
    setSelectedDate(date);
  }

  return (
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(props) => (
            <TextField {...props} variant="standard" id="mui-pickers-date" label="Date picker" />
          )}
        />
  );
}
