import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/AppState";
import { dateService } from "../../../Services/DateService";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./VacationCard.css";

type vacationCardProps = {
    vacation: VacationModel;
};

function VacationCard(props: vacationCardProps): JSX.Element {

    const user = useSelector((appState: AppState) => appState.user);

    const navigate = useNavigate();

    //delete vacation
    async function deleteVacation() {
        try {

            const sure = window.confirm("Are you sure?");
            if (!sure) return;

            await vacationService.deleteVacation(props.vacation.id);
            notify.success("vacation has been deleted");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    //handle the like button
    async function handleLike(): Promise<void> {
        try {
            if (props.vacation.isLiked === 0)
                await vacationService.addLike(props.vacation.id);
            else
                await vacationService.removeLike(props.vacation.id);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            <Card sx={{ width: 320, height: 320, display: 'flex', flexDirection: 'column' }}>
                <Box onClick={() => { navigate("/layout/details/" + props.vacation.id) }}>
                    <CardMedia
                        sx={{ height: 150 }}
                        image={props.vacation.imageUrl}
                    />
                </Box>
                <CardContent sx={{ height: 100 }}>
                    <div className="priceDiv">{+props.vacation.price}$</div>
                    <Typography gutterBottom variant="h5" component="div" sx={{ overflow: 'auto', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {props.vacation.destination}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {dateService.showDate(props.vacation.startDate)} - {dateService.showDate(props.vacation.endDate)}
                    </Typography>
                </CardContent>
                {user?.role === "user" ?
                    <CardActions sx={{ marginTop: "auto", padding: 0 }}>
                        <div className="likeContainer">
                            <div className="likeDiv">
                                <div className="heart-container-card" title="Like">
                                    <input type="checkbox" checked={props.vacation.isLiked === 1 ? true : false} className="checkbox" onChange={handleLike} />
                                    <div className="svg-container">
                                        <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                            </path>
                                        </svg>
                                        <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                            </path>
                                        </svg>
                                        <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                            <polygon points="10,10 20,20"></polygon>
                                            <polygon points="10,50 20,50"></polygon>
                                            <polygon points="20,80 30,70"></polygon>
                                            <polygon points="90,10 80,20"></polygon>
                                            <polygon points="90,50 80,50"></polygon>
                                            <polygon points="80,80 70,70"></polygon>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <span>{props.vacation.likesCount}</span>
                        </div>
                    </CardActions> :
                    <CardActions sx={{ marginTop: "auto" }}>
                        <Stack direction="row" justifyContent={"center"} spacing={13}>
                            <Button
                                variant="contained"
                                endIcon={<EditIcon />}
                                onClick={() => { navigate("/layout/edit/" + props.vacation.id) }}>
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={deleteVacation}>
                                Delete
                            </Button>
                        </Stack>

                    </CardActions>
                }
            </Card>
        </div>
    );
}

export default VacationCard;
