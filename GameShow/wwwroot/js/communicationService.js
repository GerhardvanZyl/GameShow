'use strict';

class CommunicationService {

    _hubConnection;
    _teamAddedCallbacks = [];
    _buzzerDownCallbacks = [];
    _buzzerUpCallbacks = [];
    _onConnectedCallbacks = [];
    _clearCacheCallbacks = [];
    _isWinnerStartCallbacks = [];
    _isWinnerEndCallbacks = [];
    _setWinnerCallbacks = [];
    _releaseWinnerCallbacks = [];
    _setLoserCallbacks = [];
    _releaseLoserCallbacks = [];

    constructor() {
        this._hubConnection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl('/gameshow').build();

        this._hubConnection.start().then(() => {
            console.log('Hub connection started');

            this._onConnectedCallbacks.forEach((cb) => {
                cb();
            });
        });

        this.on('TeamAdded').execute(this._teamAddedCallbacks);
        this.on('WinnerBuzz').execute(this._setWinnerCallbacks);
        this.on('ClearCache').execute(this._clearCacheCallbacks);
        this.on('WinnerUp').execute(this._releaseWinnerCallbacks);
        this.on('LoserBuzz').execute(this._setLoserCallbacks);
        this.on('LoserUp').execute(this._releaseLoserCallbacks);

    }

    on(method) {
        return {
            execute: (callbacks) => {
                this._hubConnection.on(method, (teamName, player) => {
                    callbacks.forEach((cb) => {
                        cb(teamName, player);
                    });
                });
            }
        };
    }

    invoke(method, team, player, score) {
        // There has to be a better way to do this
        if (!team) {
            return this._hubConnection.invoke(method).catch((err) => {
                console.log('Error: ', err);
            });
        } else if (!player) {
            return this._hubConnection.invoke(method, team).catch((err) => {
                console.log('Error: ', err);
            });
        } else if (!score) {
            return this._hubConnection.invoke(method, team, player).catch((err) => {
                console.log('Error: ', err);
            });
        } else {
            return this._hubConnection.invoke(method, team, player, score).catch((err) => {
                console.log('Error: ', err);
            });
        }
    }

    getTeams() {
        return this.invoke('GetTeams');
    }

    addTeam(teamName) {
        this.invoke('AddTeam', teamName);
    }

    saveName(team, player) {
        this.invoke('SaveName', team, player);
    }

    buzzerDown() {
        this.invoke('BuzzerDown');
    }

    buzzerUp() {
        this.invoke('BuzzerUp');
    }

    saveScore(teamName, score) {
        this.invoke('SaveScore', teamName, score);
    }

    /**
     * Player subscriptions
     */

    // For player
    subscribeTeamAdded(callback) {
        this._teamAddedCallbacks.push(callback);
    }

    // For player
    subscribeOnConnected(callback) {
        this._onConnectedCallbacks.push(callback);
    }

    // For player
    subscribeClearCache(callback) {
        this._clearCacheCallbacks.push(callback);
    }

    // For player
    subscribeIsWinnerStart(callback) {
        this._isWinnerStartCallbacks.push(callback);
    }

    // For player
    subscribeIsWinnerEnd(callback) {
        this._isWinnerEndCallbacks.push(callback);
    }

    /**
    * Game Master subscriptions
    */

    // For GM
    subscribeSetWinner(callback) {
        this._setWinnerCallbacks.push(callback);
    }

    // For GM
    subscribeReleaseWinner(callback) {
        this._releaseWinnerCallbacks.push(callback);
    }

    // For GM
    subscribeSetLoser(callback) {
        this._setLoserCallbacks.push(callback);
    }

    // For GM
    subscribeReleaseLoser(callback) {
        this._releaseLoserCallbacks.push(callback);
    }

    updateConnectionFor(teamName, playerName) {
        this._hubConnection.invoke('UpdateConnectionInfo', teamName, playerName).catch((err) => {
            console.log('Error: ', err);
        });
    }

    addGameMaster() {
        // TODO: User token should validate that it is the correct game master page
        this._hubConnection.invoke("AddGameMaster").catch((err) => {
            console.log("Error: ", err);
        });
    }
}
