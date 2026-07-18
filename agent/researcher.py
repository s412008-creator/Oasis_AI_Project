"""
Research Agent - 主要 Agent 邏輯
使用 LangChain + Gemini 1.5 Pro 進行深度分析與報告撰寫
"""

import os
from typing import Generator
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv

from .tools import search_and_scrape

load_dotenv()

SYSTEM_PROMPT = """你是一位專業的研究分析師與報告撰寫專家。
你的任務是：
1. 根據使用者提供的主題，分析所有蒐集到的資料
2. 過濾掉廣告、無關資訊、重複內容
3. 萃取關鍵洞察、數據、趨勢
4. 撰寫一份結構嚴謹、圖文並茂的深度研究報告
5. 使用繁體中文撰寫，術語可附英文原文

報告格式要求：
- 使用 Markdown 格式
- 包含執行摘要（Executive Summary）
- 包含目錄
- 每個章節使用適當的標題層級
- 重要數據用粗體標示
- 使用條列式整理要點
- 每個論點要有來源引用
- 結尾提供結論與未來展望"""


def get_llm(streaming: bool = False) -> ChatGoogleGenerativeAI:
    """初始化 Gemini 1.5 Pro 模型"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("❌ 請設定 GOOGLE_API_KEY 環境變數")
    
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=api_key,
        temperature=0.3,
        streaming=streaming,
        max_output_tokens=8192,
    )


def generate_search_queries(topic: str) -> list[str]:
    """
    根據研究主題，生成多個搜尋查詢語句
    
    Args:
        topic: 研究主題
    
    Returns:
        3~5 個搜尋查詢語句
    """
    llm = get_llm()
    
    prompt = f"""請根據以下研究主題，生成 4 個不同角度的搜尋查詢語句（英文），用於搜尋最新、最相關的資訊。
    
研究主題：{topic}

要求：
- 每個查詢語句針對不同面向（例如：技術、市場、趨勢、挑戰）
- 使用英文，這樣能搜尋到更多國際資料
- 直接輸出查詢語句，每行一個，不需要編號或解釋"""
    
    response = llm.invoke([HumanMessage(content=prompt)])
    queries = [q.strip() for q in response.content.strip().split("\n") if q.strip()]
    
    # 加入原始主題（中文）一起搜尋
    queries.append(topic)
    
    return queries[:5]  # 最多 5 個查詢


def synthesize_research(topic: str, articles: list[dict]) -> str:
    """
    將所有蒐集到的文章內容，由 Gemini 合成為深度報告
    
    Args:
        topic: 研究主題
        articles: 爬取到的文章列表
    
    Returns:
        完整的 Markdown 報告
    """
    llm = get_llm()
    
    # 整理文章內容
    articles_text = ""
    for i, article in enumerate(articles, 1):
        articles_text += f"""
---
【來源 {i}】{article.get('title', '未知標題')}
URL: {article.get('url', '')}
內容摘要：
{article.get('full_content', article.get('content', ''))[:3000]}
"""
    
    prompt = f"""請根據以下蒐集到的資料，撰寫一份關於「{topic}」的深度研究報告。

## 蒐集到的資料來源：
{articles_text}

## 報告要求：
請撰寫一份完整的 Markdown 格式報告，包含以下章節：

1. **📋 執行摘要** - 100字以內的核心洞察
2. **📑 目錄** - 列出所有章節
3. **🌍 背景與現況** - 主題的背景知識與目前發展現況
4. **🔬 核心技術/要素分析** - 深入分析關鍵技術或要素
5. **📈 市場趨勢與數據** - 重要數字、成長率、市場規模等
6. **⚡ 主要挑戰與機會** - 面臨的問題與潛在機遇
7. **🌟 未來展望** - 預測未來 2-3 年的發展趨勢
8. **📚 參考資料** - 列出所有引用來源

特別要求：
- 使用繁體中文
- 重要數據用 **粗體** 標示
- 每個論點要引用來源（格式：[來源標題](URL)）
- 使用 emoji 讓報告更活潑易讀
- 確保資訊準確、客觀，避免主觀臆測"""
    
    print("🤖 Gemini 正在分析並撰寫報告...")
    response = llm.invoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ])
    
    return response.content


def run_research_agent(topic: str, progress_callback=None) -> dict:
    """
    執行完整的研究 Agent 流程
    
    Args:
        topic: 研究主題
        progress_callback: 進度回調函數 (可選)
    
    Returns:
        {
            "topic": str,
            "queries": list[str],
            "articles": list[dict],
            "report": str,
        }
    """
    
    def update_progress(msg: str):
        print(msg)
        if progress_callback:
            progress_callback(msg)
    
    update_progress("🚀 Research Agent 啟動！")
    
    # Step 1: 生成搜尋查詢
    update_progress("💭 分析主題，生成搜尋策略...")
    queries = generate_search_queries(topic)
    update_progress(f"📝 將使用以下查詢：{queries}")
    
    # Step 2: 搜尋 + 爬取文章
    all_articles = []
    seen_urls = set()
    
    for i, query in enumerate(queries, 1):
        update_progress(f"🔍 [{i}/{len(queries)}] 搜尋：{query}")
        results = search_and_scrape(query, max_results=3)
        
        for r in results:
            if r["url"] not in seen_urls:
                all_articles.append(r)
                seen_urls.add(r["url"])
    
    update_progress(f"✅ 共蒐集 {len(all_articles)} 篇不重複文章")
    
    # Step 3: 合成報告
    update_progress("🤖 AI 正在深度分析與撰寫報告...")
    report = synthesize_research(topic, all_articles[:10])  # 最多使用前 10 篇
    
    update_progress("🎉 報告生成完成！")
    
    return {
        "topic": topic,
        "queries": queries,
        "articles": all_articles,
        "report": report,
    }
