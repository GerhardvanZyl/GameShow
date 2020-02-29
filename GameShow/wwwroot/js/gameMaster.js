
'use strict';

{
    let scoreboardCount = 0;
    const commsSvc = new CommunicationService();
    let teams = {};
    const scoreboardsContainer = document.getElementById('score-boards');
    const teamInput = document.getElementById('team-name');
    const scoreboardTemplate =
        `<div>
                <div>
                    <span>
                        <h3>{1}: </h3>
                    </span>
                    <span>
                        <input type='text' id='score{0}' value='{2}'/>
                     </span>
                </div>
                <div class='score-card team{0}' />
                <div class='name' id='team{0}-name' />                
                <div class='score' id='team{0}-score' contenteditable=true />
            </div>`;

    commsSvc.subscribeOnConnected(() => {
        commsSvc.addGameMaster();
        commsSvc.getTeams();
    });

    const addTeam = () => {
        // TODO: security
        const teamName = teamInput.value;
        console.log('team name');
        commsSvc.addTeam(teamName);
    };

    const teamAdded = (teamName, score) => {
        console.log("team added");
        scoreboardsContainer
            .insertAdjacentHTML('beforeend',
                scoreboardTemplate
                    .replace(new RegExp(/\{0\}/, "g"), ++scoreboardCount)
                    .replace(new RegExp(/\{1\}/, "g"), teamName)
                    .replace('{2}', score ? score : 0)
            );

        teamInput.value = '';
        teams[teamName] = scoreboardCount;
        
        const scoreInput = document.getElementById('score{0}'.replace('{0}', scoreboardCount));
        let setScore = score;
        scoreInput.addEventListener('keypress', (evt) => {
            if (evt.key === 'Enter') {
                setScore = parseInt(evt.target.value, 10);
                setScore = isNaN(setScore) ? 0 : setScore;
                evt.target.blur();
            }
        });

        scoreInput.addEventListener('blur', (evt) => {
            commsSvc.saveScore(teamName, setScore);
        });
    };

    commsSvc.subscribeTeamAdded(teamAdded);

    document.getElementById('add-team').addEventListener('click', () => {
        addTeam();
    });

    document.getElementById('team-name').addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') {
            addTeam();
        }
    });

    commsSvc.subscribeSetWinner((o) => {
        document.getElementsByClassName(`team${teams[o.team]}`)[0].classList.add('buzzed');
    });

    commsSvc.subscribeReleaseWinner((o) => {
        document.getElementsByClassName(`team${teams[o.team]}`)[0].classList.remove('buzzed');
    });

    commsSvc.subscribeSetLoser((o) => {
        document.getElementsByClassName(`team${teams[o.team]}`)[0].classList.add('too-late');
    });

    commsSvc.subscribeReleaseLoser((o) => {
        document.getElementsByClassName(`team${teams[o.team]}`)[0].classList.remove('too-late');
    });

    document.getElementById("toggle-qr").addEventListener("click", () => {
        let qrDiv = document.getElementById("qr");
        if (qrDiv.classList.contains("hidden")) {
            qrDiv.classList.remove("hidden");
        } else {
            qrDiv.classList.add("hidden");
        }
    });

    document.getElementById("clear-state").addEventListener("click", () => {
        alert("Not implemented");
    });
}