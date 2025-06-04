namespace StudyEnglishMobileAppAPIs.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int? AnswerId { get; set; }

        public Answer Answer { get; set; }
    }

}
