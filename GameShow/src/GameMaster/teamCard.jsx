
export class TeamCard extends React.Component {

    /* This method is so far a copy and variable replace. It still needs to be properly reactified*/

    render() {
        return (
            <div>
                <div>
                    <span>
                        <h3>{this.props.name}:</h3>
                    </span>
                    <span>
                        <input type="text" value={this.props.score} onChange={(evt) => {
                            this.props.scoreUpdateFunc(this.props.name, evt.target.value);
                        }}/>
                    </span>
                </div>
                <div className={`score-card team${this.props.index} 
                        ${this.props.isWinner ? "buzzed" : ""} ${this.props.isLoser ? "too-late" : ""}`}
                />
                <div className="in-card">{this.props.name}</div>
                <div className="in-card">{this.props.score}</div>
            </div>
        );
    }
}