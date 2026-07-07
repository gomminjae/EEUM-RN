import { useCallback, useLayoutEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/shared/ui';
import { TrackRow, type Music } from '@/entities/track';
import { useMusicSearch, useMusicPicker } from '@/features/music-search';

/** 음악 검색 화면 — 곡을 고르면 picker 에 담고 이전 화면으로 복귀 */
export function SearchScreen() {
  const navigation = useNavigation();
  const [term, setTerm] = useState('');
  const [submitted, setSubmitted] = useState('');
  const query = useMusicSearch(submitted);
  const pick = useMusicPicker((s) => s.pick);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const select = useCallback(
    (music: Music) => {
      pick(music);
      navigation.goBack();
    },
    [pick, navigation],
  );

  const performSearch = useCallback(() => {
    const trimmed = term.trim();
    if (trimmed.length === 0) return;
    setSubmitted(trimmed);
  }, [term]);

  return (
    <View className="flex-1 bg-main">
      <View className="flex-row items-center gap-[12px] p-[16px] bg-content">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <TextInput
          className="flex-1 font-regular text-[17px] text-primary"
          value={term}
          onChangeText={setTerm}
          placeholderTextColor={colors.textFootnote}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={performSearch}
        />
      </View>

      {query.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accentPrimary} />
        </View>
      ) : (
        <FlatList
          data={query.data ?? []}
          keyExtractor={(m) => `${m.songName}-${m.artistName}-${m.albumName}`}
          renderItem={({ item }) => <TrackRow music={item} onPress={select} />}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />
      )}
    </View>
  );
}
