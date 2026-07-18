# 🤖 Research Agent - 深度報告自動生成員

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Gemini](https://img.shields.io/badge/Gemini_1.5_Pro-AI_Powered-blueviolet?style=for-the-badge&logo=google)
![LangChain](https://img.shields.io/badge/LangChain-⛓️_Agent-green?style=for-the-badge)
![Tavily](https://img.shields.io/badge/Tavily-🔍_Search-orange?style=for-the-badge)
![Streamlit](https://img.shields.io/badge/Streamlit-🖥️_UI-red?style=for-the-badge)

**輸入任何主題 → AI 自動搜尋、分析、輸出深度研究報告**

</div>

---

## 🌟 功能特色

| 功能 | 說明 |
|------|------|
| 🔍 **自主搜尋** | Tavily AI Search 搜尋最新文章，自動生成多角度查詢 |
| 🤖 **智能分析** | Gemini 1.5 Pro 深度分析，過濾廣告與無關內容 |
| 📄 **精美報告** | 結構化 Markdown 報告，含執行摘要、目錄、引用來源 |
| 🧠 **心智圖** | 自動萃取關鍵概念，生成互動式心智圖 |
| 📊 **多角度分析** | 涵蓋背景、技術、市場、挑戰、展望等多維度 |
| ⬇️ **多格式輸出** | 支援 Markdown、HTML 下載 |

---

## 🏗️ 系統架構

```
使用者輸入主題
      ↓
生成多角度搜尋查詢（Gemini）
      ↓
Tavily Search API 搜尋最新文章
      ↓
BeautifulSoup 爬取網頁內容（過濾廣告）
      ↓
Gemini 1.5 Pro 分析 + 合成報告
      ↓
輸出：Markdown / HTML / 心智圖
```

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
pip install -r requirements.txt
```

### 2. 設定 API Keys

```bash
cp .env.example .env
# 編輯 .env 填入你的 API Keys
```

**.env 內容：**
```env
GOOGLE_API_KEY=your_google_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

**取得 API Keys：**
- 🔑 Google Gemini API：[aistudio.google.com](https://aistudio.google.com/)
- 🔑 Tavily API（免費方案 1000 次/月）：[tavily.com](https://tavily.com/)

### 3. 啟動 Web 介面

```bash
streamlit run app.py
```

瀏覽器會自動開啟 `http://localhost:8501`

### 4. 或使用 CLI 版本

```bash
python main.py "2026年電動車電池技術發展"
python main.py "台灣AI新創生態系" --output-dir my_reports
python main.py "量子計算商業化" --no-mindmap
```

---

## 📁 專案結構

```
research-agent/
├── app.py                    # Streamlit Web 介面
├── main.py                   # CLI 入口
├── requirements.txt          # Python 依賴
├── .env.example              # 環境變數範本
├── .gitignore
│
├── agent/
│   ├── __init__.py
│   ├── researcher.py         # 主要 Agent 邏輯（LangChain + Gemini）
│   ├── tools.py              # 搜尋工具（Tavily + BeautifulSoup）
│   ├── report_generator.py   # 報告輸出（Markdown / HTML）
│   └── mind_map.py           # 心智圖生成（pyvis）
│
└── outputs/                  # 生成的報告輸出目錄
```

---

## 🧠 Agent 工作流程詳解

### Step 1：查詢策略生成
Gemini 根據主題，自動生成 4 個不同面向的英文搜尋查詢（技術、市場、趨勢、挑戰），搭配原始主題進行全面搜尋。

### Step 2：深度搜尋 + 爬取
使用 Tavily Search API（專門為 AI 設計的搜尋引擎）搜尋，每個查詢取前 3 篇，去重後最多蒐集 15 篇文章。使用 BeautifulSoup 爬取完整內容，自動過濾廣告、導覽列、頁腳。

### Step 3：AI 深度分析與撰寫
Gemini 1.5 Pro 閱讀所有文章（最多 10 篇），按照嚴格格式撰寫包含 7 個章節的深度報告，每個論點附有來源引用。

### Step 4：心智圖視覺化
Gemini 萃取報告中的關鍵概念，透過 pyvis 生成互動式心智圖（可拖拽、縮放）。

---

## 📊 輸出範例

生成的報告包含：

- 📋 **執行摘要** - 100字核心洞察
- 📑 **目錄** 
- 🌍 **背景與現況** - 發展背景
- 🔬 **核心技術分析** - 深入技術剖析
- 📈 **市場趨勢與數據** - 重要數字
- ⚡ **主要挑戰與機會**
- 🌟 **未來展望**
- 📚 **參考資料** - 引用來源

---

## 🛠️ 技術堆疊

| 技術 | 版本 | 用途 |
|------|------|------|
| Python | 3.10+ | 核心語言 |
| Gemini 1.5 Pro | - | 文本分析與報告撰寫 |
| LangChain | 0.2+ | Agent 框架 |
| Tavily Search | 0.3+ | AI 搜尋引擎 |
| BeautifulSoup4 | 4.12+ | 網頁爬蟲 |
| Streamlit | 1.35+ | Web 介面 |
| pyvis | 0.3+ | 心智圖視覺化 |

---

## 📝 License

MIT License

---

<div align="center">
Made with ❤️ | Powered by Gemini 1.5 Pro + Tavily Search + LangChain
</div>
