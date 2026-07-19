import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.bounces = false // Disable bounce for a native app feel
        webView.isOpaque = false
        webView.backgroundColor = .black // Match your web app's dark theme
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        webView.load(request)
    }
}

struct HomeView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            WebView(url: URL(string: "https://deep-research-ai.pages.dev/")!)
                .ignoresSafeArea() // Ensure it goes edge to edge
        }
    }
}

#Preview {
    HomeView()
}
