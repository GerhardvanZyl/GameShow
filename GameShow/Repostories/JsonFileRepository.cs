using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GameShow.Model;
using Newtonsoft.Json;

namespace GameShow.Repositories
{
    public class JsonFileRepository : ISessionRepository
    {
        private string filepath = @".\GameShowSession.json";

        public Dictionary<string, Team> LoadSession()
        {
            string sessionJson = File.ReadAllText(filepath);
            return JsonConvert.DeserializeObject<Dictionary<string, Team>>(sessionJson) as Dictionary<string, Team>;
        }

        public void SaveSession(Dictionary<string, Team> session)
        {
            string json = JsonConvert.SerializeObject(session);
            File.WriteAllText(filepath, json);
        }

        public bool SavedSessionExists()
        {
            return File.Exists(filepath);
        }
    }
}
