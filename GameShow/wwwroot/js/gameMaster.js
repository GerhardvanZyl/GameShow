"use strict";

{
    let scoreboardCount = 0;
    const commsSvc = new CommunicationService();
    const teams = {};
    const scoreboardsContainer = document.getElementById("score-boards");
    const teamInput = document.getElementById("team-name");
    const clearStateBtn = document.getElementById("clear-state");
    let buzzedTeam = null;
    const teamBuzzedBy = {};
    const teamBuzzedLateBy = {};
    const scoreboardTemplate =
        `<div>
                <div>
                    <span>
                        <h3>{1}: </h3>
                    </span>
                    <span>
                        <input type="text" id="score{0}" value="{2}"/>
                     </span>
                </div>
                <div class="score-card team{0}" />
                <div class="name" id="team{0}-name" />                
                <div class="score" id="team{0}-score" contenteditable=true />
            </div>`;

    commsSvc.subscribeOnConnected(() => {
        commsSvc.getTeams();
    });

    clearStateBtn.addEventListener('click', () => {
        teamBuzzedBy = {};
        teamBuzzedLateBy = {};
        buzzedTeam = null;
    });

    const setTeamBuzzedBy = (team, player) => {
        if (!teamBuzzedBy[team]) {
            teamBuzzedBy[team] = [];
        }

        teamBuzzedBy[team].push(player);
    };

    const setTeamBuzzedLateBy = (team, player) => {
        if (!setTeamBuzzedLateBy[team]) {
            setTeamBuzzedLateBy[team] = [];
        }

        setTeamBuzzedLateBy[team].push(player);
    };

    const removeTeamBuzzedBy = (team, player) => {
        if (!teamBuzzedBy[team]) { // just to be sure
            let index = teamBuzzedBy[team].indexOf(player);
            teamBuzzedBy[team].splice(index, i);
        }
    };

    const removeTeamBuzzedLateBy = (team, player) => {
        if (!teamBuzzedLateBy[team]) { // just to be sure
            let index = teamBuzzedLateBy[team].indexOf(player);
            teamBuzzedLateBy[team].splice(index, i);
        }
    };

    const addTeam = () => {
        // TODO: security
        const teamName = teamInput.value;
        console.log("team name");
        commsSvc.addTeam(teamName);
    };

    const teamAdded = (teamName, score) => {
        scoreboardsContainer
            .insertAdjacentHTML("beforeend",
                scoreboardTemplate
                    .replace(new RegExp(/\{0\}/, "g"), ++scoreboardCount)
                    .replace("{1}", teamName)
                    .replace("{2}", score ? score : 0)
            );

        teamInput.value = "";
        teams[teamName] = scoreboardCount;
        
        const scoreInput = document.getElementById("score{0}".replace("{0}", scoreboardCount));
        let setScore = score;
        scoreInput.addEventListener("keypress", (evt) => {
            if (evt.key === "Enter") {
                setScore = parseInt(evt.target.value, 10);
                setScore = isNaN(setScore) ? 0 : setScore;
                evt.target.blur();
            }
        });

        scoreInput.addEventListener("blur", (evt) => {
            commsSvc.saveScore(teamName, setScore);
        });
    };

    const UpdateTeamsForBuzzerUp = (teamName, player) => {

        // it's not even the same team that currently buzzes
        if (!teamBuzzedBy[teamName]) return false;

        let currentPlayerIndex = teamBuzzedBy[teamName].indexOf(player);

        if (currentPlayerIndex > -1) {
            teamBuzzedBy[teamName].splice(currentPlayerIndex, 1);

            if (teamBuzzedBy[teamName].length === 0) {
                buzzedTeam = null;
                return true;
            }
        }

        return false;
    };

    commsSvc.subscribeTeamAdded(teamAdded);

    document.getElementById("add-team").addEventListener("click", () => {
        addTeam();
    });

    document.getElementById("team-name").addEventListener("keypress", (evt) => {
        if (evt.key === "Enter") {
            addTeam();
        }
    });

    commsSvc.subscribeBuzzerDown((teamName, player) => {
        if (!buzzedTeam || buzzedTeam === teamName) {
            buzzedTeam = teamName;
            setTeamBuzzedBy(teamName, player);
            document.getElementsByClassName(`team${teams[teamName]}`)[0].classList.add("buzzed");
            commsSvc.setWinner(teamName, player);
        } else {
            setTeamBuzzedLateBy(teamName, player);
            document.getElementsByClassName(`team${teams[teamName]}`)[0].classList.add("too-late");
        }
    });

    commsSvc.subscribeBuzzerUp((teamName, player) => {
        if (UpdateTeamsForBuzzerUp(teamName, player)) {
            removeTeamBuzzedBy(teamName, player);
            document.getElementsByClassName(`team${teams[teamName]}`)[0].classList.remove("buzzed");
        } else {
            document.getElementsByClassName(`team${teams[teamName]}`)[0].classList.remove("too-late");
            removeTeamBuzzedLateBy(teamName, player);
        }
    });

    commsSvc.addGameMaster(window.userToken);

}