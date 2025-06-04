namespace StudyEnglishMobileAppAPIs.Models
{
    public class Word
    {
        public int Id { get; set; }
        public int? TopicId { get; set; }
        public string Spelling { get; set; }
        public string Definition { get; set; }
        public string? ImageURL { get; set; }
        public string? Ipa { get; set; }

        public Topic Topic { get; set; }

        public ICollection<WordLearning> WordLearnings { get; set; }
    }

}
