import { Pagination } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import imageSource from "../../../Assets/Images/logo.jpg";
import VacationModel from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/AppState";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import VacationCard from "../VacationCard/VacationCard";
import VacationsFilterMenu from "../VacationsFilterMenu/VacationsFilterMenu";
import "./VacationsList.css";

function VacationsList(): JSX.Element {
    const globalVacations = useSelector((appState: AppState) => appState.vacations);
    const filter = useSelector((appState: AppState) => appState.filter);

    const isMountedRef = useRef(false); // Ref to track initial render
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [isLoader, setIsLoader] = useState<boolean>(true);

    useEffect(() => {
        // Update isLoader only after the initial render
        if (isMountedRef.current) {
            setIsLoader(false);
        } else {
            // Set isMountedRef to true after the initial render
            isMountedRef.current = true;
        }
    }, [vacations.length])

    useEffect(() => {
        //set the vacation filter from global state
        const vacationFilter = {
            minPrice: filter?.price[0],
            maxPrice: filter?.price[1],
            startDate: filter?.startDate,
            endDate: filter?.endDate,
            search: filter?.search,
            page: currentPage,
            vacationsInPage: 8,
            isLikedVacations: filter?.likedVacations,
            isActiveVacations: filter?.activeVacations,
            isFutureVacations: filter?.notStartedVacations
        }

        vacationService.getAllVacations(vacationFilter)
            .then(dbVacations => {
                setVacations(dbVacations.vacations);
                setTotalRows(dbVacations.totalRows);
            })
            .catch(err => notify.error(err));

    }, [filter, currentPage, globalVacations])

    useEffect(() => {
        setCurrentPage(1);
    }, [filter])

    function handlePageChange(event: any, newPage: number): void {
        setCurrentPage(newPage);
    }

    return (
        <div className="VacationsList">
            <aside>
                <VacationsFilterMenu />
            </aside>
            <main>
                {vacations.length === 0 && !isLoader &&
                    <div>
                        <img src={imageSource}></img>
                        <h2>No results found!</h2>
                        <h5>We couldn't find what your'e looking for</h5>
                    </div>
                }

                {vacations.length === 0 && isLoader &&
                    <div className="loader"></div>
                }

                {vacations.map(v => <VacationCard key={v.id} vacation={v} />)}
                <Pagination
                    className="pagination"
                    count={Math.ceil(totalRows / 8)}
                    page={currentPage}
                    onChange={(event, newPage) => handlePageChange(event, newPage)}
                    variant="outlined" />
            </main>

        </div>
    );

}

export default VacationsList;
