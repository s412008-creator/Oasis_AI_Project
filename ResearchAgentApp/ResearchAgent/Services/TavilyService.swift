// TavilyService.swift
// Research Agent iOS App
// Tavily AI Search API Integration

import Foundation

actor TavilyService {
    private let session: URLSession

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        self.session = URLSession(configuration: config)
    }

    // MARK: - Search

    func search(query: String, maxResults: Int = 5) async throws -> [Article] {
        guard let url = URL(string: APIConfig.tavilySearchURL) else {
            throw ResearchError.networkError("無效的 Tavily URL")
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = TavilyRequest(query: query, maxResults: maxResults)
        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            let code = (response as? HTTPURLResponse)?.statusCode ?? -1
            throw ResearchError.apiError("Tavily API 錯誤 (HTTP \(code))")
        }

        let tavilyResponse = try JSONDecoder().decode(TavilyResponse.self, from: data)

        return tavilyResponse.results.map { result in
            Article(
                title: result.title,
                url: result.url,
                content: result.content,
                fullContent: result.rawContent ?? result.content,
                score: result.score
            )
        }
    }

    // MARK: - Scrape URL

    func scrapeURL(_ urlString: String) async throws -> String {
        guard let url = URL(string: urlString) else { return "" }

        var request = URLRequest(url: url)
        request.setValue(
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
            forHTTPHeaderField: "User-Agent"
        )
        request.timeoutInterval = 10

        do {
            let (data, _) = try await session.data(for: request)
            let html = String(data: data, encoding: .utf8) ?? ""
            return extractTextFromHTML(html)
        } catch {
            return ""
        }
    }

    // MARK: - HTML Text Extraction (Basic)

    private func extractTextFromHTML(_ html: String) -> String {
        // Simple HTML tag stripping
        var text = html

        // Remove script and style blocks
        let patterns = ["<script[^>]*>[\\s\\S]*?</script>",
                        "<style[^>]*>[\\s\\S]*?</style>",
                        "<[^>]+>"]

        for pattern in patterns {
            if let regex = try? NSRegularExpression(pattern: pattern, options: .caseInsensitive) {
                text = regex.stringByReplacingMatches(
                    in: text,
                    range: NSRange(text.startIndex..., in: text),
                    withTemplate: " "
                )
            }
        }

        // Decode HTML entities
        text = text
            .replacingOccurrences(of: "&amp;", with: "&")
            .replacingOccurrences(of: "&lt;", with: "<")
            .replacingOccurrences(of: "&gt;", with: ">")
            .replacingOccurrences(of: "&nbsp;", with: " ")
            .replacingOccurrences(of: "&#39;", with: "'")
            .replacingOccurrences(of: "&quot;", with: "\"")

        // Clean whitespace
        let lines = text.components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { $0.count > 20 }  // Only lines with meaningful content

        return String(lines.joined(separator: "\n").prefix(6000))
    }
}
