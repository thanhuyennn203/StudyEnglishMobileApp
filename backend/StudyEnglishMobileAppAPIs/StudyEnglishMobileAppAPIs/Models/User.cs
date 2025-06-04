using System.Reflection.Emit;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int CurrentLevel { get; set; }

        public Level Level { get; set; }

        public ICollection<WordLearning>? WordLearnings { get; set; }
        public ICollection<UserAnswer>? UserAnswers { get; set; }
    }

}
