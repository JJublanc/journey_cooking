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
import {RecipyDialog} from "./RecipeForm";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {ComboBoxList} from "./ComboBoxList";
import RecipesTable from "./RecipesTable"
import useAuth from "../../hooks/useAuth";

const TextField = styled(TextValidator)(() => ({
    width: "100%", marginBottom: "16px"
}));

const StyledButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1)
}));

// TODO : 1/ remplacer dans le backend recipes par meals avec un champs date et un champ meal_type
// TODO : 2/ mettre à jour le frontend pour tenir compte ce cet ajustement
// TODO : Ajouter les recettes déjà créées comme sugestion avec une autocomplétion
// TODO : supprimer le repas du form de recette

const JourneyForm = () => {
    const user = {email: "johndoe@gmail.com", token: "XXXX"};
    // const {user} = useAuth();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openRecipyForm, setOpenRecipyForm] = useState(false);
    const [journeyRecipes, setJourneyRecipes] = React.useState([]);
    const [selectedRecipe, setSelectedRecipe] = React.useState("");
    const [recipesOptions, setRecipesOptions] = React.useState([]);
    const [userRecipes, setUserRecipes] = React.useState([]);
    const [journeyMeals, setJourneyMeals] = React.useState([]);
    const [journeyName, setJourneyName] = React.useState("");
    const meals = ['Petit-déjeuner', 'Déjeuner', 'Dîner'];
    const [activeIndex, setActiveIndex] = React.useState(0);

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
                console.log(recipesOptions)
            })
            .catch(error => {
                console.error('An error occurred while fetching the recipes:', error);
                setRecipesOptions([]);
            });
    }, []);

    const handleSubmit = (event) => {
        // console.log("submitted");
        // console.log(event);
    };

    const handleOpenRecipyForm = () => {
        setOpenRecipyForm(true);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        console.log("la date qui vient d'être changée est " + date)
        computeJourneyMeals(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        console.log("la date qui vient d'être changée est " + date)
        computeJourneyMeals(startDate, date);
    };

    const computeJourneyMeals = (start, end) => {
        setJourneyMeals([])

        // Transformer les dates en objets Date
        let startDay = new Date(start);
        let endDay = new Date(end);
        console.log("Start : " + startDay);
        console.log("End : " + endDay);

        // Vérifier que la date de début est antérieure à la date de fin
        if (startDay > endDay) {
            console.error('La date de début doit être antérieure à la date de fin.');
            return;
        }

        // Parcourir chaque jour entre les dates de début et de fin
        let newJourneyMeals = [];
        for (let day = startDay; day <= endDay; day.setDate(day.getDate() + 1)) {
            console.log(day);
            const dateString = [day.getDate(), day.getMonth() + 1, day.getFullYear()].join('/');
            meals.forEach(meal => {
                newJourneyMeals.push({
                    'date': dateString,
                    'meal_type': meal,
                    'recipe': {'recipe_name': 'Aucune recette sélectionnée'}
                });
            });
        }
        console.log(newJourneyMeals)
        setJourneyMeals(newJourneyMeals);
        console.log(journeyMeals)
    }


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

    return (<div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                        <TextField
                            type="text"
                            name="journeyname"
                            id="standard-basic"
                            value={journeyName || ""}
                            onChange={(name) => setJourneyName(name)}
                            errorMessages={["this field is required"]}
                            label="Nom du séjour (Min length 4, Max length 30)"
                            validators={["required", "minStringLength: 4", "maxStringLength: 30"]}
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={startDate}
                                onChange={handleStartDateChange}
                                renderInput={(props) => (
                                    <TextField {...props}
                                               variant="standard"
                                               id="mui-pickers-startdate"
                                               label="Date picker"/>)}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={endDate}
                                onChange={handleEndDateChange}
                                renderInput={(props) => (
                                    <TextField {...props}
                                               variant="standard"
                                               id="mui-pickers-enddate"
                                               label="Date picker"/>)}
                            />
                        </LocalizationProvider>

                        <Box marginTop={5}>
                            <RecipesTable
                                journeyMeals={journeyMeals}
                                setJourneyMeals={setJourneyMeals}
                                setOpenRecipyForm={setOpenRecipyForm}
                                setActiveIndex={setActiveIndex}/>
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
                                        {item.recipe_name} ({item.season} {item.max_person_number} pers.
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
                                        <p>Sélectionner une de vos
                                            recettes</p>
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
                                    <p>... ou créer une nouvelle
                                        recette</p>
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
                          journeyMeals={journeyMeals}
                          setJourneyMeals={setJourneyMeals}
                          activeIndex={activeIndex}
                          recipesOptions={recipesOptions}

            />
        </div>
    );
};
export default JourneyForm;
