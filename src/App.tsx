import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import BlogPage from './pages/BlogPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/:slug',
        element: <BlogPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
