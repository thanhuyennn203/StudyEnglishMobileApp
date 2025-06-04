namespace StudyEnglishMobileAppAPIs.Models
{
    public class LevelTestResult
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public int UserId { get; set; }
        public int? TestTime { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? Score { get; set; }

        public Level Level { get; set; }
        public User User { get; set; }
    }

}
