using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReversiMvcApp.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ReversiMvcApp.Data;

namespace ReversiMvcApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ReversiDbContext _dbContext;

        public HomeController(ILogger<HomeController> logger, ReversiDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public IActionResult Index()
        {
            //Only do this when the user is logged in.
            if (User.Identity.IsAuthenticated) {
                ClaimsPrincipal currentUser = this.User;

                var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;
                var playerExists = _dbContext.Players.FirstOrDefault(p => p.Guid ==  currentUserID);

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
            }
            return View();
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
