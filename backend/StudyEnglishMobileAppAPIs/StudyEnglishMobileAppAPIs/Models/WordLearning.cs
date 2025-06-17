using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class WordLearning
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int WordId { get; set; }
        public string Status { get; set; }
        public DateTime StudyTime { get; set; }

        [ForeignKey(nameof(UserId))]
        [JsonIgnore]
        public User? User { get; set; }

        [ForeignKey(nameof(WordId))]
        [JsonIgnore]
        public Word? Word { get; set; }
        //public WordLearningStatus WordLearningStatus { get; set; }
    }

}
