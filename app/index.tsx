import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home tab immediately
    router.replace('/(tabs)');
  }, []);

  return null; // Don't render anything as we're redirecting
}
