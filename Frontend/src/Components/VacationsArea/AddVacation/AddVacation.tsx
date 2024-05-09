import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack, TextField, styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { ChangeEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import defaultImageSource from "../../../Assets/Images/default_image.jpg";
import VacationModel from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import "./AddVacation.css";

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

function AddVacation(): JSX.Element {

    const { register, handleSubmit, control, reset } = useForm<VacationModel>();

    const [date, setDate] = useState(null);
    const [selectedImage, setSelectedImage] = useState<string>(null);

    const navigate = useNavigate();

    //clearing the form
    function handleClear() {
        reset();
        reset({ startDate: null, endDate: null, image: null });
        setSelectedImage(null);
    };

    function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
        setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }

    async function addVacation(vacation: VacationModel) {
        try {
            if (vacation.endDate < vacation.startDate)
                return;
            vacation.image = (vacation.image as unknown as FileList)[0];
            await vacationService.addVacation(vacation);
            const destination = vacation.destination;
            notify.success(`vacation to ${destination} has been added!`);
            navigate("/layout/list");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Add">
            <form onSubmit={handleSubmit(addVacation)}>
                <TextField
                    margin="normal"
                    required
                    label="Destination"
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
                    required
                    multiline
                    maxRows={4}
                    label="Description"
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
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                className="datePicker"
                                formatDensity="spacious"
                                format="DD/MM/YYYY"
                                value={value || null}
                                label="Start Date"
                                disablePast
                                slotProps={{
                                    field: { clearable: true },
                                    textField: { required: true },
                                }}
                                onChange={(newDate) => {
                                    if (!newDate)
                                        // If DatePicker is cleared, set value to null to trigger required validation
                                        onChange(null);

                                    else {
                                        setDate(newDate);
                                        onChange((dayjs(newDate)).format("YYYY-MM-DD"));
                                    }
                                }} />
                        )}
                    />
                    <Controller
                        name={"endDate"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                className="datePicker"
                                formatDensity="spacious"
                                format="DD/MM/YYYY"
                                value={value || null}
                                label="End Date"
                                minDate={date}
                                slotProps={{
                                    field: { clearable: true },
                                    textField: { required: true },
                                }}
                                onChange={(newDate) => {
                                    if (!newDate)
                                        // If DatePicker is cleared, set value to null to trigger required validation
                                        onChange(null);

                                    else
                                        onChange((dayjs(newDate)).format("YYYY-MM-DD"));
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

                <div className="imageContainer">

                    <div className="imageWrapper">
                        <img src={selectedImage ? selectedImage : defaultImageSource} alt="Selected Image" />
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
                        <VisuallyHiddenInput type="file" required {...register('image')} onChange={handleImageChange} />
                    </Button>

                </div>

                <Stack direction="row" justifyContent={"center"} spacing={6}>
                    <Button variant="contained" endIcon={<SendIcon />} type="submit">
                        Add Vacation
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleClear}>
                        Clear
                    </Button>
                </Stack>

            </form >
        </div >
    );
}

export default AddVacation;
