using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class Topic
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public string Title { get; set; }
        public int WordNumber { get; set; }

        [ForeignKey("LevelId")]
        [JsonIgnore]
        public Level Level { get; set; }
        public ICollection<UserTopic>? UserTopics { get; set; }
    }

}