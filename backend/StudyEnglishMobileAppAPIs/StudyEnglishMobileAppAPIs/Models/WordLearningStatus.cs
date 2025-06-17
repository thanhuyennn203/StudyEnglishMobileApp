namespace StudyEnglishMobileAppAPIs.Models
{
    public class WordLearningStatus
    {
        public int Id { get; set; }
        public string Description { get; set; }

        public ICollection<WordLearning>? WordLearnings { get; set; }
    }

}
