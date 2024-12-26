import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-3">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
      <p className="mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
