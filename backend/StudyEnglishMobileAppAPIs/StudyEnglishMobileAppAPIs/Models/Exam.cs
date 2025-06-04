using System.Reflection.Emit;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public int LevelId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }
        public DateTime TestTime { get; set; }
        public int Score { get; set; }
        public string Name { get; set; }

        public Level Level { get; set; }
        public User User { get; set; }
    }

}
