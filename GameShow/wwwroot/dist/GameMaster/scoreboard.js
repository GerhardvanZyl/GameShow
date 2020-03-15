import { TeamCard } from "./teamCard.js";

export var Scoreboard = function Scoreboard(props) {

    return React.createElement(
        "div",
        { id: "score-boards" },
        Object.keys(props.teams).map(function (teamName, index) {
            return React.createElement(TeamCard, Object.assign({}, props.teams[teamName], {
                index: index,
                scoreUpdateFunc: props.scoreUpdateFunc,
                isWinner: teamName === props.winningTeam,
                isLoser: teamName === props.losingTeam
            }));
        })
    );
};