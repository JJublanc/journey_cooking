import {Stack} from "@mui/material";
import {styled} from "@mui/material";
import {SimpleCard} from "app/components";
import JourneyList from "app/views/journeyInfo/JourneyList";
// STYLED COMPONENTS
const Container = styled("div")(({theme}) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: {margin: "16px"},
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: {marginBottom: "16px"}
    }
}));
export default function AppForm() {
    return (
        <Container>
            <Stack spacing={3}>
                <SimpleCard title="Vos séjours">
                    <JourneyList/>
                </SimpleCard>
            </Stack>
        </Container>
    );
}