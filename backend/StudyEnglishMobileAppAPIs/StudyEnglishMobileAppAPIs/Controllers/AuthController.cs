using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Concurrent;
using StudyEnglishMobileAppAPIs.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly StudyEnglishMobileAppContext _context;

    private static ConcurrentDictionary<string, string> _refreshTokens = new();

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        StudyEnglishMobileAppContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var identityUser = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            DisplayName = model.Email,
            CurrentLevel = 1,
            Role = "Student",
            AvatarUrl = "https://i.pinimg.com/736x/76/f3/f3/76f3f3007969fd3b6db21c744e1ef289.jpg"
        };

        var result = await _userManager.CreateAsync(identityUser, model.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var appUser = new User
        {
            Email = model.Email,
            Username = model.Email,
            Password = "", // Not used, handled by Identity
            Role = "Student",
            CurrentLevel = 1,
            IdentityUserId = identityUser.Id
        };

        _context.Users.Add(appUser);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
        if (!result.Succeeded)
            return Unauthorized();

        var identityUser = await _userManager.FindByEmailAsync(model.Email);
        if (identityUser == null)
            return Unauthorized();

        var appUser = await _context.Users.FirstOrDefaultAsync(u => u.IdentityUserId == identityUser.Id);
        if (appUser == null)
            return Unauthorized("App user not found.");

        var accessToken = GenerateJwtToken(identityUser, appUser.Id);
        var refreshToken = Guid.NewGuid().ToString();
        _refreshTokens[refreshToken] = identityUser.Id;

        return Ok(new
        {
            accessToken,
            refreshToken,
            user = new
            {
                id = appUser.Id,
                identityUserId = identityUser.Id,
                email = identityUser.Email,
                displayName = identityUser.DisplayName,
                avatarUrl = identityUser.AvatarUrl,
                currentLevel = appUser.CurrentLevel,
                role = identityUser.Role
            }
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest model)
    {
        if (_refreshTokens.TryGetValue(model.RefreshToken, out var identityUserId))
        {
            var identityUser = await _userManager.FindByIdAsync(identityUserId);
            if (identityUser != null)
            {
                var appUser = await _context.Users.FirstOrDefaultAsync(u => u.IdentityUserId == identityUser.Id);
                if (appUser == null)
                    return Unauthorized("App user not found.");

                var accessToken = GenerateJwtToken(identityUser, appUser.Id);
                var newRefreshToken = Guid.NewGuid().ToString();
                _refreshTokens.TryRemove(model.RefreshToken, out _);
                _refreshTokens[newRefreshToken] = identityUser.Id;

                return Ok(new { accessToken, refreshToken = newRefreshToken });
            }
        }

        return Unauthorized();
    }

    [Authorize]
    [HttpPost("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
    {
        var identityUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // ✅ Correct standard claim
        if (identityUserId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(identityUserId);
        if (user == null)
            return NotFound();

        if (!string.IsNullOrWhiteSpace(model.DisplayName))
            user.DisplayName = model.DisplayName;

        if (!string.IsNullOrWhiteSpace(model.AvatarUrl))
            user.AvatarUrl = model.AvatarUrl;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.DisplayName,
            user.AvatarUrl,
            user.CurrentLevel,
            user.Role
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromBody] RefreshRequest model)
    {
        if (_refreshTokens.TryRemove(model.RefreshToken, out _))
        {
            return Ok(new { message = "Logged out successfully." });
        }
        return BadRequest(new { message = "Invalid refresh token." });
    }

    private string GenerateJwtToken(ApplicationUser user, int appUserId)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKey";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id), // ✅ For identifying user securely
            new Claim("appUserId", appUserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim("displayName", user.DisplayName ?? "")
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // === DTOs ===
    public class RegisterModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RefreshRequest
    {
        public string RefreshToken { get; set; }
    }

    public class UpdateProfileModel
    {
        public string? DisplayName { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
