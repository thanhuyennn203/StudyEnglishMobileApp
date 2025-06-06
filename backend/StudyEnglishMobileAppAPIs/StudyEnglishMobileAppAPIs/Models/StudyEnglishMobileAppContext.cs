using Microsoft.EntityFrameworkCore;
using StudyEnglishMobileAppAPIs.Models;

public class StudyEnglishMobileAppContext : DbContext
{
    public StudyEnglishMobileAppContext(DbContextOptions<StudyEnglishMobileAppContext> options)
        : base(options)
    {
    }

    public DbSet<Word> Words { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<WordLearning> WordLearnings { get; set; }
    public DbSet<WordLearningStatus> WordLearningStatuses { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<LevelTestResult> LevelTestResults { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<ExamWithQuestion> ExamWithQuestions { get; set; }
    public DbSet<UserAnswer> UserAnswers { get; set; }
    public DbSet<UserTopic> UserTopic { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<WordLearning>()
            .HasKey(wl => new { wl.UserId, wl.WordId });

        modelBuilder.Entity<ExamWithQuestion>()
            .HasKey(eq => new { eq.ExamId, eq.QuestionId });

        modelBuilder.Entity<UserAnswer>()
            .HasKey(ua => new { ua.UserId, ua.ExamId, ua.QuestionId });

        // Relationships
        modelBuilder.Entity<Word>()
            .HasOne(w => w.Topic)
            .WithMany()
            .HasForeignKey(w => w.TopicId);

        modelBuilder.Entity<Topic>()
            .HasOne(t => t.Level)
            .WithMany(t=> t.Topics)
            .HasForeignKey(t => t.LevelId);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Level)
            .WithMany(l=> l.Users)
            .HasForeignKey(u => u.CurrentLevel);

        modelBuilder.Entity<WordLearning>()
            .HasOne(wl => wl.User)
            .WithMany()
            .HasForeignKey(wl => wl.UserId);

        modelBuilder.Entity<WordLearning>()
            .HasOne(wl => wl.Word)
            .WithMany()
            .HasForeignKey(wl => wl.WordId);

        modelBuilder.Entity<WordLearning>()
            .HasOne(wl => wl.WordLearningStatus)
            .WithMany()
            .HasForeignKey(wl => wl.Status);

        modelBuilder.Entity<Exam>()
            .HasOne(e => e.Level)
            .WithMany()
            .HasForeignKey(e => e.LevelId);

        modelBuilder.Entity<Exam>()
            .HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId);

        modelBuilder.Entity<LevelTestResult>()
            .HasOne(ltr => ltr.Level)
            .WithMany()
            .HasForeignKey(ltr => ltr.LevelId);

        modelBuilder.Entity<LevelTestResult>()
            .HasOne(ltr => ltr.User)
            .WithMany()
            .HasForeignKey(ltr => ltr.UserId);

        modelBuilder.Entity<Question>()
            .HasOne(q => q.Answer)
            .WithMany()
            .HasForeignKey(q => q.AnswerId);

        modelBuilder.Entity<ExamWithQuestion>()
            .HasOne(eq => eq.Exam)
            .WithMany()
            .HasForeignKey(eq => eq.ExamId);

        modelBuilder.Entity<ExamWithQuestion>()
            .HasOne(eq => eq.Question)
            .WithMany()
            .HasForeignKey(eq => eq.QuestionId);

        modelBuilder.Entity<UserAnswer>()
            .HasOne(ua => ua.Exam)
            .WithMany()
            .HasForeignKey(ua => ua.ExamId);

        modelBuilder.Entity<UserAnswer>()
            .HasOne(ua => ua.Question)
            .WithMany()
            .HasForeignKey(ua => ua.QuestionId);

        modelBuilder.Entity<UserAnswer>()
            .HasOne(ua => ua.User)
            .WithMany()
            .HasForeignKey(ua => ua.UserId);

        modelBuilder.Entity<UserTopic>()
           .HasOne(ua => ua.User)
           .WithMany(u => u.UserTopics)
           .HasForeignKey(ua => ua.UserId);

        modelBuilder.Entity<UserTopic>()
          .HasOne(ua => ua.Topic)
          .WithMany(u => u.UserTopics)
          .HasForeignKey(ua => ua.TopicId);
    }
}
