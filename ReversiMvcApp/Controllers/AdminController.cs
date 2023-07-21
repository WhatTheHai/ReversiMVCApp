using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Controllers
{
    [Authorize(Roles = "Moderator, Administrator")]
    public class AdminController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;


        public AdminController(UserManager<IdentityUser> userManager) {
            _userManager = userManager;
        }

        // GET: AdminController
        public ActionResult Index()
        {
            List<PlayerRole> playerRoles = new List<PlayerRole>();
            foreach (var user in _userManager.Users) {
                var playerRole = new PlayerRole() {
                    Name = user.UserName,
                    Guid = user.Id,
                    isModerator = _userManager.IsInRoleAsync(user, "Moderator").Result,
                    isPlayer = !_userManager.IsInRoleAsync(user, "Player").Result
                };
                playerRoles.Add(playerRole);
            }
            return View(playerRoles);
        }

        public IActionResult EditPlayerRole(string token) {
            var user = _userManager.FindByIdAsync(token).Result;
            var playerRole = new PlayerRole() {
                Name = user.UserName,
                Guid = user.Id,
                isModerator = _userManager.IsInRoleAsync(user, "Moderator").Result,
                isPlayer = _userManager.IsInRoleAsync(user, "Player").Result
            };
            return View(playerRole);
        }

        public IActionResult EditModeratorRole(string token) {
            var user = _userManager.FindByIdAsync(token).Result;
            var playerRole = new PlayerRole() {
                Name = user.UserName,
                Guid = user.Id,
                isModerator = _userManager.IsInRoleAsync(user, "Moderator").Result,
                isPlayer = _userManager.IsInRoleAsync(user, "Player").Result
            };
            return View(playerRole);
        }

        public async Task<IActionResult> ConfirmChangeRoleASync([FromForm] PlayerRole playerRole, string typeRole) {
            if (ModelState.IsValid) {
                var targetUser = await _userManager.FindByIdAsync(playerRole.Guid);

                if (targetUser == null) {
                    return NotFound();
                }

                if (typeRole == "Moderator")
                {
                    var currentUser = await _userManager.GetUserAsync(User);
                    if (!await _userManager.IsInRoleAsync(currentUser, "Administrator"))
                    {
                        return Forbid();
                    }
                }

                if (await _userManager.IsInRoleAsync(targetUser, typeRole)) {
                    await _userManager.RemoveFromRoleAsync(targetUser, typeRole);
                }
                else {
                    await _userManager.AddToRoleAsync(targetUser, typeRole);
                }
            }
            return RedirectToAction("Index");
        }
    }
}
