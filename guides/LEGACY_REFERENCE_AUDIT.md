# Legacy reference audit

Generated after the Stasis AI fork changes on 1 August 2026.

Interpretation:

- Old Flutter package, bundle, Android application, and App Group identifiers: none remain.
- Original cloud endpoints: no hardcoded data/telemetry endpoint remains. Upstream project links remain only for compatibility and attribution.
- `OpenStrapWidget*`, `OpenStrap*Attributes`, Xcode target/source names, method-channel names, `buildOpenStrapTheme`, and related test references are intentionally preserved compatibility symbols. Renaming them would couple a branding change to native bridge, ActivityKit/WidgetKit, or test behavior.
- `openstrap_protocol`, `openstrap_analytics`, upstream GitHub links, third-party notices, and contributor docs are intentionally preserved dependency and attribution references.
- `openstrap.db`, schema/migration names, and “OpenStrap Edge backup” wording are intentionally preserved for import/migration compatibility.
- AGENTS.md and historical implementation comments describe the upstream architecture and are retained as engineering history.
- Legacy `BACKEND_URL` is retained only for an explicitly configured one-time historical account import. Legacy `COMPANION_URL` source remains for compilation compatibility, but `CompanionClient.legacyTransportEnabled` is hardcoded false.

## Every remaining old product-name occurrence

```text
.\CONTRIBUTING.md:12:| A new record type, opcode, event, or anything about the bytes on the wire | [**protocol**](https://github.com/OpenStrap/protocol) |
.\CONTRIBUTING.md:13:| A new metric, or a change to how an existing number is computed | [**analytics**](https://github.com/OpenStrap/analytics) |
.\CONTRIBUTING.md:14:| Bluetooth reliability, storage, background sync, UI, anything app-shaped | [**edge**](https://github.com/OpenStrap/edge) (here) |
.\CONTRIBUTING.md:53:git clone https://github.com/OpenStrap/edge.git
.\CONTRIBUTING.md:106:[protocol](https://github.com/OpenStrap/protocol/issues) with the raw bytes, what
.\AGENTS.md:1:# AGENTS.md — OpenStrap `edge`
.\AGENTS.md:18:- `OpenStrap/protocol` — bytes: GATT, framing, CRC, opcodes, record decode.
.\AGENTS.md:19:- `OpenStrap/analytics` — metrics: HRV, sleep staging, readiness, strain.
.\AGENTS.md:20:- `OpenStrap/edge` (**this repo**) — flows, BLE link management, storage, UI.
.\pubspec.yaml:5:# CURRENT_PROJECT_VERSION for the OpenStrapWidget(Extension) and "OpenStrapWatch
.\pubspec.yaml:37:      url: https://github.com/OpenStrap/protocol.git
.\pubspec.yaml:38:      # Tip of protocol main — OpenStrap/protocol#20 merged: the reassembler now
.\pubspec.yaml:51:      url: https://github.com/OpenStrap/analytics.git
.\pubspec.yaml:52:      # PR-BRANCH HEAD, not main — OpenStrap/analytics#32 (fix/issue-170-...)
.\pubspec.yaml:147:  # File picker for data imports (NOOP raw CSV, Edge .db backup, WHOOP export CSV).
.\DONATE.md:3:Stasis AI is a private fork and does not collect donations through this repository. The original MIT-licensed OpenStrap project and its protocol research remain credited in [Third-Party Notices](THIRD_PARTY_NOTICES.md) and [Notice](NOTICE.md).
.\THIRD_PARTY_NOTICES.md:10:Copyright (c) 2026 OpenStrap
.\PRIVACY.md:23:Firebase Analytics, Crashlytics, and Performance collection are disabled at native startup. They remain unavailable unless the developer supplies their own Firebase configuration and the user opts in. The Stasis build template does not configure the original OpenStrap backend, companion service, telemetry, crash, OTA, or health-data endpoints. No health data, telemetry, or crash data is intentionally sent to original infrastructure.
.\NOTICE.md:10:see [the protocol repo's README](https://github.com/OpenStrap/protocol) for
.\docs\legal.html:44:    <p>Source: <a href="https://github.com/OpenStrap/edge">github.com/OpenStrap/edge</a></p>
.\README.md:5:This repository is a branded fork of the MIT-licensed OpenStrap Edge project. Protocol and analytics dependency/package names remain unchanged for compatibility and attribution.
.\README.md:72:`openstrap_protocol`, `openstrap_analytics`, `openstrap.db`, schema/table/view names, migration identifiers, method-channel names, and native source/type names such as `OpenStrapWidget` remain where changing them could break stored data, protocol behavior, Flutter/native communication, WidgetKit state, or dependency imports. See [migration notes](guides/MIGRATION_FROM_OPENSTRAP.md).
.\README.md:76:Stasis-specific original contributions are not released under the MIT License.
.\tool\gen_star_history.py:30:# OpenStrap/protocol from a job running in OpenStrap/edge returns
.\tool\gen_star_history.py:34:#   STAR_HISTORY_REPOS="OpenStrap/edge,OpenStrap/protocol" python3 tool/gen_star_history.py
.\tool\gen_star_history.py:41:         os.environ.get("STAR_HISTORY_REPOS", "OpenStrap/edge").split(",")
.\docs\notice.html:26:      are not released under the MIT License. Portions inherited from OpenStrap Edge
.\docs\notice.html:34:      <a href="https://github.com/OpenStrap/protocol">protocol package's README</a>
.\docs\notice.html:39:    <p>Source: <a href="https://github.com/OpenStrap/edge">github.com/OpenStrap/edge</a></p>
.\lib\app.dart:209:      // in OpenStrapIntents.swift, which writes this route into the App Group
.\docs\terms.html:36:      <a href="https://github.com/OpenStrap/edge">https://github.com/OpenStrap/edge</a>.</p>
.\docs\terms.html:101:      inherited from OpenStrap Edge remain subject to their original MIT terms and
.\docs\terms.html:119:    <p>Source: <a href="https://github.com/OpenStrap/edge">github.com/OpenStrap/edge</a></p>
.\docs\style.css:1:/* OpenStrap legal-docs site — minimal, no build step, no framework.
.\test\absent_not_zero_test.dart:27:    theme: buildOpenStrapTheme(palette),
.\lib\ai\briefing_engine.dart:3:// no second LLM client, no second key store, no OpenStrap backend).
.\guides\WATCH_SETUP.md:24: Watch Widget Ext ──►  OpenStrapWatchWidgetBundle.swift (complications)     [watch]
.\guides\WATCH_SETUP.md:26: Siri / Shortcuts / Ultra Action Button ──► OpenStrapIntents.swift          [phone]
.\guides\WATCH_SETUP.md:31:- `ios/OpenStrapIntents.swift` — Siri App Intents (add to **Runner**).
.\guides\WATCH_SETUP.md:32:- `ios/OpenStrapWatch/OpenStrapWatchApp.swift`, `WatchStore.swift`, `WatchMetrics.swift` — the Watch App.
.\guides\WATCH_SETUP.md:33:- `ios/OpenStrapWatchWidget/OpenStrapWatchWidgetBundle.swift` — the complications.
.\guides\WATCH_SETUP.md:39:2. **File ▸ New ▸ Target… ▸ watchOS ▸ App**. Name it `OpenStrapWatch`.
.\guides\WATCH_SETUP.md:46:   OpenStrapWatch target): `OpenStrapWatchApp.swift`, `WatchStore.swift`,
.\guides\WATCH_SETUP.md:54:   `OpenStrapWatchWidget`. **Uncheck** "Include Configuration App Intent" (we use
.\guides\WATCH_SETUP.md:55:   a static configuration). Embed it in **OpenStrapWatch**.
.\guides\WATCH_SETUP.md:57:3. Add to the **Watch Widget** target: `OpenStrapWatchWidgetBundle.swift` **and**
.\guides\WATCH_SETUP.md:73:1. Add `ios/OpenStrapIntents.swift` to the **Runner** target (drag in, tick
.\guides\WATCH_SETUP.md:86:Then in Xcode select the **OpenStrapWatch** scheme + your paired Ultra and Run.
.\test\ai_breakdown_widget_test.dart:43:      theme: buildOpenStrapTheme(palette),
.\test\ai_screen_async_guards_test.dart:41:    child: MaterialApp(theme: buildOpenStrapTheme(kLightPalette), home: child),
.\ios\WatchBridge.swift:21:  // with lib/widget/widget_service.dart and OpenStrapWidget.swift.
.\guides\IOS_SIDELOAD.md:3:The iOS file on [Releases](https://github.com/OpenStrap/edge/releases) is an
.\guides\IOS_SIDELOAD.md:20:- The `.ipa` file from [the latest release](https://github.com/OpenStrap/edge/releases).
.\lib\health\health_export.dart:146:  /// Open the Health Connect app / settings so the user can enable OpenStrap's
.\test\calm_breathing_view_test.dart:16:    theme: buildOpenStrapTheme(kLightPalette),
.\guides\IOS_INSTALLATION.md:139:The compatibility-named **`OpenStrapWidget`/`OpenStrapWidgetExtension`** and **`OpenStrapWatch Watch
.\ios\OpenStrapWatchWidget\OpenStrapWatchWidgetBundle.swift:1:// OpenStrap Watch complications — WidgetKit widgets for the Apple Watch face.
.\ios\OpenStrapWatchWidget\OpenStrapWatchWidgetBundle.swift:49:  let kind = "OpenStrapRecovery"
.\ios\OpenStrapWatchWidget\OpenStrapWatchWidgetBundle.swift:93:  let kind = "OpenStrapToday"
.\ios\OpenStrapWatchWidget\OpenStrapWatchWidgetBundle.swift:141:struct OpenStrapWatchWidgetBundle: WidgetBundle {
.\lib\widget\widget_service.dart:25:  static const String _iOSName = 'OpenStrapWidget';
.\lib\widget\widget_service.dart:28:  static const String _batteryIOSName = 'OpenStrapBatteryWidget';
.\lib\widget\widget_service.dart:29:  static const String _androidName = 'OpenStrapWidgetProvider';
.\lib\widget\widget_service.dart:32:  static const String _batteryAndroidName = 'OpenStrapBatteryWidgetProvider';
.\lib\widget\widget_service.dart:212:  /// `end_session` — EndBreathingIntent in OpenStrapBreathingLiveActivity.swift
.\lib\data\db.dart:3278:  /// Import another device's exported OpenStrap DB ([path], from [exportCopy] +
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:2://  OpenStrapWidgetLiveActivity.swift
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:8://  The attributes struct lives in Shared/OpenStrapActivityAttributes.swift
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:22:struct OpenStrapWidgetAttributes: ActivityAttributes {
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:140:    for activity in Activity<OpenStrapWidgetAttributes>.activities {
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:150:  let context: ActivityViewContext<OpenStrapWidgetAttributes>
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:194:struct OpenStrapWidgetLiveActivity: Widget {
.\ios\OpenStrapWidget\OpenStrapWidgetLiveActivity.swift:196:    ActivityConfiguration(for: OpenStrapWidgetAttributes.self) { context in
.\ios\OpenStrapWidget\OpenStrapWidgetControl.swift:2://  OpenStrapWidgetControl.swift
.\ios\OpenStrapWidget\OpenStrapWidgetControl.swift:3://  OpenStrapWidget
.\ios\OpenStrapWidget\OpenStrapWidgetControl.swift:12:struct OpenStrapWidgetControl: ControlWidget {
.\ios\OpenStrapWidget\OpenStrapWidgetControl.swift:15:            kind: Bundle.main.bundleIdentifier ?? "OpenStrapWidget",
.\ios\OpenStrapWidget\OpenStrapWidgetControl.swift:31:extension OpenStrapWidgetControl {
.\ios\Runner\BgSyncScheduler.swift:5:/// BGTaskScheduler bridge for OpenStrap Edge.
.\ios\Runner\BgSyncScheduler.swift:15:///   - "location" is NOT added to UIBackgroundModes: OpenStrap has no GPS /
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:2://  OpenStrapWidgetBundle.swift
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:3://  OpenStrapWidget
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:12:struct OpenStrapWidgetBundle: WidgetBundle {
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:14:        OpenStrapWidget()
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:15:        OpenStrapBatteryWidget()
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:16:        OpenStrapWidgetControl()
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:17:        OpenStrapWidgetLiveActivity()
.\ios\OpenStrapWidget\OpenStrapWidgetBundle.swift:18:        OpenStrapBreathingLiveActivity()
.\ios\OpenStrapWidget\OpenStrapWidget.swift:2://  OpenStrapWidget.swift
.\ios\OpenStrapWidget\OpenStrapWidget.swift:3://  OpenStrapWidget
.\ios\OpenStrapWidget\OpenStrapWidget.swift:9://  (OpenStrapWidgetBundle.swift) owns it.
.\ios\OpenStrapWidget\OpenStrapWidget.swift:55:struct OpenStrapEntry: TimelineEntry {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:67:  static let placeholder = OpenStrapEntry(
.\ios\OpenStrapWidget\OpenStrapWidget.swift:101:  static func read() -> OpenStrapEntry {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:103:    return OpenStrapEntry(
.\ios\OpenStrapWidget\OpenStrapWidget.swift:116:  static func write(_ e: OpenStrapEntry) {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:139:  static func fetch(fallback: OpenStrapEntry, completion: @escaping (OpenStrapEntry) -> Void) {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:161:  private static func parse(_ j: [String: Any]) -> OpenStrapEntry? {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:185:    return OpenStrapEntry(date: Date(), hasData: hasData, readiness: readiness, strain: strain,
.\ios\OpenStrapWidget\OpenStrapWidget.swift:194:  func placeholder(in context: Context) -> OpenStrapEntry { .placeholder }
.\ios\OpenStrapWidget\OpenStrapWidget.swift:196:  func getSnapshot(in context: Context, completion: @escaping (OpenStrapEntry) -> Void) {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:200:  func getTimeline(in context: Context, completion: @escaping (Timeline<OpenStrapEntry>) -> Void) {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:264:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:287:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:307:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:327:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:340:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:354:  let e: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:376:struct OpenStrapWidgetEntryView: View {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:378:  var entry: OpenStrapEntry
.\ios\OpenStrapWidget\OpenStrapWidget.swift:406:struct OpenStrapWidget: Widget {
.\ios\OpenStrapWidget\OpenStrapWidget.swift:407:  let kind: String = "OpenStrapWidget"
.\ios\OpenStrapWidget\OpenStrapWidget.swift:411:      OpenStrapWidgetEntryView(entry: entry)
.\lib\cloud\companion_client.dart:22:  /// Legacy OpenStrap companion transport is retained only so historical code
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:2://  OpenStrapBreathingLiveActivity.swift
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:8://  Deliberately separate from OpenStrapWidgetLiveActivity.swift (the workout
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:28:struct OpenStrapBreathingAttributes: ActivityAttributes {
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:35:// MARK: - Palette (mirrors OpenStrapWidgetLiveActivity's, kept local —
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:77:    for activity in Activity<OpenStrapBreathingAttributes>.activities {
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:87:  let context: ActivityViewContext<OpenStrapBreathingAttributes>
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:125:struct OpenStrapBreathingLiveActivity: Widget {
.\ios\OpenStrapWidget\OpenStrapBreathingLiveActivity.swift:127:    ActivityConfiguration(for: OpenStrapBreathingAttributes.self) { context in
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:2://  OpenStrapBatteryWidget.swift
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:3://  OpenStrapWidget
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:8://  it is NOT part of /today — so unlike OpenStrapWidget this one does NOT
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:22:// MARK: - Theme (mirrors OpenStrapWidget's Ember-on-Paper / Char)
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:219:struct OpenStrapBatteryEntryView: View {
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:248:struct OpenStrapBatteryWidget: Widget {
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:249:  let kind: String = "OpenStrapBatteryWidget"
.\ios\OpenStrapWidget\OpenStrapBatteryWidget.swift:253:      OpenStrapBatteryEntryView(entry: entry)
.\ios\OpenStrapWatch Watch App\OpenStrapWatchApp.swift:1:// Edge Watch App — the on-wrist glance for today's recovery, strain and sleep.
.\ios\OpenStrapWatch Watch App\OpenStrapWatchApp.swift:11:struct OpenStrapWatchApp: App {
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:19:               BuildableName = "OpenStrapWatch Watch App.app"
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:20:               BlueprintName = "OpenStrapWatch Watch App"
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:49:            BuildableName = "OpenStrapWatch Watch App.app"
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:50:            BlueprintName = "OpenStrapWatch Watch App"
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:66:            BuildableName = "OpenStrapWatch Watch App.app"
.\ios\Runner.xcodeproj\xcshareddata\xcschemes\OpenStrapWatch Watch App.xcscheme:67:            BlueprintName = "OpenStrapWatch Watch App"
.\ios\OpenStrapIntents.swift:1:// OpenStrap App Intents — Siri / Shortcuts / Spotlight / Ultra Action Button.
.\ios\OpenStrapIntents.swift:5:// they're AppShortcuts, they work with zero user setup: "Hey Siri, OpenStrap
.\ios\OpenStrapIntents.swift:14:enum OpenStrapShared {
.\ios\OpenStrapIntents.swift:45:    guard OpenStrapShared.hasData, OpenStrapShared.readiness >= 0 else {
.\ios\OpenStrapIntents.swift:46:      return .result(dialog: IntentDialog(stringLiteral: OpenStrapShared.noData))
.\ios\OpenStrapIntents.swift:48:    let r = OpenStrapShared.readiness
.\ios\OpenStrapIntents.swift:61:    guard OpenStrapShared.hasData, OpenStrapShared.strain >= 0 else {
.\ios\OpenStrapIntents.swift:62:      return .result(dialog: IntentDialog(stringLiteral: OpenStrapShared.noData))
.\ios\OpenStrapIntents.swift:64:    let s = String(format: "%.1f", OpenStrapShared.strain)
.\ios\OpenStrapIntents.swift:76:    guard OpenStrapShared.hasData, OpenStrapShared.sleepMin >= 0 else {
.\ios\OpenStrapIntents.swift:77:      return .result(dialog: IntentDialog(stringLiteral: OpenStrapShared.noData))
.\ios\OpenStrapIntents.swift:79:    return .result(dialog: "You slept \(OpenStrapShared.sleepText) last night.")
.\ios\OpenStrapIntents.swift:101:    OpenStrapShared.defaults()?.set("/breathing", forKey: "pending_route")
.\ios\OpenStrapIntents.swift:109:struct OpenStrapShortcuts: AppShortcutsProvider {
.\ios\BreathingLiveActivityBridge.swift:17:// the widget extension (OpenStrapBreathingLiveActivity.swift) — ActivityKit
.\ios\BreathingLiveActivityBridge.swift:21:// as OpenStrapShared.readiness/strain/etc in OpenStrapIntents.swift) rather
.\ios\BreathingLiveActivityBridge.swift:26:struct OpenStrapBreathingAttributes: ActivityAttributes {
.\ios\BreathingLiveActivityBridge.swift:55:  private static func state(_ a: [String: Any]) -> OpenStrapBreathingAttributes.ContentState {
.\ios\BreathingLiveActivityBridge.swift:63:    for act in Activity<OpenStrapBreathingAttributes>.activities {
.\ios\BreathingLiveActivityBridge.swift:66:    let attrs = OpenStrapBreathingAttributes(
.\ios\BreathingLiveActivityBridge.swift:80:    for act in Activity<OpenStrapBreathingAttributes>.activities {
.\ios\BreathingLiveActivityBridge.swift:87:    for act in Activity<OpenStrapBreathingAttributes>.activities {
.\ios\LiveActivityBridge.swift:13:// widget extension (OpenStrapWidgetLiveActivity.swift) — ActivityKit matches the
.\ios\LiveActivityBridge.swift:16:struct OpenStrapWidgetAttributes: ActivityAttributes {
.\ios\LiveActivityBridge.swift:55:  private static func state(_ a: [String: Any]) -> OpenStrapWidgetAttributes.ContentState {
.\ios\LiveActivityBridge.swift:64:    for act in Activity<OpenStrapWidgetAttributes>.activities {
.\ios\LiveActivityBridge.swift:67:    let attrs = OpenStrapWidgetAttributes(
.\ios\LiveActivityBridge.swift:83:    for act in Activity<OpenStrapWidgetAttributes>.activities {
.\ios\LiveActivityBridge.swift:90:    for act in Activity<OpenStrapWidgetAttributes>.activities {
.\lib\ble\ios_ble_restore.dart:8:// No-op on Android (the Edge Tracking foreground service keeps the process + live
.\test\core_screens_test.dart:23:    theme: buildOpenStrapTheme(palette),
.\test\core_screens_test.dart:418:            theme: buildOpenStrapTheme(p),
.\test\core_screens_test.dart:490:            theme: buildOpenStrapTheme(p),
.\lib\compute\derivation_engine.dart:314:// Edge side of that change:
.\lib\ui\coach\coach_settings_screen.dart:3:// device keychain; nothing here touches OpenStrap servers.
.\test\design_redesign_test.dart:28:    theme: buildOpenStrapTheme(palette),
.\ios\Runner.xcodeproj\project.pbxproj:19:		5348974E2FDC19C90033A4D9 /* OpenStrapWidgetExtension.appex in Embed Foundation Extensions */ = {isa = PBXBuildFile; fileRef = 5348973B2FDC19C80033A4D9 /* OpenStrapWidgetExtension.appex */; settings = {ATTRIBUTES = (RemoveHeadersOnCopy, ); }; };
.\ios\Runner.xcodeproj\project.pbxproj:22:		53962E972FF6EE120061A61B /* OpenStrapIntents.swift in Sources */ = {isa = PBXBuildFile; fileRef = 53962E942FF6EE120061A61B /* OpenStrapIntents.swift */; };
.\ios\Runner.xcodeproj\project.pbxproj:31:		FADE0001FADE0001FADE0001 /* OpenStrapWatch Watch App.app in Embed Watch Content */ = {isa = PBXBuildFile; fileRef = 53962EBE2FF6EF790061A61B /* OpenStrapWatch Watch App.app */; settings = {ATTRIBUTES = (RemoveHeadersOnCopy, ); }; };
.\ios\Runner.xcodeproj\project.pbxproj:47:			remoteInfo = OpenStrapWidgetExtension;
.\ios\Runner.xcodeproj\project.pbxproj:54:			remoteInfo = "OpenStrapWatch Watch App";
.\ios\Runner.xcodeproj\project.pbxproj:65:				5348974E2FDC19C90033A4D9 /* OpenStrapWidgetExtension.appex in Embed Foundation Extensions */,
.\ios\Runner.xcodeproj\project.pbxproj:86:				FADE0001FADE0001FADE0001 /* OpenStrapWatch Watch App.app in Embed Watch Content */,
.\ios\Runner.xcodeproj\project.pbxproj:102:		5348973B2FDC19C80033A4D9 /* OpenStrapWidgetExtension.appex */ = {isa = PBXFileReference; explicitFileType = "wrapper.app-extension"; includeInIndex = 0; path = OpenStrapWidgetExtension.appex; sourceTree = BUILT_PRODUCTS_DIR; };
.\ios\Runner.xcodeproj\project.pbxproj:106:		534897572FDC1A610033A4D9 /* OpenStrapWidgetExtension.entitlements */ = {isa = PBXFileReference; lastKnownFileType = text.plist.entitlements; path = OpenStrapWidgetExtension.entitlements; sourceTree = "<group>"; };
.\ios\Runner.xcodeproj\project.pbxproj:108:		53962E942FF6EE120061A61B /* OpenStrapIntents.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = OpenStrapIntents.swift; sourceTree = "<group>"; };
.\ios\Runner.xcodeproj\project.pbxproj:110:		53962EBE2FF6EF790061A61B /* OpenStrapWatch Watch App.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = "OpenStrapWatch Watch App.app"; sourceTree = BUILT_PRODUCTS_DIR; };
.\ios\Runner.xcodeproj\project.pbxproj:137:		534897532FDC19C90033A4D9 /* Exceptions for "OpenStrapWidget" folder in "OpenStrapWidgetExtension" target */ = {
.\ios\Runner.xcodeproj\project.pbxproj:142:			target = 5348973A2FDC19C80033A4D9 /* OpenStrapWidgetExtension */;
.\ios\Runner.xcodeproj\project.pbxproj:147:		534897402FDC19C80033A4D9 /* OpenStrapWidget */ = {
.\ios\Runner.xcodeproj\project.pbxproj:150:				534897532FDC19C90033A4D9 /* Exceptions for "OpenStrapWidget" folder in "OpenStrapWidgetExtension" target */,
.\ios\Runner.xcodeproj\project.pbxproj:156:			path = OpenStrapWidget;
.\ios\Runner.xcodeproj\project.pbxproj:159:		53962EBF2FF6EF790061A61B /* OpenStrapWatch Watch App */ = {
.\ios\Runner.xcodeproj\project.pbxproj:167:			path = "OpenStrapWatch Watch App";
.\ios\Runner.xcodeproj\project.pbxproj:250:				53962E942FF6EE120061A61B /* OpenStrapIntents.swift */,
.\ios\Runner.xcodeproj\project.pbxproj:254:				534897572FDC1A610033A4D9 /* OpenStrapWidgetExtension.entitlements */,
.\ios\Runner.xcodeproj\project.pbxproj:258:				534897402FDC19C80033A4D9 /* OpenStrapWidget */,
.\ios\Runner.xcodeproj\project.pbxproj:259:				53962EBF2FF6EF790061A61B /* OpenStrapWatch Watch App */,
.\ios\Runner.xcodeproj\project.pbxproj:273:				5348973B2FDC19C80033A4D9 /* OpenStrapWidgetExtension.appex */,
.\ios\Runner.xcodeproj\project.pbxproj:274:				53962EBE2FF6EF790061A61B /* OpenStrapWatch Watch App.app */,
.\ios\Runner.xcodeproj\project.pbxproj:334:		5348973A2FDC19C80033A4D9 /* OpenStrapWidgetExtension */ = {
.\ios\Runner.xcodeproj\project.pbxproj:336:			buildConfigurationList = 534897542FDC19C90033A4D9 /* Build configuration list for PBXNativeTarget "OpenStrapWidgetExtension" */;
.\ios\Runner.xcodeproj\project.pbxproj:347:				534897402FDC19C80033A4D9 /* OpenStrapWidget */,
.\ios\Runner.xcodeproj\project.pbxproj:349:			name = OpenStrapWidgetExtension;
.\ios\Runner.xcodeproj\project.pbxproj:350:			productName = OpenStrapWidgetExtension;
.\ios\Runner.xcodeproj\project.pbxproj:351:			productReference = 5348973B2FDC19C80033A4D9 /* OpenStrapWidgetExtension.appex */;
.\ios\Runner.xcodeproj\project.pbxproj:354:		53962EBD2FF6EF790061A61B /* OpenStrapWatch Watch App */ = {
.\ios\Runner.xcodeproj\project.pbxproj:356:			buildConfigurationList = 53962EC92FF6EF7A0061A61B /* Build configuration list for PBXNativeTarget "OpenStrapWatch Watch App" */;
.\ios\Runner.xcodeproj\project.pbxproj:367:				53962EBF2FF6EF790061A61B /* OpenStrapWatch Watch App */,
.\ios\Runner.xcodeproj\project.pbxproj:369:			name = "OpenStrapWatch Watch App";
.\ios\Runner.xcodeproj\project.pbxproj:370:			productName = "OpenStrapWatch Watch App";
.\ios\Runner.xcodeproj\project.pbxproj:371:			productReference = 53962EBE2FF6EF790061A61B /* OpenStrapWatch Watch App.app */;
.\ios\Runner.xcodeproj\project.pbxproj:446:				5348973A2FDC19C80033A4D9 /* OpenStrapWidgetExtension */,
.\ios\Runner.xcodeproj\project.pbxproj:447:				53962EBD2FF6EF790061A61B /* OpenStrapWatch Watch App */,
.\ios\Runner.xcodeproj\project.pbxproj:663:				53962E972FF6EE120061A61B /* OpenStrapIntents.swift in Sources */,
.\ios\Runner.xcodeproj\project.pbxproj:682:			target = 5348973A2FDC19C80033A4D9 /* OpenStrapWidgetExtension */;
.\ios\Runner.xcodeproj\project.pbxproj:687:			target = 53962EBD2FF6EF790061A61B /* OpenStrapWatch Watch App */;
.\ios\Runner.xcodeproj\project.pbxproj:850:				CODE_SIGN_ENTITLEMENTS = OpenStrapWidgetExtension.entitlements;
.\ios\Runner.xcodeproj\project.pbxproj:857:				INFOPLIST_FILE = OpenStrapWidget/Info.plist;
.\ios\Runner.xcodeproj\project.pbxproj:897:				CODE_SIGN_ENTITLEMENTS = OpenStrapWidgetExtension.entitlements;
.\ios\Runner.xcodeproj\project.pbxproj:904:				INFOPLIST_FILE = OpenStrapWidget/Info.plist;
.\ios\Runner.xcodeproj\project.pbxproj:941:				CODE_SIGN_ENTITLEMENTS = OpenStrapWidgetExtension.entitlements;
.\ios\Runner.xcodeproj\project.pbxproj:948:				INFOPLIST_FILE = OpenStrapWidget/Info.plist;
.\ios\Runner.xcodeproj\project.pbxproj:987:				CODE_SIGN_ENTITLEMENTS = "OpenStrapWatch Watch App/OpenStrapWatch Watch App.entitlements";
.\ios\Runner.xcodeproj\project.pbxproj:1021:				SWIFT_OBJC_BRIDGING_HEADER = "OpenStrapWatch Watch App/OpenStrapWatch Watch App-Bridging-Header.h";
.\ios\Runner.xcodeproj\project.pbxproj:1044:				CODE_SIGN_ENTITLEMENTS = "OpenStrapWatch Watch App/OpenStrapWatch Watch App.entitlements";
.\ios\Runner.xcodeproj\project.pbxproj:1074:				SWIFT_OBJC_BRIDGING_HEADER = "OpenStrapWatch Watch App/OpenStrapWatch Watch App-Bridging-Header.h";
.\ios\Runner.xcodeproj\project.pbxproj:1096:				CODE_SIGN_ENTITLEMENTS = "OpenStrapWatch Watch App/OpenStrapWatch Watch App.entitlements";
.\ios\Runner.xcodeproj\project.pbxproj:1126:				SWIFT_OBJC_BRIDGING_HEADER = "OpenStrapWatch Watch App/OpenStrapWatch Watch App-Bridging-Header.h";
.\ios\Runner.xcodeproj\project.pbxproj:1307:		534897542FDC19C90033A4D9 /* Build configuration list for PBXNativeTarget "OpenStrapWidgetExtension" */ = {
.\ios\Runner.xcodeproj\project.pbxproj:1317:		53962EC92FF6EF7A0061A61B /* Build configuration list for PBXNativeTarget "OpenStrapWatch Watch App" */ = {
.\lib\theme\page_transitions.dart:3:// (see buildOpenStrapTheme).
.\lib\ui\activity\workout_share_card.dart:390:      // "My OpenStrap workout" string is exactly the kind of filler that makes
.\lib\theme\tokens.dart:1:// Design tokens — OpenStrap "Ember on Paper" (day) / "Ember on Char" (night).
.\lib\theme\theme_controller.dart:7:// First launch follows the OS: if the phone is in dark mode, OpenStrap opens in
.\lib\theme\theme_controller.dart:79:  ThemeData get lightTheme => buildOpenStrapTheme(kLightPalette);
.\lib\theme\theme_controller.dart:80:  ThemeData get darkTheme => buildOpenStrapTheme(kDarkPalette);
.\lib\theme\theme_switcher.dart:30:/// instead (see buildOpenStrapTheme + page_transitions.dart): Android-likes
.\lib\ui\import\import_screen.dart:3://   • Edge backup (.db)    → merge another OpenStrap device's exported database
.\lib\ui\import\import_screen.dart:47:  // Edge opens the file as SQLite), so we accept any file and validate on parse.
.\lib\ui\import\import_screen.dart:160:            body: 'A compatible .db exported from Stasis AI or OpenStrap Edge.',
.\lib\state\app_state.dart:292:  // ── data imports (NOOP raw CSV / Edge backup / WHOOP export) ────────────────
.\lib\state\app_state.dart:327:  /// Another device's exported OpenStrap DB (.db) → merge into the local store.
.\lib\state\app_state.dart:750:  /// OpenStrapIntents.swift. Checked on cold launch (constructor, above) AND
.\lib\state\app_state.dart:1638:  /// On Android the Edge Tracking foreground service keeps the process + connection alive.
.\lib\state\app_state.dart:1651:      // Android: ensure the Edge Tracking foreground service is up (idempotent) so the
.\lib\state\app_state.dart:2597:      // Android: start the Edge Tracking foreground service so the live connection keeps
.\lib\theme\theme.dart:1:// OpenStrap theme — TWO type voices, ember-coral on paper (day) or char
.\lib\theme\theme.dart:25:// `buildOpenStrapTheme(palette)` builds a full ThemeData from an explicit
.\lib\theme\theme.dart:171:ThemeData buildOpenStrapTheme(Palette p) {
.\test\disclosure_test.dart:16:    theme: buildOpenStrapTheme(kLightPalette),
.\lib\sync\edge_tracking.dart:1:// Android "Edge Tracking" foreground service.
.\lib\sync\edge_tracking.dart:5:// silent, low-priority notification ("Edge Tracking"), the same trade modern Android
.\test\design_system_test.dart:29:    theme: buildOpenStrapTheme(palette),
.\test\design_system_test.dart:166:          theme: buildOpenStrapTheme(kLightPalette),
.\test\design_system_test.dart:194:          theme: buildOpenStrapTheme(kLightPalette),
.\test\design_system_test.dart:255:          theme: buildOpenStrapTheme(kLightPalette),
.\test\design_system_test.dart:371:                theme: buildOpenStrapTheme(palette),
.\lib\ui\kit\kit.dart:1:// OpenStrap UI kit — the reusable surface/control vocabulary every screen uses.
.\lib\ui\kit\charts.dart:1:// OpenStrap chart kit — rings, gauges, sparkline bars, labeled week bars, the
.\lib\ui\kit\route_map.dart:16:// language and doesn't read as "OpenStrap" — so every tile is passed through
.\lib\sync\sync_policy.dart:7:// WHOOP 4.0 only (the only family OpenStrap supports). A prior speculative
.\lib\ui\kit\os_icons.dart:346:/// Renders an OpenStrap glyph. Defaults to a domain-appropriate tint (see
.\lib\sync\ios_bg_task.dart:144:  /// (RecoveryIntent/StrainIntent/SleepIntent — see OpenStrapIntents.swift,
.\lib\ui\profile\about_screen.dart:24:    'https://github.com/OpenStrap/edge/blob/main/NOTICE.md';
.\lib\ui\recap\recap_screen.dart:391:                // (logo + "OpenStrap" text), so it needs the actual app icon,
.\lib\ui\profile\profile_screen.dart:215:            // device ("Import from Edge"), or sharing for debugging.
.\lib\ui\profile\profile_screen.dart:1135:// Shows whether OpenStrap is exempt from battery optimizations (Doze) and, if
.\lib\ui\profile\profile_screen.dart:1217:// ("reopen OpenStrap") but not WHY it stopped in the first place.
.\test\flow_screens_redesign_test.dart:26:    theme: buildOpenStrapTheme(palette),
.\android\app\src\main\res\layout\widget_openstrap_small.xml:3:  SmallView in OpenStrapWidget.swift, sized for a 2x2 Android cell (~110-140dp).
.\test\history_screens_redesign_test.dart:32:    theme: buildOpenStrapTheme(palette),
.\test\history_screens_redesign_test.dart:350:          theme: buildOpenStrapTheme(kLightPalette),
.\android\app\src\main\AndroidManifest.xml:19:    <!-- Edge Tracking foreground service: keeps the strap connection alive in the background. -->
.\android\app\src\main\AndroidManifest.xml:41:         hides the package list without this; OpenStrap ships as a sideloaded APK (not
.\android\app\src\main\AndroidManifest.xml:154:        <!-- Edge Tracking foreground service (background BLE drain). -->
.\android\app\src\main\AndroidManifest.xml:235:        <!-- Home-screen widgets (Android siblings of ios/OpenStrapWidget). The app
.\android\app\src\main\AndroidManifest.xml:238:            android:name=".OpenStrapWidgetProvider"
.\android\app\src\main\AndroidManifest.xml:249:            android:name=".OpenStrapBatteryWidgetProvider"
.\android\app\src\main\res\layout\widget_band_battery.xml:3:  below — mirrors OpenStrapBatteryWidget.swift's home-screen family. Colours
.\android\app\src\main\res\layout\widget_band_battery.xml:4:  and background are set at render time (OpenStrapBatteryWidgetProvider).
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\EdgeTrackingService.kt:18: * notification titled "Edge Tracking".
.\test\interactive_screens_test.dart:28:    theme: buildOpenStrapTheme(palette),
.\test\interactive_screens_test.dart:36:  return MaterialApp(theme: buildOpenStrapTheme(palette), home: screen);
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\StrapWidgets.kt:13: * Shared bits for the home-screen widgets (see OpenStrapWidgetProvider /
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\StrapWidgets.kt:14: * OpenStrapBatteryWidgetProvider) — the Ember-on-Paper palette, readers for the
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\StrapWidgets.kt:18: * ios/OpenStrapWidget exactly, so the two platforms read as the same product. Rings are
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\StrapWidgets.kt:23:    // ── Ember on Paper / Char (mirrors Pal in OpenStrapWidget.swift) ─────────
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\StrapWidgets.kt:67:    // ── formatting (mirrors hm() in OpenStrapWidget.swift) ───────────────────
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapBatteryWidgetProvider.kt:10: * Band-battery widget — the Android sibling of OpenStrapBatteryWidget.swift.
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapBatteryWidgetProvider.kt:20:class OpenStrapBatteryWidgetProvider : HomeWidgetProvider() {
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapWidgetProvider.kt:14: * Home-screen metrics widget — the Android sibling of OpenStrapWidget.swift
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapWidgetProvider.kt:27:class OpenStrapWidgetProvider : HomeWidgetProvider() {
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapWidgetProvider.kt:72:        // Snapshot (sentinels: -1 = no data — mirrors OpenStrapEntry).
.\android\app\src\main\kotlin\wtf\openstrap\openstrap_edge\OpenStrapWidgetProvider.kt:83:        // Ring fractions + colours — same rules as OpenStrapEntry in Swift.
.\test\live_session_layout_test.dart:45:        theme: buildOpenStrapTheme(kDarkPalette),
.\lib\ui\design\design.dart:1:// OpenStrap design system — ONE import for the screen rollout.
.\test\nav_back_swipe_test.dart:23:      theme: buildOpenStrapTheme(kLightPalette),
.\test\metric_trend_redesign_test.dart:25:    theme: buildOpenStrapTheme(palette),
.\test\os_icons_wiring_test.dart:20:    theme: buildOpenStrapTheme(palette),
.\test\step_personal_floor_test.dart:6:// "moving" means for this wearer. Edge supplies that. Each day persists its own
.\test\telemetry_consent_default_test.dart:3:// OpenStrap's store builds collect nothing, ever. The Firebase SDKs, however,
.\test\week_view_feed_test.dart:21:    theme: buildOpenStrapTheme(palette),
.\test\workout_sleep_redesign_test.dart:31:    theme: buildOpenStrapTheme(palette),
.\test\workout_sleep_redesign_test.dart:346:            theme: buildOpenStrapTheme(p),
.\test\workout_sleep_redesign_test.dart:388:            theme: buildOpenStrapTheme(kLightPalette),
.\test\workout_share_card_test.dart:50:        theme: buildOpenStrapTheme(kDarkPalette),
```

## Every remaining old package/bundle/application identifier occurrence

```text
(none)
```

## Remaining legacy configuration-name occurrences

```text
.env.example:5:STASIS_BACKEND_URL=https://stasis.example.com
guides\IOS_INSTALLATION.md:36:BACKEND_URL=https://your-backend.example
guides\SELF_HOSTED_BACKEND_API.md:3:Base URL is configured with `STASIS_BACKEND_URL` or in-app. SQLite remains authoritative; this API is an optional mirror.
lib\cloud\companion_client.dart:10:// required. The base URL is a build-time `COMPANION_URL` define (the public repo
lib\cloud\companion_client.dart:17:/// Build-time companion URL (`--dart-define=COMPANION_URL=...`). Empty when unset.
lib\cloud\companion_client.dart:19:    String.fromEnvironment('COMPANION_URL', defaultValue: '');
lib\cloud\companion_client.dart:29:  /// Effective base: runtime override → build-time `COMPANION_URL` → '' (off).
lib\cloud\backend_client.dart:12://   2. the BUILD-time `BACKEND_URL` (CI writes it from a repo secret into .env →
lib\cloud\backend_client.dart:21:/// Build-time backend URL (CI `BACKEND_URL` secret via --dart-define-from-file).
lib\cloud\backend_client.dart:24:    String.fromEnvironment('BACKEND_URL', defaultValue: '');
lib\cloud\backend_client.dart:48:  /// The effective backend base: runtime override → build-time `BACKEND_URL` →
lib\self_hosted\self_hosted_sync.dart:18:    'STASIS_BACKEND_URL',
lib\state\app_state.dart:238:  // Resolved by CompanionClient as: this override → build-time COMPANION_URL →
```

## Remaining original-project/cloud URL occurrences in app code

```text
lib\ui\profile\about_screen.dart:24:    'https://github.com/OpenStrap/edge/blob/main/NOTICE.md';
```
