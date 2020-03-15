import { CommunicationService } from "../../js/communicationService.js";
import { Scoreboard } from "./scoreboard.js";

class GameMaster extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            newTeamName: "",
            shouldShowQr: false,
            teams: {},
            winningTeam: "",
            losingTeam: ""
        };

        this.commsSvc = new CommunicationService();

        this.commsSvc.subscribeTeamAdded(this.onTeamAdded);

        this.commsSvc.subscribeSetWinner(team => {
            this.setState({ winningTeam: team.team });
        });
        this.commsSvc.subscribeReleaseWinner( _ => {
            this.setState({ winningTeam: "" });
        });
        this.commsSvc.subscribeSetLoser(team => {
            this.setState({ losingTeam: team.team });
        });
        this.commsSvc.subscribeReleaseLoser(_ => {
            this.setState({ losingTeam: "" });
        });
        this.commsSvc.subscribeOnConnected(() => {
            this.commsSvc.addGameMaster();
            this.commsSvc.getTeams();
        });
    }

    /**
     * Executed when SignalR successfully added a new team
     * @param {string} teamName - name of the team
     * @param {int} score - score of the team - It will be 0 unless it has been loaded from cache.
     */
    onTeamAdded = (teamName, score) => {
        console.log("GM component team added");
        let team = {
            name: teamName,
            score: score
        };

        this.setState(prev => {
            const teams = this.getTeamsClone(prev.teams);
            teams[team.name] = team;

            return { teams: teams };
        });
    };

    addTeam = () => {
        this.commsSvc.addTeam(this.state.newTeamName);
    }

    /**
     * Create a clone of the teams object, necessary for setting state
     * @param {object} prevTeams - Current teams object
     * @returns {object} cloned teams object
     */
    getTeamsClone = (prevTeams) => {
        let kvp = Object.keys(prevTeams).map(
            key => [prevTeams[key].name, prevTeams[key]]
        );

        return Object.fromEntries(kvp);
    }

    updateScore = (teamName, newScore) => {
        this.setState(prev => {
            const teams = this.getTeamsClone(prev.teams);
            teams[teamName].score = newScore;

            return { teams: teams };
        });

        this.commsSvc.saveScore(teamName, parseInt(newScore));
    };

    render() {
        return (
            <div>
                <div>
                    <input type="text" value={this.state.newTeamName} onChange={evt => this.setState({ newTeamName: evt.target.value })} placeholder="Team Name"/>
                    <button onClick={this.addTeam}>Add Team</button>
                    <button onClick={() => { this.setState(prevState => ({ shouldShowQr: !prevState.shouldShowQr })); }}>Toggle QR code</button>
                    <hr />
                    <div style={{ display: this.state.shouldShowQr ? "block" : "none" }}>
                        <img src="/image/qrCode" />
                    </div>
                </div>
                <Scoreboard teams={this.state.teams} winningTeam={this.state.winningTeam} losingTeam={this.state.losingTeam} scoreUpdateFunc={this.updateScore}/>
            </div>
        );
    }
}

ReactDOM.render(
    <GameMaster />,
    app
);