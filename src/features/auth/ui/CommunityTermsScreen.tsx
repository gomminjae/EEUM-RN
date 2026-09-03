import { Linking, Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, colors } from "@/shared/ui";

const SUPPORT_EMAIL = "eeum.app@gmail.com";

type CommunityTermsScreenProps = {
  onBack: () => void;
};

type SectionProps = {
  title: string;
  children: string;
};

function Section({ title, children }: SectionProps) {
  return (
    <View className="mt-lg">
      <AppText size={16} weight="bold">
        {title}
      </AppText>
      <AppText size={14} color="textFootnote" className="mt-sm leading-[22px]">
        {children}
      </AppText>
    </View>
  );
}

export function CommunityTermsScreen({ onBack }: CommunityTermsScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-main" edges={["top", "bottom"]}>
      <View className="h-[52px] flex-row items-center px-lg">
        <Pressable
          accessibilityLabel="약관 동의 화면으로 돌아가기"
          accessibilityRole="button"
          className="h-[40px] w-[40px] items-start justify-center"
          hitSlop={8}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <AppText size={18} weight="bold" className="ml-sm">
          커뮤니티 이용약관
        </AppText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-lg pb-[48px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-md rounded-[14px] bg-content px-md py-md">
          <AppText size={20} weight="bold">
            이음 커뮤니티 이용약관
          </AppText>
          <AppText size={13} color="textFootnote" className="mt-sm">
            시행일: 2026년 8월 23일
          </AppText>
        </View>

        <Section title="제1조 (목적)">
          이 약관은 이음에서 사연, 댓글, 음악 추천 등 이용자가 작성하거나
          공유하는 콘텐츠를 안전하게 이용하기 위한 기준과 이용자의 권리 및
          책임을 정하는 것을 목적으로 합니다.
        </Section>

        <Section title="제2조 (무관용 원칙)">
          이음은 부적절한 콘텐츠와 다른 이용자를 괴롭히거나 위협하는 행위를
          허용하지 않습니다. 이용자는 커뮤니티 기능을 이용하기 전에 본
          약관에 동의해야 하며, 위반 시 콘텐츠 삭제 또는 서비스 이용 제한을
          받을 수 있습니다.
        </Section>

        <Section title="제3조 (금지되는 콘텐츠 및 행위)">
          {"다음 콘텐츠 또는 행위를 게시하거나 조장해서는 안 됩니다.\n\n1. 욕설, 모욕, 괴롭힘, 협박 또는 특정 개인·집단에 대한 혐오 표현\n2. 노골적인 성적 콘텐츠, 미성년자 착취 또는 성적 대상화\n3. 과도한 폭력, 자해·자살을 조장하거나 타인의 안전을 위협하는 콘텐츠\n4. 불법 행위, 범죄, 사기 또는 위험 행위를 조장하는 콘텐츠\n5. 타인의 개인정보 공개, 사칭, 초상권 또는 사생활 침해\n6. 저작권 등 타인의 권리를 침해하는 콘텐츠\n7. 반복 광고, 도배, 스팸 또는 서비스 운영을 방해하는 행위\n8. 제재를 회피하기 위한 계정 생성이나 기능 악용"}
        </Section>

        <Section title="콘텐츠 필터링">
          서비스는 욕설과 명백한 금칙어 등 부적절한 표현의 게시를 제한할 수
          있습니다. 필터를 우회하려는 변형 표현도 운영 정책에 따라 삭제 및
          이용 제한 대상이 될 수 있습니다.
        </Section>

        <Section title="제4조 (콘텐츠 신고)">
          이용자는 앱의 신고 기능을 통해 부적절한 콘텐츠와 작성자를 운영팀에
          알릴 수 있습니다. 신고 시 대상 콘텐츠, 작성자 및 선택한 신고 사유가
          검토를 위해 전달될 수 있습니다. 고의적인 허위 신고나 신고 기능의
          반복적인 악용도 제한 대상이 될 수 있습니다.
        </Section>

        <Section title="제5조 (이용자 차단)">
          이용자는 악의적이거나 원하지 않는 작성자를 차단할 수 있습니다.
          차단 즉시 해당 작성자의 콘텐츠는 차단한 이용자의 피드에서 제거되며,
          차단과 관련된 대상 콘텐츠 및 계정 정보는 부적절한 행위 검토를 위해
          운영팀에 전달될 수 있습니다.
        </Section>

        <Section title="제6조 (검토 및 조치)">
          운영팀은 접수된 신고와 차단 정보를 24시간 이내에 검토합니다. 위반이
          확인되면 해당 콘텐츠를 삭제하고, 위반의 정도와 반복 여부에 따라
          작성자의 기능 사용을 제한하거나 계정을 서비스에서 퇴출할 수
          있습니다. 불법 또는 긴급한 위험이 의심되는 경우 관계 기관에 협조할
          수 있습니다.
        </Section>

        <Section title="제7조 (이의제기 및 문의)">
          조치에 대한 이의제기 또는 커뮤니티 안전 관련 문의는 아래 이메일로
          접수할 수 있습니다. 운영팀은 접수 내용을 확인한 뒤 필요한 경우 추가
          정보를 요청할 수 있습니다.
        </Section>

        <Pressable
          accessibilityRole="link"
          className="mt-md self-start"
          onPress={() => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
        >
          <AppText
            size={14}
            weight="semiBold"
            style={{ color: colors.accentPrimary }}
            className="underline"
          >
            {SUPPORT_EMAIL}
          </AppText>
        </Pressable>

        <Section title="제8조 (약관의 변경)">
          서비스 운영 또는 관련 정책의 변경이 필요한 경우 본 약관을 변경할 수
          있습니다. 중요한 변경 사항은 앱 내 공지 또는 약관 동의 화면을 통해
          안내하고 필요한 경우 다시 동의를 받습니다.
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
