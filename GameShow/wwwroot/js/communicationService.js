"use strict";

class CommunicationService {

    _hubConnection;
    _teamAddedCallbacks = [];
    _buzzerDownCallbacks = [];
    _buzzerUpCallbacks = [];
    _onConnectedCallbacks = [];
    _clearCacheCallbacks = [];

    constructor() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl("/gameshow").build();

        this._hubConnection.start().then(() => {
            console.log("Hub connection started");

            this._onConnectedCallbacks.forEach((cb) => {
                cb();
            });
        });

        this._hubConnection.on("TeamAdded", (teamName, score) => {
            this._teamAddedCallbacks.forEach((cb) => {
                cb(teamName, score);
            });
        });

        this._hubConnection.on("BuzzerDown", (teamName, player) => {
            this._buzzerDownCallbacks.forEach((cb) => {
                cb(teamName, player);
            });
        });

        this._hubConnection.on("BuzzerUp", (teamName, player) => {
            this._buzzerUpCallbacks.forEach((cb) => {
                cb(teamName, player);
            });
        });
    }

    getTeams() {
        return this._hubConnection.invoke("GetTeams").catch((err) => {
            console.log("Error: ", err);
        });
    }

    addTeam(teamName) {
        this._hubConnection.invoke("AddTeam", teamName).catch((err) => {
            console.log("Error: ", err);
        });
    }

    saveName(team, player) {
        this._hubConnection.invoke("SaveName", team, player).catch((err) => {
            console.log("Error: ", err);
        });
    }

    buzzerDown() {
        this._hubConnection.invoke("BuzzerDown").catch((err) => {
            console.log("Error: ", err);
        });
    }

    buzzerUp() {
        this._hubConnection.invoke("BuzzerUp").catch((err) => {
            console.log("Error: ", err);
        });
    }

    saveScore(teamName, score) {
        this._hubConnection.invoke("SaveScore", teamName, score).catch((err) => {
            console.log("Error: ", err);
        });
    }

    subscribeTeamAdded(callback) {
        this._teamAddedCallbacks.push(callback);
    }

    subscribeBuzzerDown(callback) {
        this._buzzerDownCallbacks.push(callback);
    }

    subscribeBuzzerUp(callback) {
        this._buzzerUpCallbacks.push(callback);
    }

    subscribeOnConnected(callback) {
        this._onConnectedCallbacks.push(callback);
    }

    subscribeClearCache(callback) {
        this._clearCacheCallbacks.push(callback);
    }

    updateConnectionFor(teamName, playerName) {
        this._hubConnection.invoke("UpdateConnectionInfo", teamName, playerName).catch((err) => {
            console.log("Error: ", err);
        });
    }

    addGameMaster(userToken) {
        // TODO: User token should validate that it is the correct game master page
        //this._hubConnection.invoke("AddGameMaster", userToken).catch((err) => {
        //    console.log("Error: ", err);
        //});
    }
}
