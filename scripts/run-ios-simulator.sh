#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
workspace_path="$project_dir/ios/app.xcworkspace"
derived_data_path="${IOS_DERIVED_DATA_PATH:-$project_dir/ios/build}"
scheme_name="${IOS_SCHEME:-이음}"
configuration_name="${IOS_CONFIGURATION:-Release}"
simulator_name="${IOS_SIMULATOR:-iPhone 17 Pro}"
app_bundle_id="${IOS_APP_BUNDLE_ID:-com.eeum.app}"

simulator_udid=$(
  xcrun simctl list devices booted |
    awk -F '[()]' '/Booted/ { print $2; exit }'
)

if [ -z "$simulator_udid" ]; then
  simulator_udid=$(
    xcrun simctl list devices available |
      awk -F '[()]' -v name="$simulator_name" 'index($0, name " (") { print $2; exit }'
  )

  if [ -z "$simulator_udid" ]; then
    echo "No available iOS simulator named '$simulator_name'." >&2
    exit 1
  fi

  xcrun simctl boot "$simulator_udid"
  xcrun simctl bootstatus "$simulator_udid" -b
fi

open -a Simulator --args -CurrentDeviceUDID "$simulator_udid"

xcodebuild \
  -workspace "$workspace_path" \
  -scheme "$scheme_name" \
  -configuration "$configuration_name" \
  -sdk iphonesimulator \
  -destination "id=$simulator_udid" \
  -derivedDataPath "$derived_data_path" \
  COMPILER_INDEX_STORE_ENABLE=NO \
  build

app_bundle_path="$derived_data_path/Build/Products/$configuration_name-iphonesimulator/app.app"

xcrun simctl install "$simulator_udid" "$app_bundle_path"
xcrun simctl launch --terminate-running-process "$simulator_udid" "$app_bundle_id"
