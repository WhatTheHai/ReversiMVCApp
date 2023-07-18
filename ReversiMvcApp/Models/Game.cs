using System.ComponentModel.DataAnnotations.Schema;
using ReversiRestApi.Models.Enums;

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
        public Colour IsTurn { get; set; }
        //No need to check for finished, if the game is finished it won't appear on the list
        public GameStatus GameStatus => Player2Token == null ? GameStatus.Awaiting : GameStatus.Busy;
        public string TurnToken {
            get {
                return IsTurn switch {
                    Colour.White => Player1Token,
                    Colour.Black => Player2Token,
                    _ => null
                };
            }
        }
        public bool UpdatedScores { get; set; }
    }
}