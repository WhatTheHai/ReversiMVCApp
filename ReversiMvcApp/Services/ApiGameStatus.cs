using ReversiRestApi.Models.Enums;

namespace ReversiMvcApp.Services
{
    public class ApiGameStatus {
        public GameStatus GameStatus { get; set; }
        public bool Finished { get; set; }
        public string Winner { get; set; }
        public string Loser { get; set; }
    }
}
