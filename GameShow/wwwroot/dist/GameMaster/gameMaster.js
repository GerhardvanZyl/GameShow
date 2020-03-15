var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { CommunicationService } from "../../js/communicationService.js";
import { Scoreboard } from "./scoreboard.js";

var GameMaster = function (_React$Component) {
    _inherits(GameMaster, _React$Component);

    function GameMaster(props) {
        _classCallCheck(this, GameMaster);

        var _this = _possibleConstructorReturn(this, (GameMaster.__proto__ || Object.getPrototypeOf(GameMaster)).call(this, props));

        _this.onTeamAdded = function (teamName, score) {
            console.log("GM component team added");
            var team = {
                name: teamName,
                score: score
            };

            _this.setState(function (prev) {
                var teams = _this.getTeamsClone(prev.teams);
                teams[team.name] = team;

                return { teams: teams };
            });
        };

        _this.addTeam = function () {
            _this.commsSvc.addTeam(_this.state.newTeamName);
        };

        _this.getTeamsClone = function (prevTeams) {
            var kvp = Object.keys(prevTeams).map(function (key) {
                return [prevTeams[key].name, prevTeams[key]];
            });

            return Object.fromEntries(kvp);
        };

        _this.updateScore = function (teamName, newScore) {
            _this.setState(function (prev) {
                var teams = _this.getTeamsClone(prev.teams);
                teams[teamName].score = newScore;

                return { teams: teams };
            });

            _this.commsSvc.saveScore(teamName, parseInt(newScore));
        };

        _this.state = {
            newTeamName: "",
            shouldShowQr: false,
            teams: {},
            winningTeam: "",
            losingTeam: ""
        };

        _this.commsSvc = new CommunicationService();

        _this.commsSvc.subscribeTeamAdded(_this.onTeamAdded);

        _this.commsSvc.subscribeSetWinner(function (team) {
            _this.setState({ winningTeam: team.team });
        });
        _this.commsSvc.subscribeReleaseWinner(function (_) {
            _this.setState({ winningTeam: "" });
        });
        _this.commsSvc.subscribeSetLoser(function (team) {
            _this.setState({ losingTeam: team.team });
        });
        _this.commsSvc.subscribeReleaseLoser(function (_) {
            _this.setState({ losingTeam: "" });
        });
        _this.commsSvc.subscribeOnConnected(function () {
            _this.commsSvc.addGameMaster();
            _this.commsSvc.getTeams();
        });
        return _this;
    }

    /**
     * Executed when SignalR successfully added a new team
     * @param {string} teamName - name of the team
     * @param {int} score - score of the team - It will be 0 unless it has been loaded from cache.
     */


    /**
     * Create a clone of the teams object, necessary for setting state
     * @param {object} prevTeams - Current teams object
     * @returns {object} cloned teams object
     */


    _createClass(GameMaster, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { type: "text", value: this.state.newTeamName, onChange: function onChange(evt) {
                            return _this2.setState({ newTeamName: evt.target.value });
                        }, placeholder: "Team Name" }),
                    React.createElement(
                        "button",
                        { onClick: this.addTeam },
                        "Add Team"
                    ),
                    React.createElement(
                        "button",
                        { onClick: function onClick() {
                                _this2.setState(function (prevState) {
                                    return { shouldShowQr: !prevState.shouldShowQr };
                                });
                            } },
                        "Toggle QR code"
                    ),
                    React.createElement("hr", null),
                    React.createElement(
                        "div",
                        { style: { display: this.state.shouldShowQr ? "block" : "none" } },
                        React.createElement("img", { src: "/image/qrCode" })
                    )
                ),
                React.createElement(Scoreboard, { teams: this.state.teams, winningTeam: this.state.winningTeam, losingTeam: this.state.losingTeam, scoreUpdateFunc: this.updateScore })
            );
        }
    }]);

    return GameMaster;
}(React.Component);

ReactDOM.render(React.createElement(GameMaster, null), app);