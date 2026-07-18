// APIConfig.swift
// Research Agent iOS App
// API Keys and Configuration

import Foundation

enum APIConfig {
    // MARK: - API Keys
    static let geminiAPIKey = "AIzaSyAQ.Ab8RN6I_kaGtMGH1Vn-mzcrqG9zg6kc8Z9hmZsdueUfrHKKTMw"
    static let tavilyAPIKey = "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"

    // MARK: - API Endpoints
    static let geminiBaseURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
    static let tavilySearchURL = "https://api.tavily.com/search"

    // MARK: - Computed
    static var geminiEndpoint: URL {
        URL(string: "\(geminiBaseURL)?key=\(geminiAPIKey)")!
    }
}
