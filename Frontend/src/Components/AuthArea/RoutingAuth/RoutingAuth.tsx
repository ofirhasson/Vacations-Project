import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppState } from "../../../Redux/AppState";
import Layout from "../../LayoutArea/Layout/Layout";
import Login from "../Login/Login";
import Register from "../Register/Register";
import "./RoutingAuth.css";

function RoutingAuth(): JSX.Element {

    const user = useSelector((appState: AppState) => appState.user);

    return (
        <div className="RoutingAuth">
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                {user && <Route path="/layout/*" element={<Layout />} />}

                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </div>
    );
}

export default RoutingAuth;
