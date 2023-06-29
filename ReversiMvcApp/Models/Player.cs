using System;
using System.ComponentModel.DataAnnotations;

namespace ReversiMvcApp.Models
{
    public class Player
    {
        [Key]
        public string Guid { get; set; }

        public string Name { get; set; }

        public int AmountWon { get; set; }

        public int AmountLost { get; set; }

        public int AmountDrawn { get; set; }
    }
}
