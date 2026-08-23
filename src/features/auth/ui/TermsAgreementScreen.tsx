import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { PRIVACY_URL, TERMS_URL } from "@/shared/config/links";
import { AppText, colors } from "@/shared/ui";
import { CommunityTermsScreen } from "./CommunityTermsScreen";

type TermsAgreementScreenProps = {
  providerName: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

type AgreementRowProps = {
  checked: boolean;
  label: string;
  onPress: () => void;
  onView?: () => void;
};

function AgreementRow({ checked, label, onPress, onView }: AgreementRowProps) {
  return (
    <View className="flex-row items-center py-[13px]">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        className="flex-1 flex-row items-center"
        hitSlop={6}
        onPress={onPress}
      >
        <Ionicons
          name={checked ? "checkbox" : "square-outline"}
          size={22}
          color={checked ? colors.accentPrimary : colors.systemGray}
        />
        <AppText size={15} className="ml-sm flex-1">
          <AppText size={15} weight="semiBold">
            (필수)
          </AppText>{" "}
          {label}
        </AppText>
      </Pressable>

      {onView && (
        <Pressable hitSlop={8} onPress={onView}>
          <AppText size={13} color="textFootnote" className="underline">
            보기
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

export function TermsAgreementScreen({
  providerName,
  isSubmitting,
  onBack,
  onSubmit,
}: TermsAgreementScreenProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [communityAccepted, setCommunityAccepted] = useState(false);
  const [showCommunityTerms, setShowCommunityTerms] = useState(false);

  const allAccepted =
    termsAccepted && privacyAccepted && communityAccepted;

  const toggleAll = () => {
    const next = !allAccepted;
    setTermsAccepted(next);
    setPrivacyAccepted(next);
    setCommunityAccepted(next);
  };

  if (showCommunityTerms) {
    return (
      <CommunityTermsScreen onBack={() => setShowCommunityTerms(false)} />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-main" edges={["top", "bottom"]}>
      <View className="flex-1 px-lg pb-lg">
        <View className="h-[52px] justify-center">
          <Pressable
            accessibilityLabel="로그인 화면으로 돌아가기"
            accessibilityRole="button"
            className="h-[40px] w-[40px] items-start justify-center"
            disabled={isSubmitting}
            hitSlop={8}
            onPress={onBack}
          >
            <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View className="mt-lg">
          <AppText size={28} weight="bold" className="leading-[36px]">
            이음 시작 전,{"\n"}약관에 동의해주세요
          </AppText>
          <AppText
            size={15}
            color="textFootnote"
            className="mt-sm leading-[22px]"
          >
            {providerName} 계정 인증이 완료됐어요. 안전한 커뮤니티를 위해
            아래 내용을 확인해주세요.
          </AppText>
        </View>

        <View className="mt-xl rounded-[14px] bg-content px-md">
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: allAccepted }}
            className="flex-row items-center border-b border-[#E5E5EA] py-md"
            onPress={toggleAll}
          >
            <Ionicons
              name={allAccepted ? "checkbox" : "square-outline"}
              size={24}
              color={allAccepted ? colors.accentPrimary : colors.systemGray}
            />
            <AppText size={16} weight="bold" className="ml-sm">
              필수 약관에 모두 동의합니다
            </AppText>
          </Pressable>

          <AgreementRow
            checked={termsAccepted}
            label="이용약관"
            onPress={() => setTermsAccepted((value) => !value)}
            onView={() => void WebBrowser.openBrowserAsync(TERMS_URL)}
          />
          <AgreementRow
            checked={privacyAccepted}
            label="개인정보처리방침"
            onPress={() => setPrivacyAccepted((value) => !value)}
            onView={() => void WebBrowser.openBrowserAsync(PRIVACY_URL)}
          />
          <AgreementRow
            checked={communityAccepted}
            label="커뮤니티 이용약관"
            onPress={() => setCommunityAccepted((value) => !value)}
            onView={() => setShowCommunityTerms(true)}
          />
        </View>

        <View className="mt-md rounded-[14px] bg-content px-md py-md">
          <AppText size={14} weight="bold">
            부적절한 콘텐츠와 악의적인 사용자는 허용되지 않습니다
          </AppText>
          <AppText
            size={13}
            color="textFootnote"
            className="mt-sm leading-[20px]"
          >
            {"• 혐오, 괴롭힘, 성적·폭력적 또는 불법 콘텐츠를 금지합니다.\n• 사용자는 콘텐츠를 신고하고 작성자를 차단할 수 있습니다.\n• 신고는 24시간 이내 검토하며, 위반 콘텐츠 삭제 및 계정 이용 제한 조치를 진행합니다."}
          </AppText>
        </View>

        <View className="mt-auto pt-lg">
          <Pressable
            accessibilityRole="button"
            className="h-[52px] items-center justify-center rounded-[10px]"
            disabled={!allAccepted || isSubmitting}
            onPress={onSubmit}
            style={{
              backgroundColor: allAccepted
                ? colors.accentPrimary
                : colors.systemGray5,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText
                size={16}
                weight="bold"
                style={{ color: allAccepted ? "#FFFFFF" : colors.systemGray }}
              >
                동의하고 시작하기
              </AppText>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
