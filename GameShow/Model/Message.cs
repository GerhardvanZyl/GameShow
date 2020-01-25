using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameShow.Model
{
    public class Message
    {
        public MessageType Type { get; set; }
        public string Team { get; set; }

        public string Player { get; set; }
    }
}
