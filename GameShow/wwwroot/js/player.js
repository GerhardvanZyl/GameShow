"use strict";

{
    const commsSvc = new CommunicationService();
    const teamOptions = [];

    document.getElementById("buzzer-button").addEventListener("mousedown", () => {
        console.log("Buzzer Down");
        commsSvc.buzzerDown();
    });

    document.getElementById("buzzer-button").addEventListener("mouseup", () => {
        console.log("Buzzer up");
        commsSvc.buzzerUp();
    });

    document.getElementById("name-save").addEventListener("click", () => {
        let player = document.getElementById("name-input").value;
        let team = document.getElementById("team-options").value;

        console.log("saved name: ", player);

        commsSvc.saveName(team, player);

        localStorage.setItem("PlayerName", player);
        localStorage.setItem("TeamName", team);
    });

    commsSvc.subscribeTeamAdded((teamAdded) => {
        teamOptions.push(teamAdded);

        let teamdd = document.getElementById("team-options");
        teamdd.insertAdjacentHTML("beforeend", `<option value="${teamAdded}">${teamAdded}</option>`);
    });

    commsSvc.subscribeOnConnected(() => {
        commsSvc.getTeams();

        const playerName = localStorage.getItem("PlayerName");
        const teamName = localStorage.getItem("TeamName");

        if (playerName !== null && teamName !== null) {
            commsSvc.updateConnectionFor(teamName, playerName);

            if (teamName) {
                // setTimeout is the DEVIL... but it's quick to implement, if unreliable as hell.
                setTimeout(() => {
                    if (document.querySelectorAll("#team-options>option").length > 1) {
                        document.getElementById("team-options").value = teamName;
                        document.getElementById("name-input").value = playerName;
                    } else {
                        clearCache();
                    }
                }, 2000);
            }
        }
    });

    const clearCache = () => {
        console.log("Cleared Cache");
        localStorage.removeItem("PlayerName");
        localStorage.removeItem("TeamName");
    };

    commsSvc.subscribeClearCache(clearCache);
    
}

