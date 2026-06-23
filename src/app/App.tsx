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
  const [fontsLoaded] = useFonts({
    'Pretendard-Thin': require('../../assets/fonts/Pretendard-Thin.otf'),
    'Pretendard-ExtraLight': require('../../assets/fonts/Pretendard-ExtraLight.otf'),
    'Pretendard-Light': require('../../assets/fonts/Pretendard-Light.otf'),
    'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../../assets/fonts/Pretendard-Bold.otf'),
    'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard-ExtraBold.otf'),
    'Pretendard-Black': require('../../assets/fonts/Pretendard-Black.otf'),
    Helvetica: require('../../assets/fonts/Helvetica.ttf'),
    'Helvetica-Bold': require('../../assets/fonts/Helvetica-Bold.ttf'),
  });

  if (!fontsLoaded) {
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
