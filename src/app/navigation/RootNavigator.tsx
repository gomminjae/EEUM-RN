import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts } from '@/shared/ui';
import { PostDetailScreen } from '@/pages/post-detail';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.mainBackground },
        headerTitleStyle: { fontFamily: fonts.pretendard.bold, color: colors.textPrimary },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.mainBackground },
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      {/* M4: Search 화면 추가 */}
    </Stack.Navigator>
  );
}
