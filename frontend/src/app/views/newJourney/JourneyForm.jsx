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
import RecipesTable from "./RecipesTable"
import useAuth from "../../hooks/useAuth";

const TextField = styled(TextValidator)(() => ({
    width: "100%", marginBottom: "16px"
}));

const JourneyForm = () => {
    const user = {email: "johndoe@gmail.com", token: "XXXX"};
    // const {user} = useAuth();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openRecipeForm, setOpenRecipeForm] = useState(false);
    const [recipesOptions, setRecipesOptions] = React.useState([]);
    const [journeyMeals, setJourneyMeals] = React.useState([]);
    const [journeyName, setJourneyName] = React.useState("");
    const meals = ['Petit-déjeuner', 'Déjeuner', 'Dîner'];
    const [activeIndex, setActiveIndex] = React.useState(0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/recipe/recipes/` + user.email, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token,
            },
        })
            .then(response => response.json())
            .then(data => {
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
        if (!journeyName.trim() || !user.email.trim() || journeyMeals.length===0) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }
        console.log("submitted");
        console.log(event);
        let journeyToSubmit = {
            user_email: user.email,
            journey_name: journeyName,
            start_date: startDate,
            end_date: endDate,
            meals: journeyMeals
        }

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},  // Nous indiquons que nous envoyons des données en format JSON
            body: JSON.stringify(journeyToSubmit)  // Nous convertissons l'objet journeyToSubmit en JSON
        };

        // Nous réalisons la requête
        fetch(`${process.env.REACT_APP_API_URL}/journey/journey_add`, requestOptions)
            .then(response => response.json())  // Nous convertissons la réponse en JSON
            .then(data => console.log(data))  // Nous affichons les données de la réponse
            .catch(err => console.log('Erreur: ' + err)); // Nous affichons une erreur en cas d'échec de la requête
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

    const formatToDateString = (date) => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = (1 + newDate.getMonth()).toString().padStart(2, '0');
    let day = newDate.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
}

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
            const dateString = formatToDateString(day);
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

    return (<div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt: 2}}>
                        <TextField
                            type="text"
                            name="journeyname"
                            id="standard-basic"
                            value={journeyName}
                            onChange={(event) => setJourneyName(event.target.value)}
                            errorMessages={["this field is required"]}
                            label="Nom du séjour (Min length 4, Max length 30)"
                            validators={["required", "minStringLength: 4",
                                "maxStringLength: 30"]}
                        />
                        <Box display="flex" marginTop={2}>
                            <Box marginRight={2}>
                                <Box marginRight={2} justifyContent="center"
                                     alignItems="center">
                                    <div>Du</div>
                                </Box>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}>
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
                            </Box>
                            <Box>
                                <Box marginRight={2} justifyContent="center"
                                     alignItems="center">
                                    <div>Au</div>
                                </Box>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}>
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
                            </Box>
                        </Box>
                        <Box marginTop={5}>
                            <RecipesTable
                                journeyMeals={journeyMeals}
                                setJourneyMeals={setJourneyMeals}
                                setOpenRecipyForm={setOpenRecipeForm}
                                setActiveIndex={setActiveIndex}/>
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
            <RecipyDialog open={openRecipeForm}
                          setOpen={setOpenRecipeForm}
                          journeyMeals={journeyMeals}
                          setJourneyMeals={setJourneyMeals}
                          activeIndex={activeIndex}
                          recipesOptions={recipesOptions}
            />
        </div>
    )
        ;
};
export default JourneyForm;
