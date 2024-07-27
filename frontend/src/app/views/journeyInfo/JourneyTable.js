import React, {useState, useEffect} from 'react';
import {
    Box,
    Table,
    styled,
    TableRow,
    TableBody,
    TableCell,
    TableHead, Button,
} from "@mui/material";
import Shoppinglist from "./ShoppingList";
import Popup from "./Popup";
import MealsInfo from "./MealsInfo";

// STYLED COMPONENT
const StyledTable = styled(Table)(({theme}) => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": {"& th": {paddingLeft: 0, paddingRight: 0}}
    },
    "& tbody": {
        "& tr": {"& td": {paddingLeft: 0, textTransform: "capitalize"}}
    }
}));

export default function JourneyTable({journeyList}) {
    const [openShoppingList, setOpenShoppingList] = useState(false)
    const [openJourneyMeals, setOpenJourneyMeals] = useState(false)
    const [ingredientsMap, setIngredientsMap] = useState({});
    const [journeyMeals, setJourneyMeals] = useState([]);
    const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(null);


    useEffect(() => {
        if (Object.keys(ingredientsMap).length > 0) {
            setOpenShoppingList(true);
        }
    }, [ingredientsMap]);

    useEffect(() => {
        if (selectedJourneyIndex !== null) {
            setOpenJourneyMeals(true);
        }
    }, [selectedJourneyIndex]);

    const handleShowShoppingList = (index) => {
        const meals = journeyList[index].meals;
        const number_of_people = journeyList[index].number_of_people
        let ingredientsMapNew = {};
        meals.forEach(meal => {
            meal.recipe.recipe_ingredients.forEach(ingredient => {
                console.dir(meal.recipe.recipe_ingredients)
                let key = `${ingredient.ingredient_name}-${ingredient.recipe_ingredient_unit}`;
                if (ingredientsMapNew.hasOwnProperty(key)) {
                    ingredientsMapNew[key].quantity += number_of_people * (ingredient.recipe_ingredient_quantity / meal.recipe.person_number);
                } else {
                    ingredientsMapNew[key] = {
                        quantity: number_of_people * (ingredient.recipe_ingredient_quantity / meal.recipe.person_number),
                        unit: ingredient.recipe_ingredient_unit
                    };
                }
            });
        });
        setIngredientsMap(ingredientsMapNew)
    }

    const handleShowJourneyMeals = (index) => {
        setJourneyMeals(journeyList[index].meals)
            setOpenJourneyMeals(true);
        setSelectedJourneyIndex(index);
    }

    return (
        <Box width="100%" overflow="auto">
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Séjour</TableCell>
                        <TableCell align="center">Liste des repas </TableCell>
                        <TableCell align="center">Liste de courses</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Array.isArray(journeyList) &&
                        journeyList.length > 0 &&
                        journeyList.map((journey, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    align="center">{journey.journey_name}
                                </TableCell>
                                <TableCell
                                    align="center">
                                    <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleShowJourneyMeals(index)}>
                                        Liste des repas
                                    </Button>
                                </TableCell>
                                <TableCell
                                    align="center">
                                    <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleShowShoppingList(index)}>
                                        Liste de courses
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </StyledTable>
            <Popup open={openShoppingList} setOpen={setOpenShoppingList} title="Liste de courses">
                <Shoppinglist list={ingredientsMap}/>
            </Popup>
            <Popup open={openJourneyMeals} setOpen={setOpenJourneyMeals} title="Liste des repas">
                <MealsInfo list={journeyMeals}/>
            </Popup>
        </Box>
    );
}