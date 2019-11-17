using GameShow.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Services
{
    public interface IGameState
    {
        static IGameState Instance;

        void AddTeamMember(string teamName, string memberName, string connectionId);

        void AddTeam(string teamName);

        void LeaveTeam(string teamName, string memberName, string connectionId);

        void UpdateConnection(string teamName, string playerName, string connectionId);

        List<Team> GetTeams();

        void SetScore(string teamName, int score);
    }
}
