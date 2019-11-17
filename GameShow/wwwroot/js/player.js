"use strict";

{
    const commsSvc = new CommunicationService();
    const teamOptions = [];
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

        console.log("saved name: ", player);

        commsSvc.saveName(team, player);

        localStorage.setItem("PlayerName", player);
        localStorage.setItem("TeamName", team);

        document.getElementById("team-player").style.display = "none";
        document.getElementById("header").innerText = team;
    });

    commsSvc.subscribeTeamAdded((teamAdded) => {
        teamOptions.push(teamAdded);

        let teamdd = document.getElementById("team-options");
        teamdd.insertAdjacentHTML("beforeend", `<option value="${teamAdded}">${teamAdded}</option>`);
    });

    commsSvc.subscribeIsWinnerStart(() => {
        audio = new Audio("assets/buzz.mp3");
        audio.play();
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

                        document.getElementById("team-player").style.display = "none";
                        document.getElementById("header").innerText = teamName;
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

}

