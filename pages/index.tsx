import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import ProjectForm from "../components/ProjectForm";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser(); // Get user session status from Clerk

  useEffect(() => {
    // If the user is not signed in, redirect to the login page
    if (isLoaded && !isSignedIn) {
      window.location.href = '/login'; // Redirect to login page
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading while checking session
  }

  // Render the ProjectForm if the user is signed in
  return <ProjectForm />;
}
