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

export default function RecipesTable({journeyMeals, setOpenRecipyForm, setActiveIndex}) {
    const handleButtonClick = (index) => {
        setActiveIndex(index)
        setOpenRecipyForm(true)
    }

    return (
        <Box width="100%" overflow="auto">
            <StyledTable>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Repas</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Recette</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Array.isArray(journeyMeals) &&
                        journeyMeals.length > 0 &&
                        journeyMeals.map((meal, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{meal.meal}</TableCell>
                                <TableCell
                                    align="center">{meal.date}</TableCell>
                                <TableCell
                                    align="center">{meal.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton>
                                        <Icon color="error">close</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell
                                    align="center"> {/* Add this block */}
                                    <Button variant="contained"
                                            color="primary"
                                            onClick={() => handleButtonClick(index)}>
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