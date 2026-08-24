import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Route-based code splitting: each page's JS only downloads when that route is visited,
// instead of one bundle covering every page on the very first load.
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Designs = lazy(() => import('./pages/Designs'));
const DesignDetail = lazy(() => import('./pages/DesignDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const VibeCode = lazy(() => import('./pages/VibeCode'));

const page = (el: React.ReactNode) => <Suspense fallback={null}>{el}</Suspense>;

export const router = createBrowserRouter([
  { path: '/', element: page(<Home />) },
  { path: '/projects', element: page(<Projects />) },
  { path: '/projects/:slug', element: page(<ProjectDetail />) },
  { path: '/designs', element: page(<Designs />) },
  { path: '/designs/:slug', element: page(<DesignDetail />) },
  { path: '/contact', element: page(<Contact />) },
  { path: '/vibe-code', element: page(<VibeCode />) },
]);
