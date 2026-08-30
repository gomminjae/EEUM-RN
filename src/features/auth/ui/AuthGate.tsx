import { useEffect, type ReactNode } from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@/shared/ui";
import { useAuthStore } from "../model/authStore";
import { LoginScreen } from "./LoginScreen";
import { ProfileRegistrationScreen } from "./ProfileRegistrationScreen";
import { TermsAgreementScreen } from "./TermsAgreementScreen";

/** 앱 진입 게이트: 저장된 소셜 세션을 확인한 뒤 로그인 또는 앱 화면을 표시한다. */
export function AuthGate({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const pendingProvider = useAuthStore((s) => s.pendingProvider);
  const acceptRegistrationTerms = useAuthStore(
    (s) => s.acceptRegistrationTerms,
  );
  const cancelRegistration = useAuthStore((s) => s.cancelRegistration);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (status === "authenticated") return <>{children}</>;

  if (status === "registration_terms_required") {
    return (
      <TermsAgreementScreen
        providerName={pendingProvider === "APPLE" ? "Apple" : "카카오"}
        isSubmitting={false}
        onBack={cancelRegistration}
        onSubmit={acceptRegistrationTerms}
      />
    );
  }

  if (status === "registration_required") {
    return <ProfileRegistrationScreen />;
  }

  if (status === "unauthenticated") {
    return <LoginScreen />;
  }

  // idle | loading
  return (
    <View className="flex-1 items-center justify-center bg-main gap-md p-lg">
      <ActivityIndicator color={colors.accentPrimary} />
    </View>
  );
}
