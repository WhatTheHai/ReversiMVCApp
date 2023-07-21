using System.ComponentModel.DataAnnotations.Schema;

namespace ReversiMvcApp.Models
{
    [NotMapped]
    public class PlayerRole
    {
        public string Guid { get; set; }

        public string Name { get; set; }

        public bool isModerator { get; set; }

        public bool isPlayer { get; set; }
    }
}
