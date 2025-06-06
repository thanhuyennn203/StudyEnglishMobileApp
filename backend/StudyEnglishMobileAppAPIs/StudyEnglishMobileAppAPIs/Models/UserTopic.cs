namespace StudyEnglishMobileAppAPIs.Models
{
    public class UserTopic
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TopicId { get; set; }
        public string Status { get; set; }

        public User User { get; set; }
        public Topic Topic { get; set; }
    }
}
