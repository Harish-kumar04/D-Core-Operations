import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { SearchModal } from './components/common/SearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { EditEntityModal } from './components/common/EditEntityModal';
import { InternalAuthWall } from './components/common/InternalAuthWall';
import { QuotePopup } from './components/common/QuotePopup';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { CurrentWorksView } from './components/currentWorks/CurrentWorksView';
import { TaskDetailDrawer } from './components/currentWorks/TaskDetailDrawer';
import { WorkQueueView } from './components/workQueue/WorkQueueView';
import { FutureIdeasView } from './components/futureIdeas/FutureIdeasView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout = () => {
  const { userSession, activeTab, isAdminLoginOpen, setIsAdminLoginOpen, editModal, closeEditModal } = useApp();

  // If user is not authenticated for internal access, show mandatory Internal Auth Wall first
  if (!userSession.isAuthenticated) {
    return <InternalAuthWall />;
  }

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <LandingPage />
        <Toast />
        <SearchModal />
        <QuickAddModal />
        <QuotePopup />
        <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />
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
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
      <BottomNav />
      <SearchModal />
      <QuickAddModal />
      <TaskDetailDrawer />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} />
      <EditEntityModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        entityType={editModal.type}
        entityData={editModal.data}
      />
      <QuotePopup />
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
