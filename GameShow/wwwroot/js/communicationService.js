"use strict";

let _hubConnection;
let _teamAddedCallbacks = [];
let _buzzerDownCallbacks = [];
let _buzzerUpCallbacks = [];
let _onConnectedCallbacks = [];
let _clearCacheCallbacks = [];
let _isWinnerStartCallbacks = [];
let _isWinnerEndCallbacks = [];

class CommunicationService {

    constructor() {
        _hubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl("/gameshow").build();

        _hubConnection.start().then(() => {
            console.log("Hub connection started");

            _onConnectedCallbacks.forEach((cb) => {
                cb();
            });
        });

        _hubConnection.on("TeamAdded", (teamName, score) => {
            _teamAddedCallbacks.forEach((cb) => {
                cb(teamName, score);
            });
        });

        _hubConnection.on("BuzzerDown", (teamName, player) => {
            _buzzerDownCallbacks.forEach((cb) => {
                cb(teamName, player);
            });
        });

        _hubConnection.on("BuzzerUp", (teamName, player) => {
            _buzzerUpCallbacks.forEach((cb) => {
                cb(teamName, player);
            });
        });

        _hubConnection.on("IsWinner", () => {
            _isWinnerStartCallbacks.forEach((cb) => {
                cb();
            });
        });

        _hubConnection.on("ClearCache", () => {
            _clearCacheCallbacks.forEach((cb) => {
                cb();
            });
        });
    }

    getTeams() {
        return _hubConnection.invoke("GetTeams").catch((err) => {
            console.log("Error: ", err);
        });
    }

    addTeam(teamName) {
        _hubConnection.invoke("AddTeam", teamName).catch((err) => {
            console.log("Error: ", err);
        });
    }

    saveName(team, player) {
        _hubConnection.invoke("SaveName", team, player).catch((err) => {
            console.log("Error: ", err);
        });
    }

    buzzerDown() {
        _hubConnection.invoke("BuzzerDown").catch((err) => {
            console.log("Error: ", err);
        });
    }

    buzzerUp() {
        _hubConnection.invoke("BuzzerUp").catch((err) => {
            console.log("Error: ", err);
        });
    }

    saveScore(teamName, score) {
        _hubConnection.invoke("SaveScore", teamName, score).catch((err) => {
            console.log("Error: ", err);
        });
    }

    setWinner(teamName, player) {
        _hubConnection.invoke("SetWinner", teamName, player).catch((err) => {
            console.log("Error: ", err);
        });
    }

    subscribeTeamAdded(callback) {
        _teamAddedCallbacks.push(callback);
    }

    subscribeBuzzerDown(callback) {
        _buzzerDownCallbacks.push(callback);
    }

    subscribeBuzzerUp(callback) {
        _buzzerUpCallbacks.push(callback);
    }

    subscribeOnConnected(callback) {
        _onConnectedCallbacks.push(callback);
    }

    subscribeClearCache(callback) {
        _clearCacheCallbacks.push(callback);
    }

    subscribeIsWinnerStart(callback) {
        _isWinnerStartCallbacks.push(callback);
    }

    subscribeIsWinnerEnd(callback) {
        _isWinnerEndCallbacks.push(callback);
    }

    //subscribeSetWinner(callback) {
    //    _setWinnerCallbacks.push(callback);
    //}

    updateConnectionFor(teamName, playerName) {
        _hubConnection.invoke("UpdateConnectionInfo", teamName, playerName).catch((err) => {
            console.log("Error: ", err);
        });
    }

    addGameMaster(userToken) {
        // TODO: User token should validate that it is the correct game master page
        //_hubConnection.invoke("AddGameMaster", userToken).catch((err) => {
        //    console.log("Error: ", err);
        //});
    }
}
