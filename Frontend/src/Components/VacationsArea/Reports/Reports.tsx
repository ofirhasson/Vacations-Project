import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import "./Reports.css";
// @ts-ignore
import { saveAs } from 'file-saver';
// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from "@mui/material";

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Reports(): JSX.Element {
    const globalVacations = useSelector((appState: AppState) => appState.vacations);

    //creating the graph
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: {
            text: "Vacations likes"
        },
        axisY: {
            includeZero: true
        },
        axisX: {
            labelAngle: 45,
            interval: 1
        },
        data: [{
            color: "rgb(30,144,255)",
            type: "column",
            dataPoints: globalVacations.map(v => ({ label: v.destination, y: v.likesCount }))
        }]
    }

    //create the csv file
    async function createFile(): Promise<void> {
        let file = "destination , likes\n";
        globalVacations.map(v => file += (v.destination.replaceAll(",", ":") + " , " + v.likesCount + "\n"));
        const blob = new Blob([file], { type: "text/plain" });
        saveAs(blob, 'vacations_likes.csv');
    }

    return (
        <div className="Reports">
            <CanvasJSChart options={options} containerProps={{
                width: '80%',
                height: '400px',
                border: '2px solid black',
                marginTop: "4%",
            }} />
            <Button variant="contained" endIcon={<DownloadIcon />} onClick={createFile}>
                Download File
            </Button>
        </div>
    );
}

export default Reports;
