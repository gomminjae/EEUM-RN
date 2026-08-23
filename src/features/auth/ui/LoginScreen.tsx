import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { login as loginWithKakao } from "@react-native-seoul/kakao-login";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppImage, AppText, colors, images } from "@/shared/ui";
import type { SocialAuthProvider } from "../api/authApi";
import { useAuthStore } from "../model/authStore";
import { TermsAgreementScreen } from "./TermsAgreementScreen";

type NativeAuthError = {
  code?: string;
  message?: string;
};

function isCanceled(error: unknown): boolean {
  const { code, message } = (error ?? {}) as NativeAuthError;
  return (
    code === "ERR_REQUEST_CANCELED" ||
    code === "E_CANCELLED_OPERATION" ||
    code === "E_CANCELLED" ||
    message?.toLowerCase().includes("cancel") === true
  );
}

function errorMessage(error: unknown): string {
  const message = (error as NativeAuthError | undefined)?.message;
  return message || "로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.";
}

export function LoginScreen() {
  const serverError = useAuthStore((state) => state.error);
  const signInWithIdToken = useAuthStore((state) => state.signInWithIdToken);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [authCandidate, setAuthCandidate] = useState<{
    idToken: string;
    provider: SocialAuthProvider;
  } | null>(null);
  const [pendingProvider, setPendingProvider] = useState<
    "APPLE" | "KAKAO" | null
  >(null);
  const [nativeError, setNativeError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    void AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => {
        setAppleAvailable(false);
      });
  }, []);

  const handleAppleLogin = async () => {
    if (pendingProvider) return;
    setNativeError(null);
    setPendingProvider("APPLE");
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken) {
        throw new Error("Apple에서 로그인 토큰을 받지 못했어요.");
      }
      setAuthCandidate({
        idToken: credential.identityToken,
        provider: "APPLE",
      });
    } catch (error) {
      if (!isCanceled(error)) setNativeError(errorMessage(error));
    } finally {
      setPendingProvider(null);
    }
  };

  const handleKakaoLogin = async () => {
    if (pendingProvider) return;
    setNativeError(null);
    setPendingProvider("KAKAO");
    try {
      const token = await loginWithKakao();
      if (!token.idToken) {
        throw new Error(
          "카카오 OpenID Connect가 활성화되지 않아 ID 토큰을 받지 못했어요.",
        );
      }
      setAuthCandidate({ idToken: token.idToken, provider: "KAKAO" });
    } catch (error) {
      if (!isCanceled(error)) setNativeError(errorMessage(error));
    } finally {
      setPendingProvider(null);
    }
  };

  const disabled = pendingProvider !== null;

  if (authCandidate) {
    return (
      <TermsAgreementScreen
        providerName={authCandidate.provider === "APPLE" ? "Apple" : "카카오"}
        isSubmitting={false}
        onBack={() => setAuthCandidate(null)}
        onSubmit={() =>
          void signInWithIdToken(
            authCandidate.idToken,
            authCandidate.provider,
          )
        }
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-main" edges={["top", "bottom"]}>
      <View className="flex-1 px-lg pb-lg pt-xl">
        <View className="flex-1 items-center justify-center">
          <AppImage
            source={images.logo}
            style={{ width: 64, height: 64 }}
            contentFit="contain"
          />
          <AppText size={30} weight="bold" className="mt-md">
            이음
          </AppText>
          <AppText
            size={16}
            color="textFootnote"
            className="mt-sm text-center leading-[23px]"
          >
            {"누군가의 이야기에 음악으로 답하고\n함께 플레이리스트를 완성해요"}
          </AppText>
        </View>

        {(nativeError || serverError) && (
          <AppText
            size={13}
            color="systemRed"
            className="mb-sm text-center leading-[18px]"
          >
            {nativeError || serverError}
          </AppText>
        )}

        <View className="gap-[10px]" style={{ opacity: disabled ? 0.45 : 1 }}>
          <Pressable
            accessibilityRole="button"
            className="h-[50px] flex-row items-center justify-center rounded-[8px] bg-[#FEE500]"
            disabled={disabled}
            onPress={handleKakaoLogin}
          >
            {pendingProvider === "KAKAO" ? (
              <ActivityIndicator color="#191919" />
            ) : (
              <>
                <Ionicons name="chatbubble" size={18} color="#191919" />
                <AppText
                  size={16}
                  weight="semiBold"
                  style={{ color: "#191919" }}
                  className="ml-sm"
                >
                  카카오로 계속하기
                </AppText>
              </>
            )}
          </Pressable>

          {appleAvailable && (
            <View pointerEvents={disabled ? "none" : "auto"}>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={8}
                style={{ width: "100%", height: 50 }}
                onPress={handleAppleLogin}
              />
              {pendingProvider === "APPLE" && (
                <View
                  pointerEvents="none"
                  className="absolute inset-0 items-center justify-center rounded-[8px] bg-black"
                >
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              )}
            </View>
          )}
        </View>

        <AppText size={12} color="textFootnote" className="mt-sm text-center">
          소셜 계정 인증 후 필수 약관에 동의하면 로그인이 완료됩니다.
        </AppText>
      </View>
    </SafeAreaView>
  );
}
