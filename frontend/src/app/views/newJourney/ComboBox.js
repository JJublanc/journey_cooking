import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Box} from "@mui/material";


export default function ComboBox({value, setValue, label, width, options}) {
    const handleInputChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: width, minWidth: 50 }}>
            <Autocomplete
                freeSolo
                value={value}
                onInputChange={handleInputChange}
                options={options}
                renderInput={(params) => (
                    <TextField {...params} label={label} variant="outlined"/>
                )}
            />
        </Box>
    );
}