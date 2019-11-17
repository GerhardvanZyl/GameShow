using GameShow.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Repositories
{
    public interface ISessionRepository
    {
        void SaveSession(Dictionary<string, Team> teams);

        Dictionary<string, Team> LoadSession();

        bool SavedSessionExists();
    }
}
