import React from 'react';

export function ProfileView({ user }) {
  const profile = {
    username: user?.username || 'Karthik',
    email: user?.email || 'student@sentinelassess.local',
    title: 'Java Developer & Competitive Programmer',
    level: 8,
    points: 380,
    rank: '#18',
    solved: 42,
    assessmentsCompleted: 8,
    streak: '8 days',
    memberSince: 'March 2026'
  };

  const skills = [
    { name: 'Core Java (OOP, Generics, Concurrency)', level: 90 },
    { name: 'Data Structures (Arrays, Lists, Trees, Graphs)', level: 80 },
    { name: 'Algorithms (Sorting, DP, Sliding Window)', level: 72 },
    { name: 'Algorithmic Problem Solving & Complexity Analysis', level: 81 }
  ];

  const badges = [
    { icon: '🚀', title: 'First Code Execution', desc: 'Ran first Java program on Sentinel sandbox' },
    { icon: '🔥', title: '7-Day Streak Master', desc: 'Maintained consecutive daily practice' },
    { icon: '🛡️', title: 'Clean Sheet Assessment', desc: 'Completed exam with 0 proctor violations' },
    { icon: '⚡', title: 'Speed Demon', desc: 'Solved Medium problem in under 5 minutes' },
    { icon: '🏆', title: 'Top 5% Qualifier', desc: 'Attained Rank #18 on Global Leaderboard' },
    { icon: '☕', title: 'Java 17 Specialist', desc: 'Executed 50+ successful compilations' }
  ];

  return (
    <div className="view-content-wrapper">
      {/* Profile Banner Card */}
      <div className="profile-banner-card">
        <div className="profile-banner-left">
          <div className="profile-large-avatar">
            {profile.username[0].toUpperCase()}
          </div>
          <div className="profile-identity">
            <div className="profile-name-row">
              <h1 className="profile-fullname">{profile.username}</h1>
              <span className="profile-level-badge">Level {profile.level}</span>
            </div>
            <div className="profile-title-text">{profile.title}</div>
            <div className="profile-email-text">{profile.email} • Joined {profile.memberSince}</div>
          </div>
        </div>

        <div className="profile-banner-stats">
          <div className="banner-stat-box">
            <span className="b-val">{profile.points}</span>
            <span className="b-lbl">Points</span>
          </div>
          <div className="banner-stat-box">
            <span className="b-val">{profile.rank}</span>
            <span className="b-lbl">Rank</span>
          </div>
          <div className="banner-stat-box">
            <span className="b-val">{profile.solved}</span>
            <span className="b-lbl">Solved</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Skills & Achievements */}
      <div className="profile-columns-grid">
        {/* Left: Skills Breakdown */}
        <div className="profile-card-box">
          <h2 className="box-title">Skills & Proficiencies</h2>
          <p className="box-subtitle">Verified competency based on completed challenges and assessments</p>

          <div className="skills-meter-list">
            {skills.map((s) => (
              <div key={s.name} className="skill-meter-item">
                <div className="skill-label-row">
                  <span className="skill-name">{s.name}</span>
                  <span className="skill-pct"><strong>{s.level}%</strong></span>
                </div>
                <div className="progress-track-thick">
                  <div
                    className="progress-fill-gradient"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Badges & Achievements */}
        <div className="profile-card-box">
          <h2 className="box-title">Badges & Achievements</h2>
          <p className="box-subtitle">Milestones unlocked during your coding journey</p>

          <div className="badges-matrix-grid">
            {badges.map((b, i) => (
              <div key={i} className="achievement-badge-card">
                <div className="badge-icon-wrap">{b.icon}</div>
                <div className="badge-details">
                  <h3 className="badge-title">{b.title}</h3>
                  <p className="badge-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
