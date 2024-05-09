import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack, TextField, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./EditVacation.css";

//the style of the image button from MUI
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function EditVacation(): JSX.Element {

    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, control, setValue, reset } = useForm<VacationModel>();

    const [minStartDate, setMinStartDate] = useState<Dayjs>(null);
    const [newStartDate, setNewStartDate] = useState<Date>(null);
    const [newEndDate, setNewEndDate] = useState<Date>(null);
    const [newImage, setNewImage] = useState<string>(null);
    const [startImage, setStartImage] = useState<File>(null);

    function handleImageChange(e: any) {
        setNewImage(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(() => {
        vacationService.getOneVacation(+params.id)
            .then(vacation => {
                setValue("destination", vacation.destination);
                setValue("description", vacation.description);
                setValue("price", vacation.price);
                setValue("image", vacation.image);
                setNewImage(vacation.imageUrl);
                setStartImage(vacation.image);
                setNewStartDate(dayjs(vacation.startDate).toDate());
                setNewEndDate(dayjs(vacation.endDate).toDate());
                setMinStartDate(dayjs(vacation.startDate));
            })
            .catch(err => notify.error(err))
    }, [])

    async function updateVacation(vacation: VacationModel) {
        try {
            if (newEndDate < newStartDate || !newStartDate || !newEndDate)
                return;

            vacation.startDate = (dayjs(newStartDate)).format("YYYY-MM-DD");
            vacation.endDate = (dayjs(newEndDate)).format("YYYY-MM-DD");

            if (!vacation.image)
                vacation.image = startImage;
            else
                vacation.image = (vacation.image as unknown as FileList)[0];

            vacation.id = +params.id;
            await vacationService.updateVacation(vacation);
            const destination = vacation.destination;
            notify.success(`vacation to ${destination} has been updated!`);
            navigate("/layout/list");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    //clearing the form
    function handleClear() {
        reset();
        setNewStartDate(null);
        setNewEndDate(null);
    }

    return (
        <div className="EditVacation">
            <form onSubmit={handleSubmit(updateVacation)}>
                <TextField
                    margin="normal"
                    label="Destination"
                    required
                    type="text"
                    inputProps={
                        {
                            minLength: 2,
                            max: 50
                        }
                    }
                    {...register("destination")} />
                <TextField
                    margin="normal"
                    label="Description"
                    required
                    multiline
                    maxRows={4}
                    type="text"
                    inputProps={
                        {
                            minLength: 10,
                            max: 3000
                        }
                    }
                    {...register("description")} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                        name={"startDate"}
                        control={control}
                        render={({ field: { onChange } }) => (
                            <DatePicker
                                formatDensity="spacious"
                                className="datePicker"
                                format="DD/MM/YYYY"
                                value={dayjs(newStartDate)}
                                label="Start Date"
                                slotProps={{
                                    field: { clearable: true },
                                    textField: { required: true },
                                }}
                                onChange={(newDate) => {
                                    if (!newDate)
                                        // If DatePicker is cleared, set value to null to trigger required validation
                                        onChange(null);
                                    else {
                                        setMinStartDate(newDate);
                                        setNewStartDate(dayjs(newDate).toDate());
                                        onChange((dayjs(newDate)).format("YYYY-MM-DD"));
                                    }
                                }} />
                        )}
                    />
                    <Controller
                        name={"endDate"}
                        control={control}
                        render={({ field: { onChange } }) => (
                            <DatePicker
                                formatDensity="spacious"
                                className="datePicker"
                                format="DD/MM/YYYY"
                                value={dayjs(newEndDate)}
                                label="End Date"
                                minDate={minStartDate}
                                slotProps={{
                                    field: { clearable: true },
                                    textField: { required: true },
                                }}
                                onChange={(newDate) => {
                                    if (!newDate)
                                        // If DatePicker is cleared, set value to null to trigger required validation
                                        onChange(null);
                                    else {
                                        setNewEndDate(dayjs(newDate).toDate());
                                        onChange((dayjs(newDate)).format("YYYY-MM-DD"));
                                    }
                                }} />
                        )}
                    />
                </LocalizationProvider>

                <TextField
                    margin="normal"
                    fullWidth
                    required
                    label="Price"
                    type="number"
                    inputProps={
                        {
                            min: 0,
                            max: 10000,
                            step: "0.01"
                        }
                    }
                    {...register("price")} />

                <div className="EditImageContainer">

                    <div className="imageWrapper">
                        <img src={newImage} alt="Selected Image" />
                    </div>

                    <Button
                        className="imageButton"
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload file
                        <VisuallyHiddenInput type="file" {...register('image')} onChange={handleImageChange} />
                    </Button>

                </div>

                <Stack direction="row" justifyContent={"center"} spacing={6}>
                    <Button variant="contained" endIcon={<SendIcon />} type="submit">
                        Edit Vacation
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleClear}>
                        Clear
                    </Button>
                </Stack>
            </form>
        </div>
    );
}

export default EditVacation;
