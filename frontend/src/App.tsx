import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/sections/Navigation';
import { ScrollToTop } from '@/components/ScrollToTop';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectTemplate } from '@/pages/ProjectTemplate';
import { ProfileEditPage } from '@/pages/ProfileEditPage';
import { DirectoryPage } from '@/pages/DirectoryPage';
import { EventsPage } from '@/pages/EventsPage';
import { CommitteesPage } from '@/pages/CommitteesPage';

const AdminPage = lazy(() => import('@/pages/AdminPage').then(module => ({ default: module.AdminPage })));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="noise-overlay" />
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectTemplate />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/committees" element={<CommitteesPage />} />
          <Route path="/profile" element={<Navigate to="/profile/edit" replace />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/admin" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <AdminPage />
            </Suspense>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
