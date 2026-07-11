import { Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppImage, colors, fonts, images, spacing } from '@/shared/ui';
import { HomeScreen } from '@/pages/home';
import { FeedScreen } from '@/pages/feed';
import { ShareScreen } from '@/pages/share';
import { SettingsScreen } from '@/pages/settings';
import { PostDetailScreen } from '@/pages/post-detail';
import { EditPostScreen } from '@/pages/edit-post';
import { SearchScreen } from '@/pages/search';
import { PostsListScreen } from '@/pages/posts-list';
import { InboxMenuScreen } from '@/pages/inbox-menu';
import { CommentsListScreen } from '@/pages/comments-list';
import { LikesListScreen } from '@/pages/likes-list';
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: '',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              hitSlop={8}
              style={{ paddingHorizontal: spacing.xs }}
            >
              <AppImage
                source={images.gear}
                tintColor={colors.black}
                style={{ width: 24, height: 24 }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen name="Feed" component={FeedScreen} options={{ title: '' }} />
      <Stack.Screen name="Share" component={ShareScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: '' }} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen name="PostsList" component={PostsListScreen} options={{ title: '' }} />
      <Stack.Screen name="InboxMenu" component={InboxMenuScreen} options={{ title: 'menu' }} />
      <Stack.Screen name="CommentsList" component={CommentsListScreen} options={{ title: '' }} />
      <Stack.Screen name="LikesList" component={LikesListScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
