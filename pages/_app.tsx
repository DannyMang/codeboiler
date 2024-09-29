import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { AppProps } from 'next/app'; // Import AppProps type
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <SignedIn>
        {/* Render your authenticated application here */}
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        {/* Render your sign-in or sign-up page */}
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;
