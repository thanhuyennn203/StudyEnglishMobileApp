using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyEnglishMobileAppAPIs.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyEnglishMobileAppAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelController : ControllerBase
    {
        private readonly StudyEnglishMobileAppContext _context;

        public LevelController(StudyEnglishMobileAppContext context)
        {
            _context = context;
        }

        // GET: api/Level
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
        {
            return await _context.Levels.ToListAsync();
        }

        // GET: api/Level/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Level>> GetLevel(int id)
        {
            var level = await _context.Levels.FindAsync(id);

            if (level == null)
            {
                return NotFound();
            }

            return level;
        }

        // POST: api/Level
        [HttpPost]
        public async Task<ActionResult<Level>> PostLevel(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLevel), new { id = level.Id }, level);
        }

        // PUT: api/Level/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLevel(int id, Level level)
        {
            if (id != level.Id)
            {
                return BadRequest();
            }

            _context.Entry(level).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Levels.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Level/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLevel(int id)
        {
            var level = await _context.Levels.FindAsync(id);
            if (level == null)
            {
                return NotFound();
            }

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("CheckAllTopicsCompletedInLevel")]
        public async Task<IActionResult> CheckAllTopicsCompletedInLevel(int userId, int levelId)
        {
            // Get all topic IDs in the given level
            var topicsInLevel = await _context.Topics
                .Where(t => t.LevelId == levelId)
                .ToListAsync();

            if (topicsInLevel == null || !topicsInLevel.Any())
                return NotFound("No topics found for this level.");

            // Get completed topics of the user
            var completedUserTopics = await _context.UserTopic
                .Where(ut => ut.UserId == userId && ut.Status == "Completed")
                .Include(ut => ut.Topic)
                .ToListAsync();

            var completedTopicsInLevel = completedUserTopics
                .Where(ut => ut.Topic.LevelId == levelId)
                .Select(ut => ut.Topic.Id)
                .ToList();

            // Check if all topics in level are completed
            bool allCompleted = topicsInLevel.All(t => completedTopicsInLevel.Contains(t.Id));

            if (allCompleted)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null && user.CurrentLevel <= levelId)
                {
                    user.CurrentLevel = levelId + 1;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { allCompleted });
        }

    }
}
