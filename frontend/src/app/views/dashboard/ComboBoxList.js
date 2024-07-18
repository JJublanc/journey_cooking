import TextField from '@mui/material/TextField';
import {Box} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import {Fragment} from "react";

export function ComboBoxList({value, setValue, label, suggestions, width}) {
    const handleInputChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
            <Autocomplete
                value={value}
                onChange={handleInputChange}
                options={suggestions.map((option) => option.label)}
                renderInput={(params) => (
                    <TextField {...params}
                               label={label} variant="outlined" fullWidth/>
                )}
            />
    );
}
