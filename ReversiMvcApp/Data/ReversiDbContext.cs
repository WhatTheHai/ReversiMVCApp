using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Data
{
    public class ReversiDbContext : DbContext
    {
        public ReversiDbContext(DbContextOptions<ReversiDbContext> options) : base(options) { }
        
        public DbSet<Player> Players { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=reversiDb.db");
        }
    }
}
