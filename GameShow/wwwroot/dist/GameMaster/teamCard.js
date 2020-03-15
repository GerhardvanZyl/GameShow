var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export var TeamCard = function (_React$Component) {
    _inherits(TeamCard, _React$Component);

    function TeamCard() {
        _classCallCheck(this, TeamCard);

        return _possibleConstructorReturn(this, (TeamCard.__proto__ || Object.getPrototypeOf(TeamCard)).apply(this, arguments));
    }

    _createClass(TeamCard, [{
        key: "render",


        /* This method is so far a copy and variable replace. It still needs to be properly reactified*/

        value: function render() {
            var _this2 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        null,
                        React.createElement(
                            "h3",
                            null,
                            this.props.name,
                            ":"
                        )
                    ),
                    React.createElement(
                        "span",
                        null,
                        React.createElement("input", { type: "text", value: this.props.score, onChange: function onChange(evt) {
                                _this2.props.scoreUpdateFunc(_this2.props.name, evt.target.value);
                            } })
                    )
                ),
                React.createElement("div", { className: "score-card team" + this.props.index + " \n                        " + (this.props.isWinner ? "buzzed" : "") + " " + (this.props.isLoser ? "too-late" : "")
                }),
                React.createElement(
                    "div",
                    { className: "in-card" },
                    this.props.name
                ),
                React.createElement(
                    "div",
                    { className: "in-card" },
                    this.props.score
                )
            );
        }
    }]);

    return TeamCard;
}(React.Component);