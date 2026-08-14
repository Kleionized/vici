import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { SplashScene, WaterlineScene } from '@/components/ui';

/**
 * 01 · Splash → 02 · Finding the Waterline.
 *
 * The mark holds for a beat, then the field keeps going while the ring looks
 * for the waterline. Two frames, one continuous background.
 */
export default function Splash() {
  const router = useRouter();
  const [looking, setLooking] = useState(false);

  useEffect(() => {
    const toWaterline = setTimeout(() => setLooking(true), 900);
    const onward = setTimeout(() => router.replace('/(auth)/sign-in'), 1900);
    return () => {
      clearTimeout(toWaterline);
      clearTimeout(onward);
    };
  }, [router]);

  return (
    <>
      <StatusBar style="light" />
      {looking ? <WaterlineScene /> : <SplashScene />}
    </>
  );
}
