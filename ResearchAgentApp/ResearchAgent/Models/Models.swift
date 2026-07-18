// Models.swift
// Research Agent iOS App
// All data models

import Foundation

// MARK: - Article

struct Article: Identifiable, Codable, Hashable {
    var id = UUID()
    var title: String
    var url: String
    var content: String
    var fullContent: String
    var score: Double

    enum CodingKeys: String, CodingKey {
        case title, url, content, score
        case fullContent = "raw_content"
    }

    init(id: UUID = UUID(), title: String, url: String,
         content: String, fullContent: String = "", score: Double = 0) {
        self.id = id
        self.title = title
        self.url = url
        self.content = content
        self.fullContent = fullContent
        self.score = score
    }
}

// MARK: - Research Result

struct ResearchResult: Identifiable {
    let id = UUID()
    var topic: String
    var queries: [String]
    var articles: [Article]
    var report: String
    var mindMapData: MindMapData?
    var createdAt: Date = Date()

    var articleCount: Int { articles.count }
    var wordCount: Int { report.split(separator: " ").count }
}

// MARK: - Mind Map Data

struct MindMapData: Codable {
    var center: String
    var branches: [MindMapBranch]
}

struct MindMapBranch: Codable, Identifiable {
    var id = UUID()
    var label: String
    var children: [String]

    enum CodingKeys: String, CodingKey {
        case label, children
    }
}

// MARK: - Research Progress

enum ResearchStep: String, CaseIterable {
    case idle = "idle"
    case generatingQueries = "generating_queries"
    case searching = "searching"
    case scraping = "scraping"
    case analyzing = "analyzing"
    case done = "done"
    case error = "error"

    var icon: String {
        switch self {
        case .idle: return "magnifyingglass"
        case .generatingQueries: return "brain"
        case .searching: return "globe"
        case .scraping: return "doc.text.magnifyingglass"
        case .analyzing: return "cpu"
        case .done: return "checkmark.circle.fill"
        case .error: return "xmark.circle.fill"
        }
    }

    var title: String {
        switch self {
        case .idle: return "待機中"
        case .generatingQueries: return "分析主題，生成搜尋策略"
        case .searching: return "Tavily 搜尋最新文章"
        case .scraping: return "擷取網頁內容"
        case .analyzing: return "Gemini 深度分析撰寫報告"
        case .done: return "報告生成完成！"
        case .error: return "發生錯誤"
        }
    }
}

// MARK: - Gemini API Models

struct GeminiRequest: Codable {
    let contents: [GeminiContent]
    let generationConfig: GeminiGenerationConfig?

    init(prompt: String, temperature: Double = 0.3, maxTokens: Int = 8192) {
        self.contents = [GeminiContent(parts: [GeminiPart(text: prompt)])]
        self.generationConfig = GeminiGenerationConfig(
            temperature: temperature,
            maxOutputTokens: maxTokens
        )
    }
}

struct GeminiContent: Codable {
    var parts: [GeminiPart]
    var role: String?
}

struct GeminiPart: Codable {
    let text: String
}

struct GeminiGenerationConfig: Codable {
    let temperature: Double
    let maxOutputTokens: Int
}

struct GeminiResponse: Codable {
    let candidates: [GeminiCandidate]?
    let error: GeminiError?
}

struct GeminiCandidate: Codable {
    let content: GeminiContent
}

struct GeminiError: Codable {
    let message: String
    let code: Int
}

// MARK: - Tavily API Models

struct TavilyRequest: Codable {
    let apiKey: String
    let query: String
    let searchDepth: String
    let maxResults: Int
    let includeRawContent: Bool
    let includeAnswer: Bool

    enum CodingKeys: String, CodingKey {
        case apiKey = "api_key"
        case query
        case searchDepth = "search_depth"
        case maxResults = "max_results"
        case includeRawContent = "include_raw_content"
        case includeAnswer = "include_answer"
    }

    init(query: String, maxResults: Int = 5) {
        self.apiKey = APIConfig.tavilyAPIKey
        self.query = query
        self.searchDepth = "advanced"
        self.maxResults = maxResults
        self.includeRawContent = true
        self.includeAnswer = true
    }
}

struct TavilyResponse: Codable {
    let results: [TavilyResult]
    let answer: String?
}

struct TavilyResult: Codable {
    let title: String
    let url: String
    let content: String
    let rawContent: String?
    let score: Double

    enum CodingKeys: String, CodingKey {
        case title, url, content, score
        case rawContent = "raw_content"
    }
}
