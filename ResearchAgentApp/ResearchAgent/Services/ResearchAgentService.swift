// ResearchAgentService.swift
// Research Agent iOS App
// Main Agent Orchestration - coordinates Tavily + Gemini

import Foundation
import Observation

@Observable
@MainActor
final class ResearchAgentService {
    // MARK: - State
    var currentStep: ResearchStep = .idle
    var progressLog: [String] = []
    var result: ResearchResult?
    var isRunning: Bool = false
    var errorMessage: String?

    private let gemini = GeminiService()
    private let tavily = TavilyService()
    private var currentTask: Task<Void, Never>?

    // MARK: - Run Research

    func runResearch(topic: String) {
        guard !isRunning else { return }

        currentTask = Task {
            await executeResearch(topic: topic)
        }
    }

    func cancelResearch() {
        currentTask?.cancel()
        currentTask = nil
        isRunning = false
        currentStep = .idle
        addLog("🚫 已取消研究")
    }

    // MARK: - Private Execution

    private func executeResearch(topic: String) async {
        isRunning = true
        errorMessage = nil
        progressLog = []
        result = nil

        do {
            // ── Step 1: Generate Queries ────────────────────────
            currentStep = .generatingQueries
            addLog("🚀 Research Agent 啟動！")
            addLog("💭 分析主題，生成搜尋策略...")

            let queries = try await gemini.generateSearchQueries(for: topic)
            addLog("✅ 搜尋策略：\(queries.count) 個查詢語句")
            for q in queries {
                addLog("   🔍 \(q)")
            }

            // ── Step 2: Search Articles ─────────────────────────
            currentStep = .searching
            addLog("🔍 使用 Tavily 搜尋最新文章...")

            var allArticles: [Article] = []
            var seenURLs = Set<String>()

            for (i, query) in queries.enumerated() {
                if Task.isCancelled { break }
                addLog("[\(i+1)/\(queries.count)] 搜尋：\(query)")

                let results = try await tavily.search(query: query, maxResults: 3)
                for article in results {
                    if !seenURLs.contains(article.url) {
                        allArticles.append(article)
                        seenURLs.insert(article.url)
                    }
                }
                addLog("  ↳ 找到 \(results.count) 篇（累積 \(allArticles.count) 篇）")
            }

            addLog("✅ 共蒐集 \(allArticles.count) 篇不重複文章")

            // ── Step 3: Analyze ─────────────────────────────────
            currentStep = .analyzing
            addLog("🤖 Gemini 1.5 Pro 深度分析中...")
            addLog("   正在閱讀 \(min(allArticles.count, 8)) 篇文章...")

            let topArticles = Array(allArticles.prefix(8))
            let report = try await gemini.synthesizeReport(topic: topic, articles: topArticles)

            addLog("✅ 報告撰寫完成！(\(report.split(separator: " ").count) 字)")

            // ── Step 4: Mind Map ────────────────────────────────
            addLog("🧠 生成心智圖中...")
            var mindMapData: MindMapData?
            do {
                mindMapData = try await gemini.extractMindMapData(topic: topic, report: report)
                addLog("✅ 心智圖生成完成")
            } catch {
                addLog("⚠️ 心智圖生成失敗：\(error.localizedDescription)")
            }

            // ── Done ─────────────────────────────────────────────
            currentStep = .done
            result = ResearchResult(
                topic: topic,
                queries: queries,
                articles: allArticles,
                report: report,
                mindMapData: mindMapData
            )

            addLog("🎉 完成！共分析 \(allArticles.count) 篇文章")

        } catch is CancellationError {
            currentStep = .idle
            addLog("🚫 已取消")
        } catch {
            currentStep = .error
            errorMessage = error.localizedDescription
            addLog("❌ 錯誤：\(error.localizedDescription)")
        }

        isRunning = false
    }

    private func addLog(_ message: String) {
        let timestamp = DateFormatter.timeOnly.string(from: Date())
        progressLog.append("[\(timestamp)] \(message)")
    }
}

extension DateFormatter {
    static let timeOnly: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "HH:mm:ss"
        return df
    }()
}
