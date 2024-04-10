import { Slot } from 'expo-router';
import { useFonts, Inter_700Bold, Inter_600SemiBold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}