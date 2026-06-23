import { useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import { useDebounce } from '@/shared/lib/useDebounce';
import { TrackRow, type Music } from '@/entities/track';
import { useMusicSearch, useMusicPicker } from '@/features/music-search';

/** 음악 검색 화면 — 곡을 고르면 picker 에 담고 이전 화면으로 복귀 */
export function SearchScreen() {
  const navigation = useNavigation();
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term);
  const query = useMusicSearch(debounced);
  const pick = useMusicPicker((s) => s.pick);

  const select = (music: Music) => {
    pick(music);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={term}
        onChangeText={setTerm}
        placeholder="곡, 아티스트 검색"
        placeholderTextColor={colors.textFootnote}
        autoFocus
        returnKeyType="search"
      />

      {query.isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accentPrimary} />
        </View>
      )}

      <FlatList
        data={query.data ?? []}
        keyExtractor={(m) => `${m.songName}-${m.artistName}-${m.albumName}`}
        renderItem={({ item }) => <TrackRow music={item} onPress={() => select(item)} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !query.isLoading && debounced.trim().length > 0 ? (
            <View style={styles.center}>
              <AppText color="textFootnote">검색 결과가 없어요</AppText>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  input: {
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    fontFamily: fonts.pretendard.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: spacing.sm },
});
