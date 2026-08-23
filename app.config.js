/**
 * Kakao Native App Key는 빌드 설정값이라 app.json에 커밋하지 않는다.
 * 로컬에서는 .env.local, CI/EAS에서는 KAKAO_NATIVE_APP_KEY 환경 변수로 주입한다.
 */
module.exports = ({ config }) => {
  const kakaoAppKey = process.env.KAKAO_NATIVE_APP_KEY;

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ...(kakaoAppKey
        ? [
            [
              "@react-native-seoul/kakao-login",
              {
                kakaoAppKey,
              },
            ],
          ]
        : []),
    ],
  };
};
