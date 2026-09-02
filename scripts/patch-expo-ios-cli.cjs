const fs = require("node:fs");
const path = require("node:path");

const cliPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo",
  "node_modules",
  "@expo",
  "cli",
  "build",
  "src",
  "start",
  "platforms",
  "ios",
  "ensureSimulatorAppRunning.js",
);

const scriptsToReplace = [
  'tell app "System Events" to count processes whose name is "Simulator" or name is "DeviceHub"',
  'tell application "System Events" to count (every process whose name is "Simulator" or name is "DeviceHub")',
];
const patchedScript =
  'if application "Simulator" is running or application "DeviceHub" is running then\\nreturn 1\\nelse\\nreturn 0\\nend if';

if (!fs.existsSync(cliPath)) {
  throw new Error(`Expo iOS CLI file was not found: ${cliPath}`);
}

const source = fs.readFileSync(cliPath, "utf8");

if (source.includes(patchedScript)) {
  process.exit(0);
}

const scriptToReplace = scriptsToReplace.find((script) => source.includes(script));

if (!scriptToReplace) {
  throw new Error(
    "Expo iOS CLI changed and the Simulator AppleScript patch must be reviewed.",
  );
}

fs.writeFileSync(cliPath, source.replace(scriptToReplace, patchedScript));
console.log("Patched Expo iOS Simulator detection for Xcode 27.");
