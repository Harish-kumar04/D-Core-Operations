import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { SearchModal } from './components/common/SearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { CurrentWorksView } from './components/currentWorks/CurrentWorksView';
import { TaskDetailDrawer } from './components/currentWorks/TaskDetailDrawer';
import { WorkQueueView } from './components/workQueue/WorkQueueView';
import { FutureIdeasView } from './components/futureIdeas/FutureIdeasView';
import { ProjectsView } from './components/projects/ProjectsView';
import { TeamView } from './components/team/TeamView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout = () => {
  const { activeTab } = useApp();

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <LandingPage />
        <Toast />
        <SearchModal />
        <QuickAddModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-100 selection:text-dcore-red">
      <Header />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'current-works' && <CurrentWorksView />}
          {activeTab === 'work-queue' && <WorkQueueView />}
          {activeTab === 'future-ideas' && <FutureIdeasView />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'team' && <TeamView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
      <BottomNav />
      <SearchModal />
      <QuickAddModal />
      <TaskDetailDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
