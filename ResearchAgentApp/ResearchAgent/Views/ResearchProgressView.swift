// ResearchProgressView.swift
// Research Agent iOS App
// Real-time progress display while agent is working

import SwiftUI

struct ResearchProgressView: View {
    @Bindable var agent: ResearchAgentService
    let topic: String
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            AppBackground()

            VStack(spacing: 0) {
                // Header
                headerSection
                    .padding(.horizontal, 20)
                    .padding(.top, 16)

                if agent.currentStep == .done, let result = agent.result {
                    // Navigate to result
                    resultReadyView(result: result)
                } else {
                    // Progress view
                    progressContent
                }
            }
        }
        .navigationBarBackButtonHidden(agent.isRunning)
        .navigationTitle("")
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("研究中...")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.purple.opacity(0.8))
                        .textCase(.uppercase)
                        .tracking(1)

                    Text(topic)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)
                }

                Spacer()

                if agent.isRunning {
                    Button("取消") {
                        agent.cancelResearch()
                    }
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(.red.opacity(0.8))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.red.opacity(0.1))
                    )
                }
            }
        }
    }

    // MARK: - Progress Content

    private var progressContent: some View {
        VStack(spacing: 24) {
            // Step indicators
            stepIndicators
                .padding(.horizontal, 20)
                .padding(.top, 24)

            // Live log
            VStack(alignment: .leading, spacing: 8) {
                Text("📋 執行日誌")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white.opacity(0.6))
                    .textCase(.uppercase)
                    .tracking(1)
                    .padding(.horizontal, 20)

                ScrollViewReader { proxy in
                    ScrollView {
                        VStack(alignment: .leading, spacing: 4) {
                            ForEach(Array(agent.progressLog.enumerated()), id: \.offset) { _, log in
                                Text(log)
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundColor(.green.opacity(0.9))
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .id(log)
                            }
                            Color.clear.frame(height: 1).id("bottom")
                        }
                        .padding(14)
                    }
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(Color.black.opacity(0.6))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(Color.green.opacity(0.2), lineWidth: 1)
                            )
                    )
                    .padding(.horizontal, 20)
                    .onChange(of: agent.progressLog.count) {
                        withAnimation {
                            proxy.scrollTo("bottom")
                        }
                    }
                }
            }

            Spacer()
        }
    }

    // MARK: - Step Indicators

    private var stepIndicators: some View {
        let steps: [(ResearchStep, String)] = [
            (.generatingQueries, "策略"),
            (.searching, "搜尋"),
            (.analyzing, "分析"),
            (.done, "完成"),
        ]

        return HStack(spacing: 0) {
            ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                let (stepEnum, label) = step
                let isActive = isStepActive(stepEnum)
                let isDone = isStepDone(stepEnum)

                HStack(spacing: 0) {
                    VStack(spacing: 6) {
                        ZStack {
                            Circle()
                                .fill(isDone ? Color(hex: "#667eea") : (isActive ? Color(hex: "#667eea").opacity(0.3) : Color.white.opacity(0.1)))
                                .frame(width: 36, height: 36)

                            if isDone {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                            } else if isActive {
                                ProgressView()
                                    .scaleEffect(0.6)
                                    .tint(.white)
                            } else {
                                Image(systemName: stepEnum.icon)
                                    .font(.system(size: 14))
                                    .foregroundColor(.white.opacity(0.4))
                            }
                        }

                        Text(label)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(isActive || isDone ? .white : .white.opacity(0.3))
                    }

                    if index < steps.count - 1 {
                        Rectangle()
                            .fill(isDone ? Color(hex: "#667eea") : Color.white.opacity(0.1))
                            .frame(height: 2)
                            .frame(maxWidth: .infinity)
                            .padding(.bottom, 22)
                    }
                }
            }
        }
    }

    // MARK: - Result Ready

    private func resultReadyView(result: ResearchResult) -> some View {
        NavigationLink(destination: ReportView(result: result)) {
            VStack(spacing: 30) {
                Spacer()

                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [.green.opacity(0.4), .clear],
                                center: .center,
                                startRadius: 20,
                                endRadius: 80
                            )
                        )
                        .frame(width: 160, height: 160)
                        .blur(radius: 20)

                    Image(systemName: "checkmark.circle.fill")
                        .resizable()
                        .frame(width: 80, height: 80)
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.green, .mint],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .symbolEffect(.bounce)
                }

                VStack(spacing: 8) {
                    Text("研究完成！")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.white)

                    Text("分析了 \(result.articleCount) 篇文章 · \(result.wordCount) 字報告")
                        .font(.system(size: 15))
                        .foregroundColor(.white.opacity(0.6))
                }

                HStack(spacing: 10) {
                    Image(systemName: "doc.text.fill")
                    Text("查看完整報告")
                        .font(.system(size: 17, weight: .bold))
                    Image(systemName: "chevron.right")
                }
                .padding(.horizontal, 32)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "#667eea"), Color(hex: "#764ba2")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .foregroundColor(.white)
                .cornerRadius(14)
                .shadow(color: Color(hex: "#667eea").opacity(0.5), radius: 15, y: 8)

                Spacer()
            }
            .padding(20)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Helpers

    private func isStepActive(_ step: ResearchStep) -> Bool {
        agent.currentStep == step
    }

    private func isStepDone(_ step: ResearchStep) -> Bool {
        let order: [ResearchStep] = [.generatingQueries, .searching, .scraping, .analyzing, .done]
        guard let currentIndex = order.firstIndex(of: agent.currentStep),
              let stepIndex = order.firstIndex(of: step) else { return false }
        return currentIndex > stepIndex || agent.currentStep == .done
    }
}
