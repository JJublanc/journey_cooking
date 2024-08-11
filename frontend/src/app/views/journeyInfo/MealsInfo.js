import Container from "@mui/material/Container";
import * as React from "react";

export default function MealsInfo({list}) {
    return (
        <Container style={{ margin: 20 }}>
            {list.map((meal, index) => {
                const dayNumber = Math.floor(index / 3) + 1;
                return (
                    <p key={index}>
                        Jour {dayNumber}: {meal.meal_type} {meal.recipe.recipe_name}
                    </p>
                );
            })}
        </Container>
    );
}