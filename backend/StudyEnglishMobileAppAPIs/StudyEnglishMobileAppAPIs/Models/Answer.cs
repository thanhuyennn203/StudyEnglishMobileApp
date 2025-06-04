namespace StudyEnglishMobileAppAPIs.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Contents { get; set; }
        public bool Status { get; set; }

        public Question Question { get; set; }
    }

}
