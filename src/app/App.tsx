import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AppProviders } from './providers';
import { RootNavigator } from './navigation';
import { AuthGate } from '@/features/auth';
import { colors } from '@/shared/ui';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.mainBackground },
};

export default function App() {
  // Helvetica/Helvetica-Bold 는 iOS 내장 폰트라 로드하지 않는다 (동일 이름 등록이 실패해 부팅을 막았음)
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Thin': require('../../assets/fonts/Pretendard-Thin.otf'),
    'Pretendard-ExtraLight': require('../../assets/fonts/Pretendard-ExtraLight.otf'),
    'Pretendard-Light': require('../../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard-ExtraBold.otf'),
    'Pretendard-Black': require('../../assets/fonts/Pretendard-Black.otf'),
  });

  // 로드 실패 시 시스템 폰트로라도 진행 — 어떤 경우에도 빈 화면에 갇히지 않는다
  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.mainBackground }} />;
  }

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <NavigationContainer theme={navTheme}>
        <AuthGate>
          <RootNavigator />
        </AuthGate>
      </NavigationContainer>
    </AppProviders>
  );
}
