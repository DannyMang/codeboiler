import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import GitHubLoginButton from '../components/GitHubLoginButton';

const LoginPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-300">
      <h1 className="text-3xl font-bold mb-8">Welcome to Project Generator</h1>
      <p className="mb-8">Please sign in with GitHub to continue</p>
      <GitHubLoginButton />
    </div>
  );
};

export default LoginPage;