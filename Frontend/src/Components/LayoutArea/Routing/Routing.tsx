import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppState } from "../../../Redux/AppState";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import Reports from "../../VacationsArea/Reports/Reports";
import VacationDetails from "../../VacationsArea/VacationDetails/VacationDetails";
import VacationsList from "../../VacationsArea/VacationsList/VacationsList";
import Page404 from "../page404/page404";
import "./Routing.css";

function Routing(): JSX.Element {

    const user = useSelector((appState: AppState) => appState.user);

    return (
        <div className="Routing">

            <Routes>

                {/* List: */}
                <Route path="list" element={<VacationsList />} />

                {/* Add: */}
                {user.role === "admin" && <Route path="new" element={<AddVacation />} />}

                {/* Edit:*/}
                {user.role === "admin" && <Route path="edit/:id" element={<EditVacation />} />}

                {/* Details:*/}
                <Route path="details/:id" element={<VacationDetails />} />

                {/* Reports:*/}
                {user.role === "admin" && <Route path="reports" element={<Reports />} />}

                {/* Default Route: */}
                <Route path="/" element={<Navigate to="/layout/list" />} />

                {/*Page not found route: */}
                <Route path="*" element={<Page404 />} />

            </Routes>

        </div>
    );
}

export default Routing;
