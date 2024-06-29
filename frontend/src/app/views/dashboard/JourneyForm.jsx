import {
    Button,
    Grid, Icon, styled
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useEffect, useState} from "react";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {Span} from "../../components/Typography";
import {AlertDialog} from "./RecipForm";

const TextField = styled(TextValidator)(() => ({
    width: "100%", marginBottom: "16px"
}));

const JourneyForm = () => {
    const [state, setState] = useState({startDate: new Date()}, {endDate: new Date()});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
            if (value !== state.password) return false;

            return true;
        });
        return () => ValidatorForm.removeValidationRule("isPasswordMatch");
    }, [state.password]);

    const handleSubmit = (event) => {
        // console.log("submitted");
        // console.log(event);
    };

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.value});
    };

    const handleDateChange = (date) => {
        setState(prevState => ({
            ...prevState,
            startDate: date
        }));
    };


    const {
        username,
        firstName,
        creditCard,
        mobile,
        password,
        confirmPassword,
        gender,
        date,
        email
    } = state;

    return (<div>
        <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                    <TextField
                        type="text"
                        name="journeyname"
                        id="standard-basic"
                        value={username || ""}
                        onChange={handleChange}
                        errorMessages={["this field is required"]}
                        label="Nom du séjour (Min length 4, Max length 30)"
                        validators={["required", "minStringLength: 4", "maxStringLength: 30"]}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={state.startDate}
                            onChange={handleDateChange}
                            renderInput={(props) => (
                                <TextField {...props} variant="standard"
                                           id="mui-pickers-date"
                                           label="Date picker"/>)}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={state.endDate}
                            onChange={handleDateChange}
                            renderInput={(props) => (
                                <TextField {...props} variant="standard"
                                           id="mui-pickers-date"
                                           label="Date picker"/>)}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Button color="primary" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{pl: 1, textTransform: "capitalize"}}>Submit</Span>
            </Button>
        </ValidatorForm>
        <AlertDialog/>


    </div>);
};

export default JourneyForm;
