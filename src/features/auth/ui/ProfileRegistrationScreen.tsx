import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, colors } from "@/shared/ui";
import { useAuthStore } from "../model/authStore";
import { containsObjectionableContent } from "@/shared/lib/contentModeration";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileRegistrationScreen() {
  const completeRegistration = useAuthStore(
    (state) => state.completeRegistration,
  );
  const cancelRegistration = useAuthStore((state) => state.cancelRegistration);
  const serverError = useAuthStore((state) => state.error);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (isSubmitting) return;

    const normalizedNickname = nickname.trim();
    if (containsObjectionableContent(normalizedNickname)) {
      Alert.alert(
        "사용할 수 없는 닉네임이에요",
        "욕설이나 다른 사용자를 불쾌하게 할 수 있는 표현을 수정해주세요.",
      );
      return;
    }
    const normalizedEmail = email.trim();
    if (!normalizedNickname) {
      setValidationError("닉네임을 입력해주세요.");
      return;
    }
    if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError("이메일 형식을 확인해주세요.");
      return;
    }

    Keyboard.dismiss();
    setValidationError(null);
    setIsSubmitting(true);
    try {
      await completeRegistration({
        nickname: normalizedNickname,
        ...(normalizedEmail ? { email: normalizedEmail } : {}),
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  const canSubmit = nickname.trim().length > 0 && !isSubmitting;

  return (
    <SafeAreaView className="flex-1 bg-main" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          className="flex-1 px-lg pb-lg"
          accessible={false}
          onPress={Keyboard.dismiss}
        >
          <View className="h-[52px] justify-center">
            <Pressable
              accessibilityLabel="로그인 화면으로 돌아가기"
              accessibilityRole="button"
              className="h-[40px] w-[40px] items-start justify-center"
              disabled={isSubmitting}
              hitSlop={8}
              onPress={cancelRegistration}
            >
              <Ionicons
                name="chevron-back"
                size={26}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <View className="mt-lg">
            <AppText size={28} weight="bold" className="leading-[36px]">
              회원가입을 완료해주세요
            </AppText>
            <AppText
              size={15}
              color="textFootnote"
              className="mt-sm leading-[22px]"
            >
              이음에서 사용할 프로필 정보를 입력해주세요.
            </AppText>
          </View>

          <View className="mt-xl gap-md">
            <View>
              <AppText size={14} weight="semiBold" className="mb-sm">
                닉네임
              </AppText>
              <TextInput
                accessibilityLabel="닉네임"
                className="h-[52px] rounded-[10px] bg-content px-md font-regular text-[16px] text-primary"
                value={nickname}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                maxLength={30}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor={colors.secondaryLabel}
                returnKeyType="next"
                onChangeText={setNickname}
              />
            </View>

            <View>
              <AppText size={14} weight="semiBold" className="mb-sm">
                이메일 (선택)
              </AppText>
              <TextInput
                accessibilityLabel="이메일"
                className="h-[52px] rounded-[10px] bg-content px-md font-regular text-[16px] text-primary"
                value={email}
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                editable={!isSubmitting}
                keyboardType="email-address"
                placeholder="example@email.com"
                placeholderTextColor={colors.secondaryLabel}
                returnKeyType="done"
                textContentType="emailAddress"
                onChangeText={setEmail}
                onSubmitEditing={() => void submit()}
              />
            </View>

            {(validationError || serverError) && (
              <AppText size={13} color="systemRed" className="leading-[18px]">
                {validationError || serverError}
              </AppText>
            )}
          </View>

          <View className="mt-auto pt-lg">
            <Pressable
              accessibilityRole="button"
              className="h-[52px] items-center justify-center rounded-[10px]"
              disabled={!canSubmit}
              onPress={() => void submit()}
              style={{
                backgroundColor: canSubmit
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
                  style={{
                    color: canSubmit ? "#FFFFFF" : colors.systemGray,
                  }}
                >
                  가입하고 시작하기
                </AppText>
              )}
            </Pressable>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
