import { useLayoutEffect, useState } from "react";
import { Pressable, Linking, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { AppText, colors } from "@/shared/ui";
import { FAQ_URL, PRIVACY_URL, TERMS_URL } from "@/shared/config/links";
import { useAuthStore } from "@/features/auth";

/** 원본 SettingView 이식 — FAQ / Contacts us / Terms / Privacy */
const ROWS: { title: string; action: () => void }[] = [
  { title: "FAQ", action: () => WebBrowser.openBrowserAsync(FAQ_URL) },
  {
    title: "Contacts us",
    // 메일 앱이 없으면(시뮬레이터 등) openURL 이 reject — 주소 안내로 폴백
    action: () =>
      Linking.openURL("mailto:eeum.app@gmail.com").catch(() =>
        Alert.alert("문의", "eeum.app@gmail.com 으로 문의해주세요."),
      ),
  },
  {
    title: "Terms of services",
    action: () => WebBrowser.openBrowserAsync(TERMS_URL),
  },
  {
    title: "Privacy Policy",
    action: () => WebBrowser.openBrowserAsync(PRIVACY_URL),
  },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const closeAccount = useAuthStore((state) => state.closeAccount);
  const signOut = useAuthStore((state) => state.signOut);
  const [isClosingAccount, setIsClosingAccount] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView
      className="flex-1 bg-main"
      contentContainerStyle={{ paddingTop: 20 }}
    >
      {ROWS.map(({ title, action }) => (
        <Pressable key={title} className="px-lg py-[18px]" onPress={action}>
          <AppText size={16} weight="medium">
            {title}
          </AppText>
        </Pressable>
      ))}
      <Pressable
        className="px-lg py-[18px]"
        disabled={isClosingAccount}
        onPress={() =>
          Alert.alert("로그아웃", "로그아웃하시겠어요?", [
            { text: "취소", style: "cancel" },
            {
              text: "로그아웃",
              style: "destructive",
              onPress: () => {
                void signOut().then(() => queryClient.clear());
              },
            },
          ])
        }
      >
        <AppText size={16} weight="medium" color="systemRed">
          로그아웃
        </AppText>
      </Pressable>
      <Pressable
        className="px-lg py-[18px]"
        disabled={isClosingAccount}
        style={isClosingAccount ? { opacity: 0.45 } : undefined}
        onPress={() =>
          Alert.alert(
            "회원 탈퇴",
            "계정과 작성한 게시글 및 댓글이 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠어요?",
            [
              { text: "취소", style: "cancel" },
              {
                text: "탈퇴",
                style: "destructive",
                onPress: () => {
                  setIsClosingAccount(true);
                  void closeAccount()
                    .then(() => queryClient.clear())
                    .catch(() => {
                      setIsClosingAccount(false);
                      Alert.alert(
                        "탈퇴 실패",
                        "계정을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.",
                      );
                    });
                },
              },
            ],
          )
        }
      >
        <AppText size={16} weight="medium" color="systemRed">
          {isClosingAccount ? "탈퇴 처리 중..." : "회원 탈퇴"}
        </AppText>
      </Pressable>
    </ScrollView>
  );
}
