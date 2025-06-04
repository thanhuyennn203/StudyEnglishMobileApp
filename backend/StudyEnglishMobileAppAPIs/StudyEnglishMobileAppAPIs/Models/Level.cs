namespace StudyEnglishMobileAppAPIs.Models
{
    public class Level
    {
        public int Id { get; set; }
        public string LevelName { get; set; }
        public string? Description { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<Topic> Topics { get; set; }
    }

}
