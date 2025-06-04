namespace StudyEnglishMobileAppAPIs.Models
{
    public class WordLearning
    {
        public int UserId { get; set; }
        public int WordId { get; set; }
        public int Status { get; set; }
        public DateTime StudyTime { get; set; }

        public User User { get; set; }
        public Word Word { get; set; }
        public WordLearningStatus WordLearningStatus { get; set; }
    }

}
