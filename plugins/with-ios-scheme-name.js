const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

const IOS_SCHEME_NAME = '이음';

module.exports = function withIosSchemeName(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const projectDirectory = fs
        .readdirSync(iosRoot, { withFileTypes: true })
        .find((entry) => entry.isDirectory() && entry.name.endsWith('.xcodeproj'));

      if (!projectDirectory) {
        throw new Error('iOS Xcode project를 찾을 수 없습니다.');
      }

      const projectName = path.basename(projectDirectory.name, '.xcodeproj');
      const schemesDirectory = path.join(
        iosRoot,
        projectDirectory.name,
        'xcshareddata',
        'xcschemes',
      );
      const generatedScheme = path.join(schemesDirectory, `${projectName}.xcscheme`);
      const namedScheme = path.join(schemesDirectory, `${IOS_SCHEME_NAME}.xcscheme`);

      if (fs.existsSync(generatedScheme)) {
        fs.renameSync(generatedScheme, namedScheme);
      } else if (!fs.existsSync(namedScheme)) {
        throw new Error(`iOS 공유 스킴을 찾을 수 없습니다: ${generatedScheme}`);
      }

      return config;
    },
  ]);
};
