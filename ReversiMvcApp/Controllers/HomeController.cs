using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReversiMvcApp.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.VisualBasic.CompilerServices;
using ReversiMvcApp.Data;
using ReversiMvcApp.Helpers;
using ReversiMvcApp.Services;

namespace ReversiMvcApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ReversiDbContext _dbContext;
        private readonly ReversiAPIClient reversiAPIClient;

        public HomeController(ILogger<HomeController> logger, ReversiDbContext dbContext, ReversiAPIClient reversiAPIClient)
        {
            _logger = logger;
            _dbContext = dbContext;
            this.reversiAPIClient = reversiAPIClient;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            List<Game> userGames = new List<Game>();
            //Only do this when the user is logged in.
            if (User.Identity.IsAuthenticated) {
                var currentUserID = Utilities.GetCurrentUserID(User);
                var playerExists = Utilities.GetCurrentUserPlayer(User, _dbContext);
                if (playerExists == null) {
                    var createPlayer = new Player {
                        Guid = currentUserID,
                        Name = "New Player",
                        AmountWon = 0,
                        AmountDrawn = 0,
                        AmountLost = 0
                    };

                    _dbContext.Players.Add(createPlayer);
                    _dbContext.SaveChanges();
                }

                userGames = await reversiAPIClient.GetPlayerGames(currentUserID);
            }
            return View(userGames);
        }
        
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
