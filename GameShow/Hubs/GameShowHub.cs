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

        public async Task BuzzerDown()
        {
            await Clients.All.SendAsync("BuzzerDown", Context.Items["Team"], Context.Items["Name"]);
        }

        public async Task BuzzerUp()
        {
            await Clients.All.SendAsync("BuzzerUp", Context.Items["Team"], Context.Items["Name"]);
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


        public void UpdateConnectionInfo(string team, string player)
        {
            try
            {
                _state.UpdateConnection(team, player, Context.ConnectionId);
                SetContextItems(team, player);
            }
            catch (Exception)
            {
                Clients.Caller.SendAsync("ClearCache");
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

        public void AddGameMaster(string userToken)
        {
            // TODO: User token should validate that it is the correct game master page

        }

        public void GetTeams()
        {
            var teams = _state.GetTeams();

            foreach(Team team in teams)
            {
                // just spam it, no waiting.
                // Yes, we should send a list...
                Clients.Caller.SendAsync("TeamAdded", team.Name, team.Score);
            }
        }
    }
}
