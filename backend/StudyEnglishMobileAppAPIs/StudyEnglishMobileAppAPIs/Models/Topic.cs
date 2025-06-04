using System.ComponentModel.DataAnnotations.Schema;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public string Title { get; set; }
        public int WordNumber { get; set; }

         [ForeignKey("LevelId")]
        public Level Level { get; set; }
    }

}
