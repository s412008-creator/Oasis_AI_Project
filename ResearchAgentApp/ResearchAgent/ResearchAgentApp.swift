// ResearchAgentApp.swift
// Research Agent iOS App - Entry Point

import SwiftUI

@main
struct ResearchAgentApp: App {
    var body: some Scene {
        WindowGroup {
            HomeView()
                .preferredColorScheme(.dark)
        }
    }
}
