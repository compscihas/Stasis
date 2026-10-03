#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
flutter_bin="${FLUTTER_BIN:-$(command -v flutter || true)}"
if [[ -z "$flutter_bin" && -x /Users/aryan/flutter/bin/flutter ]]; then
  flutter_bin="/Users/aryan/flutter/bin/flutter"
fi
derived_data="${TMPDIR:-/tmp}/stasis-macos-derived-data"

if [[ -z "$flutter_bin" ]]; then
  echo "Flutter was not found on PATH. Set FLUTTER_BIN to your Flutter executable." >&2
  exit 1
fi

cd "$repo_root"
export FLUTTER_SUPPRESS_ANALYTICS=true

# In this environment, Xcode 27 rejects the generated .xcworkspace even though
# its contents are valid. Build the CocoaPods dependencies first, then Runner
# directly against the same products directory to avoid the workspace parser.
xcodebuild -quiet \
  -project macos/Pods/Pods.xcodeproj \
  -scheme Pods-Runner \
  -configuration Debug \
  -sdk macosx \
  -derivedDataPath "$derived_data" \
  CODE_SIGNING_ALLOWED=NO \
  build

build_args=()
if [[ "${1:-}" == "--morning-checkin-preview" ]]; then
  build_args+=("DART_DEFINES=U1RBU0lTX1BSRVZJRVdfTU9STklOR19DSEVDS0lOPXRydWU=")
fi

xcodebuild -quiet \
  -project macos/Runner.xcodeproj \
  -scheme Runner \
  -configuration Debug \
  -sdk macosx \
  -derivedDataPath "$derived_data" \
  BUILD_DIR="$repo_root/macos/build" \
  "${build_args[@]}" \
  CODE_SIGNING_ALLOWED=NO \
  build

echo "Built app: $repo_root/macos/build/Debug/stasis_ai.app"
