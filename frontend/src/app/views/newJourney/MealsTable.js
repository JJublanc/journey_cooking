import {
    Box,
    Icon,
    Table,
    styled,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Button,
    IconButton
} from "@mui/material";
import JourneyForm from "./JourneyForm";

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

export default function MealsTable({
                                         journeyMeals,
                                         setJourneyMeals,
                                         setOpenRecipyForm,
                                         setActiveIndex
                                     }) {
    const handleAddRecipe = (index) => {
        setActiveIndex(index)
        setOpenRecipyForm(true)
    }

    const handleDeleteMeal = (index) => {
        const newJourneyMeals = journeyMeals.filter((_, i) => i !== index)
        setJourneyMeals(newJourneyMeals)
    }

    return (
        <Box width="100%" overflow="auto">
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="left">Repas</TableCell>
                        <TableCell align="center">Recette</TableCell>
                        <TableCell align="center">Supprimer</TableCell>
                        <TableCell align="center">Ajouter</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Array.isArray(journeyMeals) &&
                        journeyMeals.length > 0 &&
                        journeyMeals.map((meal, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    align="center">{meal.date}</TableCell>
                                <TableCell
                                    align="left">{meal.meal_type}</TableCell>
                                <TableCell
                                    align="center">{meal.recipe.recipe_name}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => handleDeleteMeal(index)}
                                    >
                                        <Icon color="error"
                                        >close</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell
                                    align="center">
                                    <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleAddRecipe(index)}>
                                        Ajouter
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </StyledTable>
        </Box>
    );
}