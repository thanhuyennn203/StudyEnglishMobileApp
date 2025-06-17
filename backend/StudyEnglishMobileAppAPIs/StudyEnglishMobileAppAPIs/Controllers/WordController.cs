using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyEnglishMobileAppAPIs.Models;
using System.Collections.Generic;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class WordsController : ControllerBase
{
    private readonly StudyEnglishMobileAppContext _context;

    public WordsController(StudyEnglishMobileAppContext context)
    {
        _context = context;
    }

// DTOs for create and update
    public class CreateWordDto {
        public int? TopicId { get; set; }
        public string Spelling { get; set; }
        public string Definition { get; set; }
        public string? ImageURL { get; set; }
        public string? Ipa { get; set; }
    }
    public class UpdateWordDto {
        public string Spelling { get; set; }
        public string Definition { get; set; }
        public string? ImageURL { get; set; }
        public string? Ipa { get; set; }
        public int? TopicId { get; set; }
    }


    // GET: api/Words
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Word>>> GetWords()
    {
        return await _context.Words.Include(w => w.Topic).ToListAsync();
    }

    // GET: api/Words/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Word>> GetWord(int id)
    {
        var word = await _context.Words.Include(w => w.Topic)
                                       .FirstOrDefaultAsync(w => w.Id == id);

        if (word == null)
        {
            return NotFound();
        }

        return word;
    }

    // GET: api/Words/by-topic/3
    [HttpGet("by-topic/{topicId}")]
    public async Task<ActionResult<IEnumerable<Word>>> GetWordsByTopicId(int topicId)
    {
        var words = await _context.Words
            .Where(w => w.TopicId == topicId)
            .ToListAsync();

        return Ok(words);
    }
    // GET: api/Words/by-topic/3
    [HttpGet("by-topic-user")]
    public async Task<ActionResult<IEnumerable<object>>> GetWordLearnedByUser(int topicId, int userId)
    {
        var wordsWithStatus = await _context.Words
            .Where(w => w.TopicId == topicId)
            .Select(w => new
            {
                Word = w,
                LatestLearning = w.WordLearnings
                .Where(wl => wl.UserId == userId)
                .OrderByDescending(wl => wl.StudyTime)
                .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(wordsWithStatus);
    }
    // GET: api/Words/by-level/2
    [HttpGet("by-level/{levelId}")]
    public async Task<ActionResult<IEnumerable<Word>>> GetWordsByLevelId(int levelId)
    {
        var words = await _context.Words
            .Include(w => w.Topic)
            .Where(w => w.Topic.LevelId == levelId)
            .ToListAsync();

        return Ok(words);
    }


    // POST: api/Words
    //[HttpPost]
    //public async Task<ActionResult<Word>> PostWord(Word word)
    //{
    //    _context.Words.Add(word);
    //    await _context.SaveChangesAsync();

    //    return CreatedAtAction(nameof(GetWord), new { id = word.Id }, word);
    //}

    // POST: api/Words
    [HttpPost]
    public async Task<ActionResult<Word>> PostWord([FromBody] CreateWordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Spelling) || string.IsNullOrWhiteSpace(dto.Definition))
            return BadRequest(new { error = "Spelling and Definition are required." });
        var word = new Word
        {
            TopicId = dto.TopicId,
            Spelling = dto.Spelling,
            Definition = dto.Definition,
            ImageURL = dto.ImageURL,
            Ipa = dto.Ipa
        };
        _context.Words.Add(word);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWord), new { id = word.Id }, word);
    }


    //// PUT: api/Words/5
    //[HttpPut("{id}")]
    //public async Task<IActionResult> PutWord(int id, Word word)
    //{
    //    if (id != word.Id)
    //    {
    //        return BadRequest();
    //    }

    //    _context.Entry(word).State = EntityState.Modified;

    //    try
    //    {
    //        await _context.SaveChangesAsync();
    //    }
    //    catch (DbUpdateConcurrencyException)
    //    {
    //        if (!WordExists(id))
    //        {
    //            return NotFound();
    //        }
    //        else
    //        {
    //            throw;
    //        }
    //    }

    //    return NoContent();
    //}

    // PUT: api/Words/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutWord(int id, [FromBody] UpdateWordDto dto)
    {
        var word = await _context.Words.FindAsync(id);
        if (word == null)
            return NotFound(new { error = "Word not found." });
        if (string.IsNullOrWhiteSpace(dto.Spelling) || string.IsNullOrWhiteSpace(dto.Definition))
            return BadRequest(new { error = "Spelling and Definition are required." });
        word.Spelling = dto.Spelling;
        word.Definition = dto.Definition;
        word.ImageURL = dto.ImageURL;
        word.Ipa = dto.Ipa;
        word.TopicId = dto.TopicId;
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


    // DELETE: api/Words/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWord(int id)
    {
        var word = await _context.Words.FindAsync(id);
        if (word == null)
        {
            return NotFound();
        }

        _context.Words.Remove(word);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool WordExists(int id)
    {
        return _context.Words.Any(e => e.Id == id);
    }

    [HttpPost("learned")]
    public async Task<IActionResult> MarkWordAsLearned([FromBody] PostDataDTO data)
    {
        var wordLearning = new WordLearning
        {
            UserId = data.param_1,
            WordId = data.param_2,
            Status = "Finished",
            StudyTime = DateTime.UtcNow
        };

        _context.WordLearning.Add(wordLearning);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Word marked as learned." });
    }


}
