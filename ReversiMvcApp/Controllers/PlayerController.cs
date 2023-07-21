using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Controllers
{
    public class PlayerController : Controller
    {
        private readonly ReversiDbContext _context;

        public PlayerController(ReversiDbContext context)
        {
            _context = context;
        }

        // GET: Player
        public async Task<IActionResult> Index()
        {
            return View(await _context.Players.ToListAsync());
        }

        // GET: Player/Details/{token}
        public async Task<IActionResult> Details(string? token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var player = await _context.Players
                .FirstOrDefaultAsync(m => m.Guid == token);
            if (player == null)
            {
                return NotFound();
            }

            return View(player);
        }

        // GET: Player/Create
        [Authorize(Roles = "Moderator, Administrator")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Player/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Moderator, Administrator")]
        public async Task<IActionResult> Create([Bind("Guid,Name,AmountWon,AmountLost,AmountDrawn")] Player player)
        {
            if (ModelState.IsValid) {
                player.Guid = Guid.NewGuid().ToString();
                _context.Add(player);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(player);
        }

        // GET: Player/Edit/{token}
        [Authorize(Roles = "Moderator, Administrator")]
        public async Task<IActionResult> Edit(string? token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var player = await _context.Players.FindAsync(token);
            if (player == null)
            {
                return NotFound();
            }
            return View(player);
        }

        // POST: Player/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string token, [Bind("Guid,Name,AmountWon,AmountLost,AmountDrawn")] Player player)
        {
            if (token != player.Guid)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(player);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlayerExists(player.Guid))
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
            return View(player);
        }

        [Authorize(Roles = "Moderator, Administrator")]
        // GET: Player/Delete/{token}
        public async Task<IActionResult> Delete(string token)
        {
            if (token == null)
            {
                return NotFound();
            }

            var player = await _context.Players
                .FirstOrDefaultAsync(m => m.Guid == token);
            if (player == null)
            {
                return NotFound();
            }

            return View(player);
        }

        // POST: Player/Delete/{token}
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string token)
        {
            var player = await _context.Players.FindAsync(token);
            _context.Players.Remove(player);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlayerExists(string id)
        {
            return _context.Players.Any(e => e.Guid == id);
        }
    }
}
