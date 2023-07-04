using System.Linq;
using System.Security.Claims;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Helpers
{
    public class Utilities
    {
        public static string GetCurrentUserID(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier).Value;
        }
        public static Player GetCurrentUserPlayer(ClaimsPrincipal user, ReversiDbContext dbContext) {
            var currentUserID = GetCurrentUserID(user);
            var player = dbContext.Players.FirstOrDefault(p => p.Guid == currentUserID);
            return player;
        }

    }
}
