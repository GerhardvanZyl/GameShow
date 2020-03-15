import { TeamCard } from "./teamCard.js";

export const Scoreboard = (props) => {

    return (
        <div id="score-boards">
            {Object.keys(props.teams).map((teamName, index) => (
                <TeamCard {...props.teams[teamName]}
                    index={index}
                    scoreUpdateFunc={props.scoreUpdateFunc}
                    isWinner={teamName === props.winningTeam}
                    isLoser={teamName === props.losingTeam}
                />
            ))}
        </div>
    );
};