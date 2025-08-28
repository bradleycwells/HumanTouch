import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">The Human Touch</h1>
        <p className="text-lg text-gray-400 mb-12">From AI concept to human creation.</p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-center"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-center"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;