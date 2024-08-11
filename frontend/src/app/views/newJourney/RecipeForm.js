import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Fab, Icon, IconButton, styled, TextField} from "@mui/material";
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ComboBox from './ComboBox';
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import useAuth from "../../hooks/useAuth";
import {ComboBoxList} from "./ComboBoxList";
import Autocomplete from "@mui/material/Autocomplete";

const StyledButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1)
}));

export function RecipyDialog({
                                 open,
                                 setOpen,
                                 journeyMeals,
                                 setJourneyMeals,
                                 activeIndex,
                                 recipesOptions,
                                 user,
                             }) {
    const [name, setName] = React.useState("");
    const [personNumber, setPersonNumber] = React.useState("");
    const [cookingTime, setCookingTime] = React.useState("");
    const [preparationTime, setPreparationTime] = React.useState("");
    const [season, setSeason] = React.useState("");
    const [ingredient, setIngredient] = React.useState("");
    const [unit, setUnit] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [ingredientList, setIngredientList] = React.useState([]);
    const ingredientOptions = ['Pommes', 'Poires', 'Bananes', 'Oranges', 'Tomates', 'Carottes', 'Salade', 'Concombre', 'Courgette', 'Aubergine', 'Poivron', 'Pomme de terre', 'Oignon', 'Ail', 'Champignon', 'Poulet', 'Dinde', 'Boeuf', 'Porc', 'Agneau', 'Saumon', 'Cabillaud', 'Sardine', 'Thon', 'Moules', 'Crevettes', 'Coquilles Saint-Jacques', 'Pâtes', 'Riz', 'Quinoa', 'Boulgour', 'Semoule', 'Lentilles', 'Haricots', 'Pois chiches', 'Petits pois', 'Fèves', 'Chou-fleur', 'Brocoli', 'Haricots verts']
    const unitOptions = ['g', 'kg', 'mL', 'L', 'unité(s)', 'cuillère(s) à soupe', 'cuillère(s) à café', 'verre(s)']

    const handlePeopleNumberChange = event => setPersonNumber(event.target.value);

    const handleCookingTimeChange = event => setCookingTime(event.target.value);

    const handlePreparationTimeChange = event => setPreparationTime(event.target.value);

    const handleQuantityChange = event => setQuantity(event.target.value);
    const handleAddIngredientClick = () => {
        if (ingredient !== '' && unit !== '' && quantity !== '') {
            setIngredientList(prevList => [...prevList, {
                'ingredient_name': ingredient,
                'recipe_ingredient_unit': unit,
                'recipe_ingredient_quantity': quantity
            }]);
            setIngredient("");
            setUnit("");
            setQuantity("");
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredientList(ingredientList.filter((_, idx) => idx !== index));
    }

    const fillFormWithRecipe = (recipe) => {
        if (recipe && typeof recipe === 'object') {
            console.log(recipe)
            if (recipe.person_number) setPersonNumber(recipe.person_number);
            if (recipe.cooking_time) setCookingTime(recipe.cooking_time);
            if (recipe.preparation_time) setPreparationTime(recipe.preparation_time);
            if (recipe.season) setSeason(recipe.season);
            if (recipe.recipe_ingredients) setIngredientList(recipe.recipe_ingredients);
        } else {
            console.log("Invalid recipe object", recipe);
        }
    }


    const handleRecipeNameChange = async (event, newValue) => {
        setName(newValue);
        console.log(newValue)

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/recipe/recipe/${newValue}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.token,
                    },
                })

            // Ajout de la vérification de validité de la réponse
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data === null || Object.keys(data).length === 0) {
                throw new Error('No data returned from fetch call');
            } else {

                let recipe = data;

                // Faire quelque chose avec la recette ici
                fillFormWithRecipe(recipe)

                console.log(recipe)
            }

        } catch (error) {
            console.log('Submit will create a new recipe!');
        }
    };

    const handleSaveRecipe = () => {
        try {
            if (user && user.name) {
                let recipe = {
                    user_email: "johndoe@gmail.com",
                    recipe_name: name,
                    preparation_time: preparationTime,
                    cooking_time: cookingTime,
                    person_number: personNumber,
                    season: season,
                    recipe_ingredients: ingredientList
                };
                fetch(`${process.env.REACT_APP_API_URL}/recipe/recipy_add`, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.token,
                    }, body: JSON.stringify(recipe),
                }).then(response => {
                    if (!response.ok) {
                        console.error('Erreur pendant la création de la recette : ', response);
                    }
                    // Déplace ces instructions à l'extérieur du else
                    const updatedJourneyMeals = [...journeyMeals];
                    updatedJourneyMeals[activeIndex].recipe = recipe;
                    setJourneyMeals(updatedJourneyMeals);

                    setName("");
                    setPreparationTime("");
                    setCookingTime("");
                    setPersonNumber("");
                    setSeason("");
                    setUnit("");
                    setIngredientList([]);

                    setOpen(false)
                    console.log('Etape terminée, que la recette soit créée ou non.');

                });
            } else {
                console.log('User name is not defined.');
            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la création de la recette', error);
        }
    };

    return (<div>
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <ValidatorForm onSubmit={handleSaveRecipe}
                           onError={() => null}>
                <DialogTitle id="alert-dialog-title">
                    {"Créer une nouvelle recette"}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setOpen(false)}
                        aria-label="close"
                        style={{
                            position: 'absolute', right: 10, top: 0
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description">
                    </DialogContentText>
                    <Box display="flex" flexDirection="row"
                         flexWrap="wrap"
                         justifyContent="flex-start"
                         gap={2} mt={2}>

                        <Box width="40%">
                            <Autocomplete
                                freeSolo
                                value={name}
                                onInputChange={(event, newValue) => handleRecipeNameChange(event, newValue)}
                                options={recipesOptions || []}
                                renderInput={(params) => (
                                    <TextField {...params}
                                               label="Nom de la recette"

                                    />)}
                            />
                        </Box>

                        <TextValidator
                            style={{width: '100%'}}
                            type="number"
                            name="People Number"
                            id="people-number"
                            onChange={handlePeopleNumberChange}
                            value={personNumber}
                            errorMessages={['Ce champ est requis', 'Doit être un entier supérieur à 1', 'Doit être un entier inférieur à 100']}
                            label="Nombre de personnes"
                            validators={["required", "minNumber:1", "maxNumber:100"]}
                        />


                        <Box width="40%">
                            <ComboBoxList
                                label="Saison"
                                value={season}
                                setValue={setSeason}
                                suggestions={[{label: 'Hiver'}, {label: 'Printemps'}, {label: 'Été'}, {label: 'Automne'}]}
                            />
                        </Box>

                        <Box width="40%">
                            <TextField
                                style={{width: '100%'}}
                                type="number"
                                name="Preparation time"
                                id="preparation-time"
                                onChange={handlePreparationTimeChange}
                                value={preparationTime}
                                label="Temps de préparation (min)"
                                errorMessages={['Doit être un entier supérieur à 1']}
                                validators={["minNumber:1"]}
                            />
                        </Box>


                        <Box width="40%">
                            <TextValidator
                                style={{width: '100%'}}
                                type="number"
                                name="Cooking time"
                                id="cooking-time"
                                onChange={handleCookingTimeChange}
                                value={cookingTime}
                                label="Temps de cuisson (min)"
                                errorMessages={['Doit être un entier supérieur ou égal à 0']}
                                validators={["minNumber:0"]}
                            />
                        </Box>
                    </Box>
                    <div>
                        <h3>Liste des ingrédients</h3>
                    </div>

                    {ingredientList.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <h4 style={{margin: 0}}>
                                {item.ingredient_name} ({item.recipe_ingredient_quantity} {item.recipe_ingredient_unit})
                            </h4>

                            <CloseIcon
                                style={{
                                    color: 'red', cursor: 'pointer'
                                }}
                                onClick={() => handleRemoveIngredient(index)}/>
                        </div>))}

                    <Box display="flex" alignItems="center"
                         justifyContent="space-between" gap={2}
                         mt={2}
                    >
                        <ComboBox
                            label="Ingrédient"
                            value={ingredient}
                            setValue={setIngredient}
                            width='50%'
                            options={ingredientOptions}
                        />

                        <Box width="15%">
                            <TextValidator
                                style={{width: '100%'}}
                                type="number"
                                name="quantity"
                                id="quantity"
                                onChange={handleQuantityChange}
                                value={quantity}
                                label="quantité"
                                errorMessages={['Doit être supérieur à 0']}
                                validators={["minNumber:0"]}
                            />
                        </Box>

                        <ComboBox
                            label="Unité"
                            value={unit}
                            setValue={setUnit}
                            width='15%'
                            options={unitOptions}
                        />

                        <Fab size="small" color="secondary"
                             aria-label="Add"
                             sx={{
                                 width: 56,
                                 height: 56,
                                 minWidth: 56,
                                 minHeight: 56,
                                 mx: 2
                             }}
                             onClick={handleAddIngredientClick}
                        >
                            <Icon>add</Icon>
                        </Fab>
                    </Box>
                </DialogContent>
                <DialogActions>
                </DialogActions>
                <StyledButton
                    variant="contained"
                    type="submit"
                    color="secondary"
                >
                    Enregistrer
                </StyledButton>
            </ValidatorForm>
        </Dialog>
    </div>);
}