import { useEffect } from "react";
import { vacationService } from "../../../Services/VacationService";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {

    //when the layout mount init all vacations to global vacations array
    useEffect(() => {
        (async () => {
            await vacationService.initAllVacations();
        })();
    }, [])

    return (
        <div className="Layout">
            <header>
                <Header />
            </header>
            <main>
                <Routing />
            </main>
        </div>
    );
}

export default Layout;
