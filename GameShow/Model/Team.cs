using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Model
{
    public class Team
    {
        public List<TeamMember> Members { get; } = new List<TeamMember>();

        public int Score { get; set; }

        public string Name { get; set; }
    }
}
