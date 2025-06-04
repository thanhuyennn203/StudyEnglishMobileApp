using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyEnglishMobileAppAPIs.Models;
using System.Collections.Generic;
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
    [HttpPost]
    public async Task<ActionResult<Word>> PostWord(Word word)
    {
        _context.Words.Add(word);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWord), new { id = word.Id }, word);
    }

    // PUT: api/Words/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutWord(int id, Word word)
    {
        if (id != word.Id)
        {
            return BadRequest();
        }

        _context.Entry(word).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!WordExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
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
}
