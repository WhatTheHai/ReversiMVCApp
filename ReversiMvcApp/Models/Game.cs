namespace ReversiMvcApp.Models {
    public class Game {
        public int ID { get; set; }
        public string Description { get; set; }
        public string Token { get; set; }
        public string? Player1Token { get; set; }
        public string? Player2Token { get; set; }
        public string Finished { get; set; }
        public string Winner { get; set; }
        public string Loser { get; set; }
    }
}