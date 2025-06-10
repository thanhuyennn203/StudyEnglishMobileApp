using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Concurrent;
using StudyEnglishMobileAppAPIs.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    // In-memory refresh token store (for demo)
    private static ConcurrentDictionary<string, string> _refreshTokens = new();

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new ApplicationUser {
             UserName = model.Email, // <-- Add this line to set a valid username
             Email = model.Email,
             DisplayName = model.Email, // Default display name can be set to email or any other logic
             CurrentLevel = 1, // Default level
             Role = "Student", // Default role 
             AvatarUrl = "https://randomuser.me/api/portraits/men/32.jpg" // Default avatar URL        
          };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            return Ok();
        }
        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            var accessToken = GenerateJwtToken(user);
            var refreshToken = Guid.NewGuid().ToString();
            _refreshTokens[refreshToken] = user.Id;
            return Ok(new {
                accessToken,
                refreshToken,
                user = new {
                    user.Id,
                    user.Email,
                    user.DisplayName,
                    user.AvatarUrl,
                    user.CurrentLevel,
                    user.Role
                }
            });
        }
        return Unauthorized();
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshRequest model)
    {
        if (_refreshTokens.TryGetValue(model.RefreshToken, out var userId))
        {
            // Optionally: check if refresh token is expired, etc.
            var user = _userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var accessToken = GenerateJwtToken(user);
                var newRefreshToken = Guid.NewGuid().ToString();
                _refreshTokens.TryRemove(model.RefreshToken, out _);
                _refreshTokens[newRefreshToken] = user.Id;
                return Ok(new { accessToken, refreshToken = newRefreshToken });
            }
        }
        return Unauthorized();
    }

    [HttpPost("update-profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (userId == null)
            return Unauthorized();
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound();

        // Update allowed fields
        user.DisplayName = model.DisplayName ?? user.DisplayName;
        user.AvatarUrl = model.AvatarUrl ?? user.AvatarUrl;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new {
            user.Id,
            user.Email,
            user.DisplayName,
            user.AvatarUrl,
            user.CurrentLevel,
            user.Role
        });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKey";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
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
}

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
