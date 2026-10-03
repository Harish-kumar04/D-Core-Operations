import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StealthGate } from './components/common/StealthGate';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { SearchModal } from './components/common/SearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';
import { EditEntityModal } from './components/common/EditEntityModal';
import { Toast } from './components/common/Toast';

// Lazy-loaded views for performance optimization
const InternalAuthWall = lazy(() => import('./components/common/InternalAuthWall').then(m => ({ default: m.InternalAuthWall })));
const DashboardView = lazy(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const FeedsView = lazy(() => import('./components/feeds/FeedsView').then(m => ({ default: m.FeedsView })));
const WorkQueueView = lazy(() => import('./components/workQueue/WorkQueueView').then(m => ({ default: m.WorkQueueView })));
const FutureIdeasView = lazy(() => import('./components/futureIdeas/FutureIdeasView').then(m => ({ default: m.FutureIdeasView })));
const ProjectsView = lazy(() => import('./components/projects/ProjectsView').then(m => ({ default: m.ProjectsView })));
const AnalyticsView = lazy(() => import('./components/analytics/AnalyticsView').then(m => ({ default: m.AnalyticsView })));
const HistoryView = lazy(() => import('./components/history/HistoryView').then(m => ({ default: m.HistoryView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full p-8 text-center" role="status" aria-label="Loading content">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-[#E42129] animate-spin"></div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading D-CORE Operations...</span>
    </div>
  </div>
);

const MainLayout = () => {
  const { userSession, activeTab, editModal, closeEditModal } = useApp();

  // If user is not authenticated for internal access, show mandatory Internal Auth Wall first
  if (!userSession.isAuthenticated) {
    return (
      <Suspense fallback={<PageFallback />}>
        <InternalAuthWall />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-100 selection:text-dcore-red">
      <Header />
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main id="main-content" role="main" className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-full">
          <Suspense fallback={<PageFallback />}>
            {(activeTab === 'dashboard' || activeTab === 'landing') && <DashboardView />}
            {activeTab === 'feeds' && <FeedsView />}
            {activeTab === 'work-queue' && <WorkQueueView />}
            {activeTab === 'future-ideas' && <FutureIdeasView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'history' && <HistoryView />}
            {activeTab === 'settings' && <SettingsView />}
          </Suspense>
        </main>
      </div>
      <BottomNav />
      <SearchModal />
      <QuickAddModal />
      <EditEntityModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        entityType={editModal.type}
        entityData={editModal.data}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <StealthGate>
        <MainLayout />
      </StealthGate>
    </AppProvider>
  );
}

