import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Designs from './pages/Designs';
import DesignDetail from './pages/DesignDetail';
import Contact from './pages/Contact';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/projects', element: <Projects /> },
  { path: '/projects/:slug', element: <ProjectDetail /> },
  { path: '/designs', element: <Designs /> },
  { path: '/designs/:slug', element: <DesignDetail /> },
  { path: '/contact', element: <Contact /> },
]);
