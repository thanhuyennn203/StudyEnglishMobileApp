namespace StudyEnglishMobileAppAPIs.Models
{
    public class ExamWithQuestion
    {
        public int ExamId { get; set; }
        public int QuestionId { get; set; }

        public Exam Exam { get; set; }
        public Question Question { get; set; }
    }

}
