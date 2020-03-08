
import { CommunicationService } from "./communicationService.js";

const commsSvc = new CommunicationService();
const teamOptions = [];
let teamCount = 0;
let teamDictionary = {};
let teamNumber = 0;
let audio;

const handleBuzzerUp = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    console.log("Buzzer up");
    commsSvc.buzzerUp();

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
};

const handleBuzzerDown = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    console.log("Buzzer Down");
    commsSvc.buzzerDown();
};

document.getElementById("buzzer-button").addEventListener("mousedown", (evt) => {
    handleBuzzerDown(evt);
});

document.getElementById("buzzer-button").addEventListener("mouseup", (evt) => {
    handleBuzzerUp(evt);
});

document.getElementById("buzzer-button").addEventListener("touchstart", (evt) => {
    handleBuzzerDown(evt);
});

document.getElementById("buzzer-button").addEventListener("touchend", (evt) => {
    handleBuzzerUp(evt);
});


document.getElementById("name-save").addEventListener("click", () => {
    let player = document.getElementById("name-input").value;
    let team = document.getElementById("team-options").value;

    commsSvc.saveName(team, player);
    teamNumber = teamDictionary[team];
    localStorage.setItem("TeamNumber", teamNumber);

    localStorage.setItem("PlayerName", player);
    localStorage.setItem("TeamName", team);

    document.getElementById("team-player").style.display = "none";
    document.getElementById("header").innerText = team;
    document.getElementById("header").classList.add(`team${teamNumber}`);
});

commsSvc.subscribeTeamAdded((team) => {
    teamOptions.push(team);

    let teamdd = document.getElementById("team-options");
    teamdd.insertAdjacentHTML("beforeend", `<option value="${team}">${team}</option>`);

    teamDictionary[team] = ++teamCount;
});

commsSvc.subscribeIsWinnerStart(() => {
    console.log("WINNER!! - Playing: ", `assets/buzz${teamNumber}.mp3` );

    audio = new Audio(`assets/buzz${teamNumber}.mp3`);
    audio.play();
});

commsSvc.subscribeOnConnected(() => {
    commsSvc.getTeams();

    const playerName = localStorage.getItem("PlayerName");
    const teamName = localStorage.getItem("TeamName");
    teamNumber = localStorage.getItem("TeamNumber");

    if (playerName !== null && teamName !== null) {
        commsSvc.updateConnectionFor(teamName, playerName);

        if (teamName) {
            // setTimeout is the DEVIL... but it's quick to implement, if unreliable as hell.
            setTimeout(() => {
                if (document.querySelectorAll("#team-options>option").length > 1) {
                    document.getElementById("team-options").value = teamName;
                    document.getElementById("name-input").value = playerName;

                    document.getElementById("team-player").style.display = "none";
                    document.getElementById("header").innerText = teamName;
                    document.getElementById("header").classList.add(`team${teamNumber}`);
                } else {
                    clearCache();
                }
            }, 2000);
        }
    }
});

const clearCache = () => {

    // And here the setTimeout chickens come home to roost... 
    setTimeout(() => {

        console.log("Cleared Cache");
        localStorage.removeItem("PlayerName");
        localStorage.removeItem("TeamName");

        document.getElementById("team-options").value = "--None--";
        document.getElementById("name-input").value = "";

    }, 2500);

};

commsSvc.subscribeClearCache(clearCache);


