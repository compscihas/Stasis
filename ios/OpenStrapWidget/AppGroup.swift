import Foundation

enum AppGroup {
  static let identifier: String = {
    Bundle.main.object(forInfoDictionaryKey: "StasisAppGroupIdentifier") as? String
      ?? "group.com.mycompany.stasisai"
  }()
}
