using GameShow.Model;
using GameShow.Repositories;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Services
{
    public class GameStateService : IGameState
    {
        private static GameStateService _instance;
        private ISessionRepository _repo;
        public static GameStateService Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new GameStateService();
                }

                return _instance;
            }
        }

        private Dictionary<string, Team> Teams { get; set; } = new Dictionary<string, Team>();

        private GameStateService() 
        {
            _repo = new JsonFileRepository();

            if (_repo.SavedSessionExists())
            {
                Teams = _repo.LoadSession();
            }
        }

        public void AddTeamMember(string teamName, string playerName, string connectionId)
        {
            Teams[teamName]
                .Members
                .Add(new TeamMember()
                {
                    Name = playerName,
                    ConnectionId = connectionId
                });

            _repo.SaveSession(Teams);
        }

        public void AddTeam(string teamName)
        {

            Teams.Add(teamName, new Team() { Name = teamName});
            _repo.SaveSession(Teams);
        }

        //public void LeaveTeam(string playerName, string teamName, string connectionId)
        //{
        //    foreach (var team in Teams)
        //    {
        //        bool wasFound = team.Value.Members.Remove(
        //            team.Value.Members.Single(member => member.ConnectionId == connectionId)
        //            );

        //        if (wasFound) break;
        //    }

        //    _repo.SaveSession(Teams);
        //}

        public void SetScore(string teamName, int score)
        {
            Teams[teamName].Score = score;
            _repo.SaveSession(Teams);
        }

        public void UpdateConnection(string teamName, string playerName, string connectionId)
        {
            // No exception handling. Quick way to just see if we cant update and then clear the cache client side.
            var teamMember = Teams[teamName].Members.Single(player => player.Name == playerName);
            teamMember.ConnectionId = connectionId;

            _repo.SaveSession(Teams);
        }

        public List<Team> GetTeams()
        {
            return Teams.Values.ToList<Team>();
        }

        public string? GetConnectionId(string teamName, string player)
        {
            foreach (var team in Teams)
            {
                var teamMembers = team.Value.Members.Where(
                    member => member.Name == player
                    );

                var teamMember = teamMembers.Count() > 0 ? teamMembers.First() : null;

                if (teamMember != null)
                {
                    return teamMember.ConnectionId;
                }
            }

            return null;
        }
    }
}
