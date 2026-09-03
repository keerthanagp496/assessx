import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PracticeArenaView } from './views/PracticeArenaView';
import { PracticeWorkspace } from './views/PracticeWorkspace';
import { AssessmentsView } from './views/AssessmentsView';
import { ProctoredExamView } from './views/ProctoredExamView';
import { CompetitionsView } from './views/CompetitionsView';
import { LeaderboardView } from './views/LeaderboardView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminPracticeManagerView } from './views/AdminPracticeManagerView';
import { AdminAssessmentsView } from './views/AdminAssessmentsView';
import { AdminSubmissionsView } from './views/AdminSubmissionsView';
import { AdminUsersView } from './views/AdminUsersView';

function AppContent() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (_) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProblemId, setActiveProblemId] = useState(null);
  const [activeExamId, setActiveExamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('dashboard');
    setActiveProblemId(null);
    setActiveExamId(null);
    toast.info('Signed out successfully.');
  };

  const handleToggleRole = (targetRole) => {
    if (!user) return;
    const isNowAdmin = targetRole === 'ROLE_ADMIN';
    const updatedUser = {
      ...user,
      role: targetRole,
      username: isNowAdmin ? (user.username === 'Student' ? 'Admin' : user.username) : (user.username === 'Admin' ? 'Student' : user.username)
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (isNowAdmin) {
      setActiveTab('admin_dashboard');
      toast.success('Switched to Administrator Portal');
    } else {
      setActiveTab('dashboard');
      toast.info('Switched to Student Workspace');
    }
  };

  const handleSelectProblem = (id) => {
    setActiveProblemId(id);
  };

  const handleStartExam = (id) => {
    setActiveExamId(id);
  };

  // Keyboard shortcut for global search Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) {
    return <LoginView onLoginSuccess={setUser} />;
  }

  // Active Proctored Exam Mode (Distraction-free Fullscreen)
  if (activeExamId) {
    return (
      <ProctoredExamView
        assessmentId={activeExamId}
        user={user}
        onExit={() => setActiveExamId(null)}
      />
    );
  }

  // Active Practice Problem Workspace (IDE Fullscreen)
  if (activeProblemId) {
    return (
      <PracticeWorkspace
        problemId={activeProblemId}
        user={user}
        onBack={() => setActiveProblemId(null)}
      />
    );
  }

  return (
    <div className="app-shell-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveProblemId(null);
        }}
        user={user}
        onToggleRole={handleToggleRole}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main App Workspace */}
      <div className="app-workspace-column">
        <Topbar
          user={user}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          onToggleRole={handleToggleRole}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        <main className="app-main-viewport">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              onNavigateToPractice={() => setActiveTab('practice')}
              onNavigateToAssessments={() => setActiveTab('assessments')}
              onSelectProblem={handleSelectProblem}
              onStartAssessment={handleStartExam}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeArenaView
              onSelectProblem={handleSelectProblem}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'assessments' && (
            <AssessmentsView
              user={user}
              onStartExam={handleStartExam}
            />
          )}

          {activeTab === 'competitions' && (
            <CompetitionsView
              onSelectCompetition={() => setActiveTab('practice')}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView user={user} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView user={user} />
          )}

          {activeTab === 'profile' && (
            <ProfileView user={user} />
          )}

          {activeTab === 'settings' && (
            <SettingsView user={user} />
          )}

          {/* Admin Suite Views */}
          {activeTab === 'admin_dashboard' && (
            <AdminDashboardView
              onNavigateToQuestions={() => setActiveTab('admin_practice')}
              onNavigateToAssessments={() => setActiveTab('admin_assessments')}
            />
          )}

          {activeTab === 'admin_practice' && (
            <AdminPracticeManagerView />
          )}

          {activeTab === 'admin_assessments' && (
            <AdminAssessmentsView />
          )}

          {activeTab === 'admin_submissions' && (
            <AdminSubmissionsView />
          )}

          {activeTab === 'admin_users' && (
            <AdminUsersView />
          )}
        </main>

        {/* Mobile Sticky Bottom Nav */}
        <MobileNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setActiveProblemId(null);
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
