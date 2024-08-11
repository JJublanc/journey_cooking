import Container from "@mui/material/Container";
import * as React from "react";

export default function ShoppingList({list}) {

    return (
        <Container style={{ margin: 20 }}>
                {Object.entries(list).map(([key, value], index) => (
                    <p key={index}>{key}: {value.quantity} {value.unit}</p>
                ))}
        </Container>)
}
