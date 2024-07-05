import {
    Box,
    Button, Fab,
    Grid, Icon, styled
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useEffect, useState} from "react";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFnsV3";
import {Span} from "../../components/Typography";
import {RecipyDialog} from "./RecipForm";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {ComboBoxList} from "./ComboBoxList";
import useAuth from "../../hooks/useAuth";

const TextField = styled(TextValidator)(() => ({
    width: "100%", marginBottom: "16px"
}));

const StyledButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1)
}));


const JourneyForm = () => {
    const user = {email: "johndoe@gmail.com", token: "XXXX"};
    // const {user} = useAuth();
    const [state, setState] = useState({startDate: new Date()}, {endDate: new Date()});
    const [openRecipyForm, setOpenRecipyForm] = useState(false);
    const [journeyRecipes, setJourneyRecipes] = React.useState([]);
    const [selectedRecipe, setSelectedRecipe] = React.useState("");
    const [recipesOptions, setRecipesOptions] = React.useState([]);
    const [userRecipes, setUserRecipes] = React.useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/recipy/recipes/` + encodeURIComponent(user.email), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token,
            },
        })
            .then(response => response.json())
            .then(data => {
                setUserRecipes(data);
                let recipeNames = data.map(recipe => ({label: recipe.name}));
                setRecipesOptions(recipeNames);
            });
    }, []);

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

    const handleOpenRecipyForm = () => {
        setOpenRecipyForm(true);
    };

    const handleDateChange = (date) => {
        setState(prevState => ({
            ...prevState,
            startDate: date
        }));
    };

    const handleRemoveRecipe = (index) => {
        setJourneyRecipes(journeyRecipes.filter((_, idx) => idx !== index));
    }

    const handleAddExistingRecipe = () => {
        if (selectedRecipe !== '') {
            const recipeToAdd = userRecipes.find(recipe => recipe.name === selectedRecipe);

            if (recipeToAdd) {
                setJourneyRecipes(prevList => [...prevList, recipeToAdd])
                setSelectedRecipe(null)
                console.log(journeyRecipes)
            }
        } else {
            console.log("Error: Cannot find the " +
                "selected recipe in userRecipes!")
        }
    }

    const handleAddNewRecipeClick = (recipy) => {
        if (recipy.name !== '') {
            setJourneyRecipes(prevList => [...prevList, recipy])
        }
    }

    const {
        username,
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

                        <Box marginTop={5}>

                            <div>
                                <h3>Liste des repas du séjour</h3>
                            </div>

                            {journeyRecipes.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <h4 style={{margin: 0}}>
                                        {item.name} ({item.season} {item.max_person_number} pers.
                                        max)
                                    </h4>

                                    <CloseIcon
                                        style={{
                                            color: 'red',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleRemoveRecipe(index)}/>
                                </div>
                            ))}

                            <Box display="flex"
                                 justifyContent="space-between"
                                 marginTop={2}>
                                <Box display="flex">
                                    <Box>
                                        <p>Sélectionner une de vos recettes</p>
                                        <ComboBoxList
                                            label="Repas"
                                            value={selectedRecipe}
                                            setValue={setSelectedRecipe}
                                            suggestions={recipesOptions}
                                        />
                                    </Box>
                                    <Box marginTop={6} marginLeft={2}>
                                        <Fab color="primary"
                                             aria-label="Add"
                                             className="button"
                                             onClick={handleAddExistingRecipe}
                                        >
                                            <Icon>add</Icon>
                                        </Fab>
                                    </Box>
                                </Box>
                                <Box>
                                    <p>... ou créer une nouvelle recette</p>
                                    <StyledButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleOpenRecipyForm}>
                                        Nouvelle recette
                                    </StyledButton>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Box
                    marginTop={3}
                >
                    <Button
                        color="primary" variant="contained" type="submit">
                        <Icon>send</Icon>
                        <Span
                            sx={{
                                pl: 1,
                                textTransform: "capitalize"
                            }}>Submit</Span>
                    </Button>
                </Box>
            </ValidatorForm>
            <RecipyDialog open={openRecipyForm}
                          setOpen={setOpenRecipyForm}
                          handleAddRecipe={handleAddNewRecipeClick}
            />
        </div>
    );
};

export default JourneyForm;
