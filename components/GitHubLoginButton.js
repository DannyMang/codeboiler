import React from 'react';
import { Github } from 'lucide-react';

const GitHubLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
    >
      <Github size={20} />
      Log in with GitHub
    </button>
  );
};

export default GitHubLoginButton;