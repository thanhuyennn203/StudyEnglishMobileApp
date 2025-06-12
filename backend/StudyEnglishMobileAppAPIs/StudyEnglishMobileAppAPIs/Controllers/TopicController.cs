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
    public class TopicController : ControllerBase
    {
        private readonly StudyEnglishMobileAppContext _context;

        public TopicController(StudyEnglishMobileAppContext context)
        {
            _context = context;
        }

        //// GET: api/Topic
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Topic>>> GetTopics()
        //{
        //    return await _context.Topics.ToListAsync();
        //}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Topic>>> GetTopics([FromQuery] int? levelId)
        {
            if (levelId.HasValue)
            {
                return await _context.Topics
                    .Where(t => t.LevelId == levelId)
                    .ToListAsync();
            }

            return await _context.Topics.ToListAsync();
        }

        // GET: api/Topic/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Topic>> GetTopic(int id)
        {
            var topic = await _context.Topics.FindAsync(id);

            if (topic == null)
            {
                return NotFound();
            }

            return topic;
        }

        // POST: api/Topic
        [HttpPost]
        public async Task<ActionResult<Topic>> PostTopic(Topic topic)
        {
            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
        }

        // PUT: api/Topic/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTopic(int id, Topic topic)
        {
            if (id != topic.Id)
            {
                return BadRequest();
            }

            _context.Entry(topic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Topics.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Topic/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
            {
                return NotFound();
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Topic/CompletedByUser/3
        [HttpGet("CompletedByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<Topic>>> GetCompletedTopicsByUser(int userId)
        {
            var completedUserTopics = await _context.UserTopic
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Topic)
                .ToListAsync();

            if (completedUserTopics == null || !completedUserTopics.Any())
                return NotFound();

            // Return only the Topic objects
            var completedTopics = completedUserTopics.Where(t => t.Status == "Finished").Select(ut => ut.Topic).ToList();

            return completedTopics;
        }


    }
}
