// MindMapView.swift
// Research Agent iOS App
// Interactive Mind Map using SwiftUI Canvas

import SwiftUI

struct MindMapView: View {
    let data: MindMapData
    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero
    @GestureState private var magnifyBy: CGFloat = 1.0
    @GestureState private var dragOffset: CGSize = .zero

    private let centerRadius: CGFloat = 50
    private let branchRadius: CGFloat = 35
    private let leafRadius: CGFloat = 25

    private let branchColors: [Color] = [
        Color(hex: "#667eea"),
        Color(hex: "#f093fb"),
        Color(hex: "#4facfe"),
        Color(hex: "#43e97b"),
        Color(hex: "#fa709a"),
    ]

    var body: some View {
        GeometryReader { geo in
            ZStack {
                // Background
                Color.black.opacity(0.3)
                    .ignoresSafeArea()

                // Mind Map Canvas
                Canvas { ctx, size in
                    let center = CGPoint(x: size.width / 2, y: size.height / 2)
                    drawMindMap(ctx: ctx, center: center, size: size)
                }
                .scaleEffect(scale * magnifyBy)
                .offset(x: offset.width + dragOffset.width,
                        y: offset.height + dragOffset.height)
                .gesture(
                    SimultaneousGesture(
                        MagnificationGesture()
                            .updating($magnifyBy) { value, state, _ in state = value }
                            .onEnded { value in scale = min(max(scale * value, 0.3), 3.0) },
                        DragGesture()
                            .updating($dragOffset) { value, state, _ in state = value.translation }
                            .onEnded { value in
                                offset.width += value.translation.width
                                offset.height += value.translation.height
                            }
                    )
                )

                // Labels overlay
                MindMapLabels(data: data, colors: branchColors)
                    .scaleEffect(scale * magnifyBy)
                    .offset(x: offset.width + dragOffset.width,
                            y: offset.height + dragOffset.height)

                // Instructions
                VStack {
                    Spacer()
                    HStack {
                        Image(systemName: "arrow.up.and.down.and.arrow.left.and.right")
                        Text("拖動 / 縮放")
                        Spacer()
                        Button {
                            withAnimation(.spring()) {
                                scale = 1.0
                                offset = .zero
                            }
                        } label: {
                            Label("重置", systemImage: "arrow.counterclockwise")
                                .font(.system(size: 12))
                        }
                    }
                    .font(.system(size: 12))
                    .foregroundColor(.white.opacity(0.4))
                    .padding(.horizontal, 20)
                    .padding(.bottom, 16)
                }
            }
        }
    }

    private func drawMindMap(ctx: GraphicsContext, center: CGPoint, size: CGSize) {
        let branches = data.branches
        let count = branches.count
        guard count > 0 else { return }

        // Draw center node background
        let centerRect = CGRect(x: center.x - centerRadius, y: center.y - centerRadius,
                                width: centerRadius * 2, height: centerRadius * 2)
        ctx.fill(Path(ellipseIn: centerRect),
                 with: .linearGradient(
                    Gradient(colors: [Color(hex: "#667eea"), Color(hex: "#764ba2")]),
                    startPoint: .init(x: centerRect.minX, y: centerRect.minY),
                    endPoint: .init(x: centerRect.maxX, y: centerRect.maxY)
                 ))

        // Draw branches
        for (i, branch) in branches.enumerated() {
            let color = branchColors[i % branchColors.count]
            let angle = (2 * Double.pi / Double(count)) * Double(i) - Double.pi / 2
            let branchDistance: CGFloat = 160

            let branchCenter = CGPoint(
                x: center.x + branchDistance * cos(angle),
                y: center.y + branchDistance * sin(angle)
            )

            // Line: center → branch
            var linePath = Path()
            linePath.move(to: center)
            linePath.addLine(to: branchCenter)
            ctx.stroke(linePath, with: .color(color.opacity(0.7)), lineWidth: 2.5)

            // Branch node
            let branchRect = CGRect(
                x: branchCenter.x - branchRadius,
                y: branchCenter.y - branchRadius,
                width: branchRadius * 2,
                height: branchRadius * 2
            )
            ctx.fill(Path(ellipseIn: branchRect), with: .color(color.opacity(0.85)))

            // Draw children
            let children = branch.children
            for (j, _) in children.enumerated() {
                let childAngle = angle + (Double(j) - Double(children.count - 1) / 2) * 0.5
                let childDistance: CGFloat = 120

                let childCenter = CGPoint(
                    x: branchCenter.x + childDistance * cos(childAngle),
                    y: branchCenter.y + childDistance * sin(childAngle)
                )

                // Line: branch → child
                var childLine = Path()
                childLine.move(to: branchCenter)
                childLine.addLine(to: childCenter)
                ctx.stroke(childLine, with: .color(color.opacity(0.4)), lineWidth: 1.5)

                // Child node
                let childRect = CGRect(
                    x: childCenter.x - leafRadius,
                    y: childCenter.y - leafRadius,
                    width: leafRadius * 2,
                    height: leafRadius * 2
                )
                ctx.fill(Path(ellipseIn: childRect),
                         with: .color(Color(hex: "#1a1a2e").opacity(0.9)))
                ctx.stroke(Path(ellipseIn: childRect),
                           with: .color(color.opacity(0.6)), lineWidth: 1.5)
            }
        }
    }
}

// MARK: - Labels Overlay (separate layer for text)

struct MindMapLabels: View {
    let data: MindMapData
    let colors: [Color]

    var body: some View {
        GeometryReader { geo in
            let size = geo.size
            let center = CGPoint(x: size.width / 2, y: size.height / 2)
            let count = data.branches.count

            ZStack {
                // Center label
                Text(data.center)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .frame(width: 90)
                    .position(center)

                // Branch and child labels
                ForEach(Array(data.branches.enumerated()), id: \.offset) { i, branch in
                    let color = colors[i % colors.count]
                    let angle = (2 * Double.pi / Double(count)) * Double(i) - Double.pi / 2
                    let branchCenter = CGPoint(
                        x: center.x + 160 * cos(angle),
                        y: center.y + 160 * sin(angle)
                    )

                    // Branch label
                    Text(branch.label)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .frame(width: 64)
                        .position(branchCenter)

                    // Child labels
                    ForEach(Array(branch.children.enumerated()), id: \.offset) { j, child in
                        let childAngle = angle + (Double(j) - Double(branch.children.count - 1) / 2) * 0.5
                        let childCenter = CGPoint(
                            x: branchCenter.x + 120 * cos(childAngle),
                            y: branchCenter.y + 120 * sin(childAngle)
                        )

                        Text(child)
                            .font(.system(size: 9))
                            .foregroundColor(color.opacity(0.9))
                            .multilineTextAlignment(.center)
                            .frame(width: 55)
                            .position(childCenter)
                    }
                }
            }
        }
    }
}
