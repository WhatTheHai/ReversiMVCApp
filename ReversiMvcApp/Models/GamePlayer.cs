namespace ReversiMvcApp.Models
{
    public class GamePlayer
    {
        public string GameToken { get; set; }
        public bool IsScoreUpdated { get; set; } = false;
    }
}
