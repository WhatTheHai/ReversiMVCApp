using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;
using ReversiMvcApp.Services;

namespace ReversiMvcApp.Controllers
{
    public class GameController : Controller
    {
        private readonly ReversiDbContext _dbContext;
        private readonly ReversiAPIClient reversiAPIClient;

        public GameController(ReversiDbContext dbContext, ReversiAPIClient reversiAPIClient)
        {
            _dbContext = dbContext;
            this.reversiAPIClient = reversiAPIClient;
        }

        // GET: Game
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var games = await reversiAPIClient.GetGamesAwaitingPlayers();
            return View(games);
        }

        // GET: Game/Details/{token}
        public async Task<IActionResult> Details(string token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var game = await reversiAPIClient.GetGame(token);

            return View(game);
        }

        // GET: Game/Create
        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Game/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Game game)
        {

            if (ModelState.IsValid)
            {
                try {
                    ClaimsPrincipal currentUser = this.User;
                    var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;
                    var player = _dbContext.Players.FirstOrDefault(p => p.Guid == currentUserID);
                    game.Player1Token = player.Guid;
                    var createGame = await reversiAPIClient.CreateGame(game);
                    if (!createGame) {
                        ModelState.AddModelError("", "Something went wrong while creating the game, try again?");
                        return View(game);
                    }
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex) {
                    ModelState.AddModelError("", "Something went wrong while creating the game, try again?");
                    Console.WriteLine(ex);
                }
            }
            return View(game);
        }

        // GET: Game/Edit/5
        public async Task<IActionResult> Edit(int? token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var game = await _dbContext.Game.FindAsync(token);
            if (game == null)
            {
                return NotFound();
            }
            return View(game);
        }

        // POST: Game/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int token, [Bind("ID,Description,Token,Player1Token,Player2Token")] Game game)
        {
            if (token != game.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _dbContext.Update(game);
                    await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GameExists(game.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(game);
        }

        // GET: Game/Delete/5
        public async Task<IActionResult> Delete(int? token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var game = await _dbContext.Game
                .FirstOrDefaultAsync(m => m.ID == token);
            if (game == null)
            {
                return NotFound();
            }

            return View(game);
        }

        // POST: Game/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int token)
        {
            var game = await _dbContext.Game.FindAsync(token);
            _dbContext.Game.Remove(game);
            await _dbContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GameExists(int id)
        {
            return _dbContext.Game.Any(e => e.ID == id);
        }
    }
}
