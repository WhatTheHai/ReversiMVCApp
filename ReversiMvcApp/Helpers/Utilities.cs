using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Helpers
{
    public class Utilities
    {
        public static string? GetCurrentUserID(ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            return claim?.Value;
        }
        public static Player GetCurrentUserPlayer(ClaimsPrincipal user, ReversiDbContext dbContext) {
            var currentUserID = GetCurrentUserID(user);
            var player = dbContext.Players.FirstOrDefault(p => p.Guid == currentUserID);
            return player;
        }

        public static async Task<bool> CreateRoleIfNotExistsAsync(RoleManager<IdentityRole> roleManager, string roleName) {
            if (!await roleManager.RoleExistsAsync(roleName)) {
                var result = await roleManager.CreateAsync(new IdentityRole(roleName));
                return result.Succeeded;
            }
            return false;
        }
    }
}
