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
        // GET: api/Topic
        [HttpGet("all-topics")]
        public async Task<ActionResult<IEnumerable<Topic>>> GetTopics()
        {
            return await _context.Topics.ToListAsync();
        }

        [HttpGet("check-complete")]
        public IActionResult CheckTopicCompleted(int userId, int topicId)
        {
            var totalWords = _context.Words.Count(w => w.TopicId == topicId);

            var learnedWords = _context.WordLearning
                .Where(wl => wl.UserId == userId && wl.Status == "Finished" && wl.Word.TopicId == topicId)
                .Count();

            bool isCompleted = totalWords > 0 && learnedWords == totalWords;

            if (isCompleted)
            {
                // Check if already exists to avoid duplicates
                var alreadyExists = _context.UserTopic
                    .Any(ut => ut.UserId == userId && ut.TopicId == topicId);

                if (!alreadyExists)
                {
                    var completedTopic = new UserTopic
                    {
                        UserId = userId,
                        TopicId = topicId,
                        Status = "Completed" // Or whatever status value you prefer
                    };

                    _context.UserTopic.Add(completedTopic);
                    _context.SaveChanges();
                }
            }

            return Ok(new { isCompleted });
        }



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
                return NoContent();

            // Return only the Topic objects
            var completedTopics = completedUserTopics.Where(t => t.Status == "Completed").Select(ut => ut.Topic).ToList();

            return completedTopics;
        }



        // POST: api/Topic
        [HttpPost]
        public async Task<ActionResult<Topic>> Topic([FromBody] NewTopic newTopic)
        {
            // Model validation
            if (newTopic == null)
            {
                return BadRequest(new { error = "No topic data received." });
            }
            if (string.IsNullOrWhiteSpace(newTopic.Title))
            {
                return BadRequest(new { error = "Title is required." });
            }
            
            if (newTopic.WordNumber <= 0)
            {
                return BadRequest(new { error = "WordNumber must be a positive integer." });
            }
            try
            {
                Topic topic = new Topic();
                topic.Title = newTopic.Title;
                topic.WordNumber = newTopic.WordNumber;
                topic.LevelId = newTopic.LevelId;
                _context.Topics.Add(topic);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

  	        [HttpPut("{id}")]
            public async Task<IActionResult> PutTopic(int id, [FromBody] EditTopic edittopic)
            {

            Console.WriteLine(id);
            var existing = await _context.Topics.FindAsync(id);
            if (existing == null)
            {
                return NotFound(new { error = "Topic not found." });
            }

            existing.Title = edittopic.Title;
            existing.LevelId = edittopic.LevelId;
            existing.WordNumber = edittopic.WordNumber;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }



    }
}
public class NewTopic
{
    public string Title { get; set; }
    public int LevelId { get; set; }
    public int WordNumber { get; set; }

}

public class EditTopic
{
    public string Title { get; set; }
    public int LevelId { get; set; }
    public int WordNumber { get; set; }
}
