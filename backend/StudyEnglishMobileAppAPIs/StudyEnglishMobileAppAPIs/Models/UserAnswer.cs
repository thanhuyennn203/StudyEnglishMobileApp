namespace StudyEnglishMobileAppAPIs.Models
{
    public class UserAnswer
    {
        public int UserId { get; set; }
        public int ExamId { get; set; }
        public int QuestionId { get; set; }
        public int? Answered { get; set; }
        public bool? Status { get; set; }
        public DateTime? AnswerTime { get; set; }

        public User User { get; set; }
        public Exam Exam { get; set; }
        public Question Question { get; set; }
    }

}
