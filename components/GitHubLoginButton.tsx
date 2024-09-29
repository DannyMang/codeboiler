import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Github } from 'lucide-react';

interface GitHubLoginButtonProps {
  onClick?: () => void;
}

const GitHubLoginButton: React.FC<GitHubLoginButtonProps> = ({ onClick }) => {
  const { data: session } = useSession();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      signIn('github');
    }
  };

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
    >
      <Github size={20} />
      Sign in with GitHub
    </button>
  );
};

export default GitHubLoginButton;