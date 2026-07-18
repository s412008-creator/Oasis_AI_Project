"""
Research Agent - Streamlit 前端介面
使用者輸入主題 → Agent 自動研究 → 輸出報告 + 心智圖
"""

import streamlit as st
import os
import sys
import time
from pathlib import Path

# 確保可以 import agent 模組
sys.path.insert(0, str(Path(__file__).parent))

from agent.researcher import run_research_agent
from agent.report_generator import save_markdown, save_html
from agent.mind_map import generate_mind_map_html

# ─── 頁面設定 ────────────────────────────────────────────────
st.set_page_config(
    page_title="🤖 Research Agent",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── 自訂 CSS ─────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', 'Microsoft JhengHei', sans-serif;
    }
    
    .main { background: #0f0f1a; }
    
    .stApp {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
        color: #e0e0e0;
    }
    
    /* Hero Banner */
    .hero-banner {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%);
        padding: 40px 30px;
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
        animation: glow 3s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from { box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); }
        to   { box-shadow: 0 20px 60px rgba(246, 79, 89, 0.5); }
    }
    
    .hero-banner h1 {
        font-size: 2.8em;
        font-weight: 700;
        color: white;
        margin: 0;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    .hero-banner p {
        font-size: 1.1em;
        color: rgba(255,255,255,0.85);
        margin-top: 10px;
    }
    
    /* Status Cards */
    .status-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 16px 20px;
        margin: 8px 0;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
    
    .status-card:hover {
        border-color: rgba(102, 126, 234, 0.5);
        background: rgba(102, 126, 234, 0.1);
    }
    
    /* Report Container */
    .report-container {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 30px;
        margin-top: 20px;
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 12px 30px !important;
        font-size: 1em !important;
        font-weight: 600 !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
    }
    
    /* Text Input */
    .stTextInput > div > div > input {
        background: rgba(255,255,255,0.07) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 10px !important;
        color: white !important;
        font-size: 1.1em !important;
        padding: 14px !important;
    }
    
    /* Sidebar */
    [data-testid="stSidebar"] {
        background: rgba(15,15,26,0.95) !important;
        border-right: 1px solid rgba(255,255,255,0.08) !important;
    }
    
    /* Progress */
    .stProgress > div > div {
        background: linear-gradient(90deg, #667eea, #764ba2) !important;
    }
    
    /* Metric */
    [data-testid="metric-container"] {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 15px;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab"] {
        background: transparent !important;
        color: rgba(255,255,255,0.6) !important;
    }
    
    .stTabs [aria-selected="true"] {
        color: white !important;
        border-bottom: 2px solid #667eea !important;
    }
    
    /* Log Box */
    .log-box {
        background: #0d1117;
        border: 1px solid #30363d;
        border-radius: 10px;
        padding: 16px;
        font-family: 'Courier New', monospace;
        font-size: 0.85em;
        color: #7ee787;
        max-height: 300px;
        overflow-y: auto;
    }
    
    /* Download buttons */
    .stDownloadButton > button {
        background: linear-gradient(135deg, #11998e, #38ef7d) !important;
        border-radius: 8px !important;
        color: white !important;
        font-weight: 600 !important;
    }
</style>
""", unsafe_allow_html=True)


# ─── Sidebar：API 設定 ─────────────────────────────────────────
with st.sidebar:
    st.markdown("## ⚙️ 設定")
    st.markdown("---")
    
    google_api_key = st.text_input(
        "🔑 Google Gemini API Key",
        type="password",
        placeholder="AIza...",
        help="前往 https://aistudio.google.com/ 取得",
        value=os.getenv("GOOGLE_API_KEY", ""),
    )
    
    tavily_api_key = st.text_input(
        "🔑 Tavily Search API Key",
        type="password",
        placeholder="tvly-...",
        help="前往 https://tavily.com/ 取得免費 API Key",
        value=os.getenv("TAVILY_API_KEY", ""),
    )
    
    st.markdown("---")
    st.markdown("### 🎛️ 進階設定")
    
    max_sources = st.slider("最多搜尋來源數", min_value=3, max_value=15, value=8)
    generate_mindmap = st.checkbox("生成心智圖", value=True)
    generate_html_report = st.checkbox("輸出 HTML 報告", value=True)
    
    st.markdown("---")
    st.markdown("""
    ### 📖 使用說明
    1. 填入兩個 API Key
    2. 輸入研究主題
    3. 點擊「開始研究」
    4. 等待 Agent 完成（約 1-3 分鐘）
    5. 下載或預覽報告
    """)
    
    st.markdown("---")
    st.markdown("""
    <div style='text-align:center; color:rgba(255,255,255,0.3); font-size:0.8em'>
    Powered by<br>
    🤖 Gemini 1.5 Pro<br>
    🔍 Tavily Search<br>
    ⛓️ LangChain
    </div>
    """, unsafe_allow_html=True)


# ─── 主介面 ───────────────────────────────────────────────────
st.markdown("""
<div class="hero-banner">
    <h1>🤖 Research Agent</h1>
    <p>輸入任何主題，AI 自動搜尋、分析、撰寫深度研究報告</p>
</div>
""", unsafe_allow_html=True)

# 主題輸入
col1, col2 = st.columns([5, 1])
with col1:
    topic = st.text_input(
        "",
        placeholder="例如：2026年電動車電池技術發展、台灣AI新創生態系、量子計算商業化前景...",
        label_visibility="collapsed",
    )

with col2:
    start_btn = st.button("🚀 開始研究", use_container_width=True)

# 範例主題
st.markdown("**💡 範例主題：**")
example_cols = st.columns(4)
examples = [
    "2026年電動車電池技術",
    "生成式AI市場趨勢",
    "台灣半導體供應鏈",
    "碳中和技術發展",
]
for col, example in zip(example_cols, examples):
    with col:
        if st.button(f"📌 {example}", key=f"ex_{example}"):
            st.session_state["auto_topic"] = example
            st.rerun()

# 自動填入範例主題
if "auto_topic" in st.session_state:
    topic = st.session_state.pop("auto_topic")

# ─── 執行研究 ─────────────────────────────────────────────────
if start_btn and topic:
    if not google_api_key or not tavily_api_key:
        st.error("❌ 請在左側填入 Google API Key 和 Tavily API Key")
        st.stop()
    
    # 設定環境變數
    os.environ["GOOGLE_API_KEY"] = google_api_key
    os.environ["TAVILY_API_KEY"] = tavily_api_key
    
    st.markdown("---")
    st.markdown(f"## 🔬 正在研究：**{topic}**")
    
    # 進度顯示
    progress_bar = st.progress(0)
    status_container = st.empty()
    log_messages = []
    
    def progress_callback(msg: str):
        log_messages.append(msg)
        status_container.markdown(
            f'<div class="log-box">' +
            "<br>".join(log_messages[-15:]) +
            "</div>",
            unsafe_allow_html=True
        )
    
    try:
        # 執行 Agent
        progress_bar.progress(10)
        result = run_research_agent(
            topic=topic,
            progress_callback=progress_callback,
        )
        progress_bar.progress(80)
        
        # 儲存報告
        md_path = save_markdown(topic, result["report"])
        progress_bar.progress(90)
        
        html_path = ""
        if generate_html_report:
            html_path = save_html(topic, result["report"])
        
        # 心智圖
        mindmap_path = ""
        if generate_mindmap:
            progress_callback("🧠 生成心智圖中...")
            mindmap_path = generate_mind_map_html(topic, result["report"])
        
        progress_bar.progress(100)
        progress_callback("🎉 全部完成！")
        
        st.success(f"✅ 研究完成！共分析 {len(result['articles'])} 篇文章")
        
        # ─── 統計卡片 ────
        st.markdown("---")
        m_cols = st.columns(4)
        m_cols[0].metric("📄 分析文章數", len(result["articles"]))
        m_cols[1].metric("🔍 搜尋查詢數", len(result["queries"]))
        m_cols[2].metric("📝 報告字數", f"{len(result['report'])} 字")
        m_cols[3].metric("🧠 心智圖", "✅ 完成" if mindmap_path else "❌")
        
        # ─── 報告預覽 ────
        st.markdown("---")
        
        tabs = st.tabs(["📄 報告預覽", "🧠 心智圖", "🔍 搜尋來源", "⬇️ 下載"])
        
        with tabs[0]:
            st.markdown(
                f'<div class="report-container">{result["report"]}</div>',
                unsafe_allow_html=True
            )
        
        with tabs[1]:
            if mindmap_path and os.path.exists(mindmap_path):
                with open(mindmap_path, "r", encoding="utf-8") as f:
                    mindmap_html = f.read()
                st.components.v1.html(mindmap_html, height=720, scrolling=False)
            else:
                st.info("💡 心智圖未生成，請確保 pyvis 已安裝並啟用心智圖選項")
        
        with tabs[2]:
            st.markdown("### 🔍 搜尋查詢語句")
            for q in result["queries"]:
                st.markdown(f"- `{q}`")
            
            st.markdown("### 📚 分析的文章來源")
            for i, article in enumerate(result["articles"], 1):
                with st.expander(f"{i}. {article.get('title', '未知標題')}"):
                    st.markdown(f"**URL:** {article.get('url', '')}")
                    st.markdown(f"**摘要：** {article.get('content', '')[:300]}...")
        
        with tabs[3]:
            st.markdown("### ⬇️ 下載報告")
            
            d_cols = st.columns(3)
            
            with d_cols[0]:
                if md_path and os.path.exists(md_path):
                    with open(md_path, "rb") as f:
                        st.download_button(
                            "📄 下載 Markdown",
                            data=f.read(),
                            file_name=os.path.basename(md_path),
                            mime="text/markdown",
                            use_container_width=True,
                        )
            
            with d_cols[1]:
                if html_path and os.path.exists(html_path):
                    with open(html_path, "rb") as f:
                        st.download_button(
                            "🌐 下載 HTML",
                            data=f.read(),
                            file_name=os.path.basename(html_path),
                            mime="text/html",
                            use_container_width=True,
                        )
            
            with d_cols[2]:
                if mindmap_path and os.path.exists(mindmap_path):
                    with open(mindmap_path, "rb") as f:
                        st.download_button(
                            "🧠 下載心智圖",
                            data=f.read(),
                            file_name=os.path.basename(mindmap_path),
                            mime="text/html",
                            use_container_width=True,
                        )
            
            # 報告文字直接複製
            st.markdown("### 📋 報告原文（可直接複製）")
            st.code(result["report"], language="markdown")
    
    except Exception as e:
        st.error(f"❌ 研究過程發生錯誤：{str(e)}")
        st.exception(e)

elif start_btn and not topic:
    st.warning("⚠️ 請輸入研究主題！")

else:
    # 首頁說明
    st.markdown("---")
    
    st.markdown("## 🌟 功能特色")
    feat_cols = st.columns(3)
    
    features = [
        ("🔍 自主搜尋", "使用 Tavily AI Search 搜尋最新文章，自動生成多角度查詢語句"),
        ("🤖 智能分析", "Gemini 1.5 Pro 深度閱讀並分析所有來源，過濾廣告與無關內容"),
        ("📄 精美報告", "自動排版為結構化 Markdown 報告，支援下載 Markdown / HTML 格式"),
        ("🧠 心智圖", "自動萃取關鍵概念，生成互動式心智圖視覺化"),
        ("📊 多角度分析", "涵蓋背景、技術、市場、挑戰、展望等多個維度"),
        ("⚡ 快速高效", "平均 1-3 分鐘完成完整研究報告"),
    ]
    
    for i, (title, desc) in enumerate(features):
        col = feat_cols[i % 3]
        with col:
            st.markdown(f"""
            <div class="status-card">
                <h4>{title}</h4>
                <p style='color:rgba(255,255,255,0.65); font-size:0.9em; margin:0'>{desc}</p>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("""
    <div style='text-align:center; padding:20px; color:rgba(255,255,255,0.4)'>
        👆 在左側填入 API Keys，然後輸入研究主題開始使用
    </div>
    """, unsafe_allow_html=True)
