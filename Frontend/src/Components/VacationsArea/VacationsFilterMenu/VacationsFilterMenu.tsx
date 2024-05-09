import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Checkbox, FormControlLabel, Slider, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { filterService } from "../../../Services/FilterService";
import "./VacationsFilterMenu.css";

function VacationsFilterMenu(): JSX.Element {

    const user = useSelector((appState: AppState) => appState.user);

    const [likedVacationsChecked, setLikedVacationsChecked] = useState<boolean>(false);
    const [notStartedVacationsChecked, setNotStartedVacationsChecked] = useState<boolean>(false);
    const [activeVacationsChecked, setActiveVacationsChecked] = useState<boolean>(false);
    const [price, setPrice] = useState<number[]>([0, 10000]);
    const [search, setSearch] = useState<string>("");
    const [startDate, setStartDate] = useState<Dayjs>(null);
    const [endDate, setEndDate] = useState<Dayjs>(null);

    //fix bug with redux - for initial filter
    const serializedFilter = {
        likedVacations: false,
        activeVacations: false,
        notStartedVacations: false,
        price: [0, 10000],
        search: "",
        startDate: "",
        endDate: ""
    };

    //check for each filter if it is already in sessionStorage - if true set local and global states
    useEffect(() => {
        filterService.initialFilter(serializedFilter);

        const isLikedVacations = sessionStorage.getItem('isLikedVacations');
        setLikedVacationsChecked(isLikedVacations ? JSON.parse(isLikedVacations) : false);
        filterService.setLikedVacationsFilter(isLikedVacations ? JSON.parse(isLikedVacations) : false);

        const isNotStartedVacations = sessionStorage.getItem('isNotStartedVacations');
        setNotStartedVacationsChecked(isNotStartedVacations ? JSON.parse(isNotStartedVacations) : false);
        filterService.setNotStartedVacationsFilter(isNotStartedVacations ? JSON.parse(isNotStartedVacations) : false);

        const isActiveVacations = sessionStorage.getItem('isActiveVacations');
        setActiveVacationsChecked(isActiveVacations ? JSON.parse(isActiveVacations) : false);
        filterService.setActiveVacationsFilter(isActiveVacations ? JSON.parse(isActiveVacations) : false);

        const price = sessionStorage.getItem('price');
        setPrice(price ? JSON.parse(price) : [0, 10000]);
        filterService.setPriceFilter(price ? JSON.parse(price) : [0, 10000])

        const startDate = sessionStorage.getItem('startDate');
        setStartDate(startDate ? dayjs(JSON.parse(startDate)) : null);
        filterService.setStartDateFilter(startDate ? JSON.parse(startDate) : null);

        const endDate = sessionStorage.getItem('endDate');
        setEndDate(endDate ? dayjs(JSON.parse(endDate)) : null);
        filterService.setEndDateFilter(endDate ? JSON.parse(endDate) : null);

    }, [])

    //reset all filters
    function resetFilters() {
        filterService.initialFilter(serializedFilter);
        setActiveVacationsChecked(false);
        setLikedVacationsChecked(false);
        setNotStartedVacationsChecked(false);
        setPrice([0, 10000]);
        setSearch("");
        setStartDate(null);
        setEndDate(null);
    }

    //handle changes of each filter - add them to sessionStorage and set local and global states

    function handleLikedVacationsChange(event: ChangeEvent<HTMLInputElement>): void {
        sessionStorage.setItem("isLikedVacations", JSON.stringify(event.target.checked));
        setLikedVacationsChecked(event.target.checked);
        filterService.setLikedVacationsFilter(event.target.checked);
    }
    function handleNotStartedVacationsChange(event: ChangeEvent<HTMLInputElement>): void {
        sessionStorage.setItem("isNotStartedVacations", JSON.stringify(event.target.checked));
        setNotStartedVacationsChecked(event.target.checked);
        filterService.setNotStartedVacationsFilter(event.target.checked);
    }
    function handleActiveVacationsChange(event: ChangeEvent<HTMLInputElement>): void {
        sessionStorage.setItem("isActiveVacations", "" + JSON.stringify(event.target.checked));
        setActiveVacationsChecked(event.target.checked);
        filterService.setActiveVacationsFilter(event.target.checked);
    }
    function handleSliderChange(event: any, newValue: number | number[]): void {
        sessionStorage.setItem("price", JSON.stringify(newValue));
        filterService.setPriceFilter(newValue as number[]);
    }
    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearch(event.target.value);
        filterService.setSearchFilter(event.target.value);
    }
    function handleStartDateChange(newValue: any): void {
        if (!newValue)
            return;
        sessionStorage.setItem("startDate", JSON.stringify(dayjs(newValue?.$d).format("YYYY-MM-DD")));
        setStartDate(newValue);
        newValue ? filterService.setStartDateFilter(dayjs(newValue?.$d).format("YYYY-MM-DD")) : filterService.setStartDateFilter("");
    }
    function handleEndDateChange(newValue: any): void {
        if (!newValue)
            return;
        sessionStorage.setItem("endDate", JSON.stringify(dayjs(newValue?.$d).format("YYYY-MM-DD")));
        setEndDate(newValue);
        newValue ? filterService.setEndDateFilter(dayjs(newValue?.$d).format("YYYY-MM-DD")) : filterService.setEndDateFilter("");
    }

    //clearing filters and remove them from sessionStorage
    function clearFilter(): void {
        resetFilters();
        sessionStorage.removeItem("isLikedVacations");
        sessionStorage.removeItem("isNotStartedVacations");
        sessionStorage.removeItem("isActiveVacations");
        sessionStorage.removeItem("price");
        sessionStorage.removeItem("startDate");
        sessionStorage.removeItem("endDate");
    }

    //clear startDate filter 
    function clearStartDate(): void {
        sessionStorage.removeItem("startDate");
        setStartDate(null);
        filterService.setStartDateFilter(null);
    }

    //clear endDate filter 
    function clearEndDate(): void {
        sessionStorage.removeItem("endDate");
        setEndDate(null);
        filterService.setEndDateFilter(null);
    }

    return (
        <div className="VacationsFilterMenu">
            <TextField margin="normal" label="Search" type="text" value={search} onChange={handleSearchChange} />

            {user?.role === "user" &&
                <FormControlLabel
                    control={<Checkbox checked={likedVacationsChecked} onChange={handleLikedVacationsChange} />}
                    label="Liked Vacations" />}

            <FormControlLabel
                control={<Checkbox checked={notStartedVacationsChecked} onChange={handleNotStartedVacationsChange} />}
                label="Future Vacations" />
            <FormControlLabel
                control={<Checkbox checked={activeVacationsChecked} onChange={handleActiveVacationsChange} />}
                label="Active Vacations" />

            <Typography>Price:</Typography>
            <Box sx={{ width: 200, marginLeft: 2 }}>
                from {price[0]} to {price[1]}
                <Slider
                    value={price}
                    onChange={(event, newValue) => { setPrice(newValue as number[]); }}
                    onChangeCommitted={handleSliderChange}
                    max={10000}
                />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DatePicker
                    label="Start Date"
                    value={startDate}
                    format="DD/MM/YYYY"
                    formatDensity="spacious"
                    onChange={(newValue) => { handleStartDateChange(newValue) }}
                    slotProps={{
                        field: { clearable: true, onClear: () => { clearStartDate() } },
                    }}
                />

                <DatePicker
                    value={endDate}
                    label="End Date"
                    minDate={startDate}
                    format="DD/MM/YYYY"
                    formatDensity="spacious"
                    onChange={(newValue) => { handleEndDateChange(newValue) }}
                    slotProps={{
                        field: { clearable: true, onClear: () => { clearEndDate() } },
                    }}
                />

            </LocalizationProvider>

            <Button className="clearAllButton" variant="contained" startIcon={<ClearIcon />} onClick={clearFilter}>
                Clear All
            </Button>
        </div>
    );
}

export default VacationsFilterMenu;
