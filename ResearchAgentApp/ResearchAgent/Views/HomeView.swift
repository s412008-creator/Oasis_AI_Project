// HomeView.swift
// Research Agent iOS App
// Main Landing Screen

import SwiftUI

struct HomeView: View {
    @State private var agent = ResearchAgentService()
    @State private var topic: String = ""
    @State private var showResearch = false
    @FocusState private var isInputFocused: Bool

    private let exampleTopics = [
        "2026年電動車電池技術",
        "生成式AI市場趨勢",
        "台灣半導體供應鏈",
        "量子計算商業化前景",
        "碳中和技術發展",
        "生技醫療AI應用",
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                // Background Gradient
                AppBackground()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 30) {
                        // Hero Section
                        heroSection

                        // Input Section
                        inputSection

                        // Example Topics
                        exampleTopicsSection

                        // Features
                        featuresSection

                        Spacer(minLength: 40)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                }
            }
            .navigationDestination(isPresented: $showResearch) {
                ResearchProgressView(agent: agent, topic: topic)
            }
        }
        .preferredColorScheme(.dark)
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [.purple.opacity(0.6), .clear],
                            center: .center,
                            startRadius: 20,
                            endRadius: 80
                        )
                    )
                    .frame(width: 130, height: 130)
                    .blur(radius: 20)

                Image(systemName: "brain.filled.head.profile")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 70, height: 70)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.purple, .blue],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .symbolEffect(.pulse, options: .repeating)
            }

            VStack(spacing: 8) {
                Text("Research Agent")
                    .font(.system(size: 34, weight: .bold, design: .rounded))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.white, .purple.opacity(0.8)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )

                Text("AI 深度研究報告自動生成員")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white.opacity(0.6))
            }
        }
        .padding(.top, 20)
    }

    // MARK: - Input Section

    private var inputSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("🔬 輸入研究主題")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white.opacity(0.7))
                .textCase(.uppercase)
                .tracking(1)

            GlassCard {
                HStack(spacing: 12) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.purple.opacity(0.8))
                        .font(.system(size: 18))

                    TextField("", text: $topic, prompt:
                        Text("例如：2026年電動車電池技術發展")
                            .foregroundColor(.white.opacity(0.3))
                    )
                    .foregroundColor(.white)
                    .font(.system(size: 16))
                    .focused($isInputFocused)
                    .submitLabel(.search)
                    .onSubmit { startResearch() }

                    if !topic.isEmpty {
                        Button {
                            topic = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.white.opacity(0.4))
                        }
                    }
                }
                .padding(16)
            }

            Button(action: startResearch) {
                HStack(spacing: 10) {
                    Image(systemName: "arrow.triangle.2.circlepath")
                        .font(.system(size: 17, weight: .semibold))
                    Text("開始研究")
                        .font(.system(size: 17, weight: .bold))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: topic.trimmingCharacters(in: .whitespaces).isEmpty
                            ? [.gray.opacity(0.3), .gray.opacity(0.2)]
                            : [Color(hex: "#667eea"), Color(hex: "#764ba2")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .foregroundColor(.white)
                .cornerRadius(14)
                .shadow(
                    color: topic.isEmpty ? .clear : Color(hex: "#667eea").opacity(0.5),
                    radius: 12,
                    y: 6
                )
            }
            .disabled(topic.trimmingCharacters(in: .whitespaces).isEmpty)
            .scaleEffect(topic.trimmingCharacters(in: .whitespaces).isEmpty ? 0.98 : 1.0)
            .animation(.spring(response: 0.3), value: topic)
        }
    }

    // MARK: - Example Topics

    private var exampleTopicsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("💡 熱門主題")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white.opacity(0.7))
                .textCase(.uppercase)
                .tracking(1)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
            ], spacing: 10) {
                ForEach(exampleTopics, id: \.self) { example in
                    Button {
                        topic = example
                        isInputFocused = false
                    } label: {
                        Text(example)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .padding(.vertical, 12)
                            .padding(.horizontal, 10)
                            .frame(maxWidth: .infinity)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.white.opacity(0.06))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                                    )
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Features Section

    private var featuresSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("✨ 功能特色")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white.opacity(0.7))
                .textCase(.uppercase)
                .tracking(1)

            let features: [(String, String, Color)] = [
                ("magnifyingglass.circle.fill", "自主搜尋", .blue),
                ("brain", "Gemini 分析", .purple),
                ("doc.richtext.fill", "精美報告", .green),
                ("diagram.badge.plus", "心智圖", .orange),
            ]

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
            ], spacing: 12) {
                ForEach(features, id: \.1) { icon, title, color in
                    FeatureCard(icon: icon, title: title, color: color)
                }
            }
        }
    }

    // MARK: - Actions

    private func startResearch() {
        let trimmed = topic.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        isInputFocused = false
        topic = trimmed
        agent = ResearchAgentService()
        showResearch = true
        agent.runResearch(topic: trimmed)
    }
}

// MARK: - Feature Card

struct FeatureCard: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
                .frame(width: 36)

            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.white.opacity(0.85))

            Spacer()
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(color.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color.opacity(0.2), lineWidth: 1)
                )
        )
    }
}

#Preview {
    HomeView()
}
