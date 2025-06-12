using Microsoft.AspNetCore.Identity;

namespace StudyEnglishMobileAppAPIs.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int CurrentLevel { get; set; }
        public string? Role { get; set; }
        public string? AvatarUrl { get; set; } 
        public string? DisplayName { get; set; }
    }
}

