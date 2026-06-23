import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, fonts } from '@/shared/ui';
import { HomeScreen } from '@/pages/home';
import { FeedScreen } from '@/pages/feed';
import { ShareScreen } from '@/pages/share';
import { SettingsScreen } from '@/pages/settings';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.mainBackground },
        headerTitleStyle: { fontFamily: fonts.pretendard.bold, color: colors.textPrimary },
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textFootnote,
        tabBarLabelStyle: { fontFamily: fonts.pretendard.medium, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.mainBackground },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Share" component={ShareScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
