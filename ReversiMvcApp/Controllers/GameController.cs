﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Data;
using ReversiMvcApp.Helpers;
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
        public async Task<IActionResult> Index() {
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
        public async Task<IActionResult> Create()
        {
            if (await CheckPlayerGame()) {
                return RedirectToAction("Index", "Home");
            }
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
                    if (await CheckPlayerGame()) {
                        return RedirectToAction("Index", "Home");
                    }
                    var player = Utilities.GetCurrentUserPlayer(User, _dbContext);
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

        // GET: Game/Delete/{token}
        public async Task<IActionResult> Delete(string? token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var game = await reversiAPIClient.GetGame(token);
            if (game == null)
            {
                return NotFound();
            }

            return View(game);
        }

        // POST: Game/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string token)
        {
            try {
                var player = Utilities.GetCurrentUserPlayer(User, _dbContext);
                var playerToken = player.Guid;

                var result = await reversiAPIClient.RemoveGame(token, playerToken);

                if (result) {
                    return RedirectToAction(nameof(Index));
                }

                return BadRequest("Failed to delete the game, try again?");
            }
            catch (UnauthorizedAccessException ex) {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex) {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode:500, ex.Message);
            }
        }

        private bool GameExists(int id)
        {
            return _dbContext.Game.Any(e => e.ID == id);
        }

        private async Task<bool> CheckPlayerGame()
        {
            var player = Utilities.GetCurrentUserPlayer(User, _dbContext);
            var playerGame = await reversiAPIClient.GetPlayerGames(player.Guid);
            return playerGame != null && playerGame.Any();
        }
    }
}