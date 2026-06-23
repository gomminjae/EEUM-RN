import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: '피드',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Share"
        component={ShareScreen}
        options={{
          title: '공유',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
