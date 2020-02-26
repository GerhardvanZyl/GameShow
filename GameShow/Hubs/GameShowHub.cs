using GameShow.Model;
using GameShow.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Hubs
{
    public class GameShowHub : Hub
    {
        private IGameState _state;

        public GameShowHub()
        {
            // Should use dotnet core's dependency injection
            _state = GameStateService.Instance;

        }

        public override Task OnConnectedAsync()
        {
            Context.Items.Add("UserId", Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        /// <summary>
        /// A player has pressed the buzzer
        /// </summary>
        /// <returns></returns>
        public async Task BuzzerDown()
        {
            var team = Context.Items["Team"].ToString();
            
            var isWinner = _state.TryBuzz(team);
            await SendToGameMaster(new Message() 
            { 
                Type = isWinner ? MessageType.WinnerBuzz : MessageType.LoserBuzz, 
            });
        }

        /// <summary>
        /// A player has released the buzzer
        /// </summary>
        /// <returns></returns>
        public async Task BuzzerUp()
        {
            var team = Context.Items["Team"].ToString();

            var isWinner = _state.ReleaseBuzzer(team);
            await SendToGameMaster(new Message()
            {
                Type = isWinner ? MessageType.WinnerUp : MessageType.LoserUp
            });
        }

        public async Task SaveName(string team, string player)
        {
            _state.AddTeamMember(team, player, Context.ConnectionId);
            SetContextItems(team, player);
            await Clients.All.SendAsync("ReceiveMessage", team, player);
        }

        private void SetContextItems(string team, string player)
        {
            if (Context.Items.ContainsKey("Name"))
            {
                Context.Items["Name"] = player;
            }
            else
            {
                Context.Items.Add("Name", player);
            }

            if (Context.Items.ContainsKey("Team"))
            {
                Context.Items["Team"] = team;
            }
            else
            {
                Context.Items.Add("Team", team);
            }
        }


        public async Task UpdateConnectionInfo(string team, string player)
        {
            try
            {
                _state.UpdateConnection(team, player, Context.ConnectionId);
                SetContextItems(team, player);
            }
            catch (Exception)
            {
                await Clients.Caller.SendAsync("ClearCache");
            }
        }

        public void SaveScore(string team, int score)
        {
            _state.SetScore(team, score);
        }

        public void LeaveTeam()
        {
            //_state.LeaveTeam();
        }

        public async Task AddTeam(string teamName)
        {
            _state.AddTeam(teamName);
            await Clients.All.SendAsync("TeamAdded", teamName, 0);
        }

        public void AddGameMaster()
        {
            _state.SetGameMasterConnectionId(Context.ConnectionId);
        }

        //public async Task SetWinner(string teamName, string player) 
        //{
        //    string connectionId = _state.GetConnectionId(teamName, player);
        //}

        public async Task GetTeams()
        {
            var teams = _state.GetTeams();

            foreach(Team team in teams)
            {
                // just spam it, no waiting.
                // Yes, we should send a list...
                await Clients.Caller.SendAsync("TeamAdded", team.Name, team.Score);
            }
        }

        private async Task SendToGameMaster(Message m)
        {
            var mcid = _state.GetGameMasterConnectionId();

            m.Team = Context.Items["Team"].ToString();
            m.Player = Context.Items["Name"].ToString();

            await Clients.Client(mcid).SendAsync(m.Type.ToString(), m);
        }
    }
}
