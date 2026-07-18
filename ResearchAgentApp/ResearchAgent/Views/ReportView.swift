// ReportView.swift
// Research Agent iOS App
// Displays the generated research report with share functionality

import SwiftUI
import WebKit

struct ReportView: View {
    let result: ResearchResult
    @State private var selectedTab: Int = 0
    @State private var showShare = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            AppBackground()

            VStack(spacing: 0) {
                // Tab Bar
                tabBar
                    .padding(.horizontal, 20)
                    .padding(.top, 12)
                    .padding(.bottom, 8)

                // Content
                TabView(selection: $selectedTab) {
                    reportTab.tag(0)
                    sourcesTab.tag(1)
                    mindMapTab.tag(2)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
            }
        }
        .navigationTitle(result.topic)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    showShare = true
                } label: {
                    Image(systemName: "square.and.arrow.up")
                        .foregroundColor(.purple)
                }
            }
        }
        .sheet(isPresented: $showShare) {
            ShareSheet(items: [result.report])
        }
    }

    // MARK: - Tab Bar

    private var tabBar: some View {
        HStack(spacing: 0) {
            ForEach([(0, "doc.text", "報告"), (1, "link", "來源"), (2, "diagram", "心智圖")], id: \.0) { tab, icon, label in
                Button {
                    withAnimation(.spring(response: 0.3)) {
                        selectedTab = tab
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: icon)
                            .font(.system(size: 13))
                        Text(label)
                            .font(.system(size: 13, weight: .medium))
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(selectedTab == tab
                                  ? LinearGradient(colors: [Color(hex: "#667eea"), Color(hex: "#764ba2")], startPoint: .leading, endPoint: .trailing)
                                  : LinearGradient(colors: [.clear, .clear], startPoint: .leading, endPoint: .trailing))
                    )
                    .foregroundColor(selectedTab == tab ? .white : .white.opacity(0.5))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(4)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.08))
        )
    }

    // MARK: - Report Tab

    private var reportTab: some View {
        ScrollView {
            // Stats row
            HStack(spacing: 12) {
                StatChip(icon: "doc.text", value: "\(result.articles.count)", label: "文章")
                StatChip(icon: "textformat", value: "\(result.report.split(separator: " ").count)", label: "字")
                StatChip(icon: "magnifyingglass", value: "\(result.queries.count)", label: "查詢")
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)

            // Markdown Report rendered in WKWebView
            MarkdownWebView(content: result.report)
                .frame(height: 3000)
                .padding(.horizontal, 4)
                .padding(.top, 8)

            Spacer(minLength: 40)
        }
    }

    // MARK: - Sources Tab

    private var sourcesTab: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text("搜尋查詢語句")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white.opacity(0.6))
                    .textCase(.uppercase)
                    .tracking(1)

                ForEach(result.queries, id: \.self) { query in
                    HStack(spacing: 10) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 12))
                            .foregroundColor(.purple)
                        Text(query)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.8))
                        Spacer()
                    }
                    .padding(12)
                    .background(
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color.white.opacity(0.05))
                    )
                }

                Text("分析的文章來源 (\(result.articles.count) 篇)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white.opacity(0.6))
                    .textCase(.uppercase)
                    .tracking(1)
                    .padding(.top, 8)

                ForEach(result.articles) { article in
                    ArticleCard(article: article)
                }
            }
            .padding(20)
        }
    }

    // MARK: - Mind Map Tab

    private var mindMapTab: some View {
        Group {
            if let mindMap = result.mindMapData {
                MindMapView(data: mindMap)
            } else {
                VStack(spacing: 16) {
                    Spacer()
                    Image(systemName: "diagram")
                        .font(.system(size: 50))
                        .foregroundColor(.white.opacity(0.2))
                    Text("心智圖未生成")
                        .foregroundColor(.white.opacity(0.4))
                    Spacer()
                }
            }
        }
    }
}

// MARK: - Stat Chip

struct StatChip: View {
    let icon: String
    let value: String
    let label: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12))
                .foregroundColor(.purple)
            VStack(alignment: .leading, spacing: 0) {
                Text(value)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                Text(label)
                    .font(.system(size: 10))
                    .foregroundColor(.white.opacity(0.5))
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            RoundedRectangle(cornerRadius: 10)
                .fill(Color.white.opacity(0.07))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.purple.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

// MARK: - Article Card

struct ArticleCard: View {
    let article: Article
    @State private var expanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: "doc.text")
                    .font(.system(size: 14))
                    .foregroundColor(.blue)
                    .padding(.top, 2)

                VStack(alignment: .leading, spacing: 4) {
                    Text(article.title)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Text(article.url)
                        .font(.system(size: 11))
                        .foregroundColor(.blue.opacity(0.7))
                        .lineLimit(1)
                }

                Spacer()

                Button {
                    withAnimation { expanded.toggle() }
                } label: {
                    Image(systemName: expanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.4))
                }
            }

            if expanded {
                Text(article.content)
                    .font(.system(size: 12))
                    .foregroundColor(.white.opacity(0.6))
                    .lineLimit(5)
                    .padding(.leading, 24)
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.05))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.white.opacity(0.08), lineWidth: 1)
                )
        )
    }
}

// MARK: - Markdown WebView

struct MarkdownWebView: UIViewRepresentable {
    let content: String

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.isScrollEnabled = false
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let html = buildHTML(from: content)
        webView.loadHTMLString(html, baseURL: nil)
    }

    private func buildHTML(from markdown: String) -> String {
        // Simple markdown to HTML conversion
        var html = markdown

        // Headers
        html = html.replacingOccurrences(of: "(?m)^### (.+)$",
            with: "<h3>$1</h3>", options: .regularExpression)
        html = html.replacingOccurrences(of: "(?m)^## (.+)$",
            with: "<h2>$1</h2>", options: .regularExpression)
        html = html.replacingOccurrences(of: "(?m)^# (.+)$",
            with: "<h1>$1</h1>", options: .regularExpression)

        // Bold
        html = html.replacingOccurrences(of: "\\*\\*(.+?)\\*\\*",
            with: "<strong>$1</strong>", options: .regularExpression)

        // Italic
        html = html.replacingOccurrences(of: "\\*(.+?)\\*",
            with: "<em>$1</em>", options: .regularExpression)

        // Code
        html = html.replacingOccurrences(of: "`(.+?)`",
            with: "<code>$1</code>", options: .regularExpression)

        // Links
        html = html.replacingOccurrences(of: "\\[(.+?)\\]\\((.+?)\\)",
            with: "<a href=\"$2\">$1</a>", options: .regularExpression)

        // Lists
        html = html.replacingOccurrences(of: "(?m)^- (.+)$",
            with: "<li>$1</li>", options: .regularExpression)

        // Paragraphs
        html = html.replacingOccurrences(of: "(?m)^(?!<[hli]).+$",
            with: "<p>$0</p>", options: .regularExpression)

        return """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, 'Helvetica Neue', sans-serif;
    background: transparent;
    color: #e0e0e0;
    font-size: 15px;
    line-height: 1.8;
    padding: 16px;
  }
  h1 { font-size: 22px; color: #c8b8ff; margin: 24px 0 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
  h2 { font-size: 18px; color: #a78bff; margin: 20px 0 10px; }
  h3 { font-size: 16px; color: #9b7fff; margin: 16px 0 8px; }
  p { margin: 8px 0; color: rgba(255,255,255,0.8); }
  strong { color: #f0e6ff; font-weight: 700; }
  em { color: #c8b8ff; font-style: italic; }
  code { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #89d4ff; }
  a { color: #667eea; text-decoration: none; }
  li { margin: 4px 0 4px 20px; color: rgba(255,255,255,0.8); }
  hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0; }
  blockquote { border-left: 3px solid #667eea; padding-left: 12px; color: rgba(255,255,255,0.6); margin: 12px 0; }
</style>
</head>
<body>
\(html)
</body>
</html>
"""
    }
}

// MARK: - Share Sheet

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
