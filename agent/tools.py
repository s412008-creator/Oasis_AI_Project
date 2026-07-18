"""
Research Agent - 搜尋工具模組
使用 Tavily Search API 進行深度網路搜尋，並爬取網頁內容
"""

import os
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()


def get_tavily_client() -> TavilyClient:
    """初始化 Tavily 客戶端"""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("❌ 請設定 TAVILY_API_KEY 環境變數")
    return TavilyClient(api_key=api_key)


def search_web(query: str, max_results: int = 5) -> list[dict]:
    """
    使用 Tavily 搜尋最新相關文章
    
    Args:
        query: 搜尋關鍵字
        max_results: 最多回傳幾篇文章
    
    Returns:
        搜尋結果列表，每項包含 title, url, content, score
    """
    client = get_tavily_client()
    
    print(f"🔍 搜尋中：{query}")
    
    response = client.search(
        query=query,
        search_depth="advanced",
        max_results=max_results,
        include_answer=True,
        include_raw_content=True,
    )
    
    results = []
    for r in response.get("results", []):
        results.append({
            "title": r.get("title", ""),
            "url": r.get("url", ""),
            "content": r.get("content", ""),
            "raw_content": r.get("raw_content", ""),
            "score": r.get("score", 0),
        })
    
    print(f"✅ 找到 {len(results)} 篇相關文章")
    return results


def scrape_webpage(url: str) -> str:
    """
    爬取指定網頁的純文字內容（過濾廣告、導覽列、頁尾等）
    
    Args:
        url: 目標網址
    
    Returns:
        清理後的純文字內容
    """
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # 移除不必要的元素
        for tag in soup(["script", "style", "nav", "footer",
                         "header", "aside", "advertisement", "iframe"]):
            tag.decompose()
        
        # 嘗試取得主要內容區域
        main_content = (
            soup.find("article")
            or soup.find("main")
            or soup.find(id="content")
            or soup.find(class_="content")
            or soup.body
        )
        
        if main_content:
            text = main_content.get_text(separator="\n", strip=True)
        else:
            text = soup.get_text(separator="\n", strip=True)
        
        # 清理多餘空行
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        clean_text = "\n".join(lines)
        
        # 限制長度避免 token 超出
        return clean_text[:8000]
    
    except Exception as e:
        print(f"⚠️ 無法爬取 {url}：{e}")
        return ""


def search_and_scrape(query: str, max_results: int = 5) -> list[dict]:
    """
    搜尋 + 爬取完整內容（all-in-one）
    
    Returns:
        包含完整內容的文章列表
    """
    results = search_web(query, max_results)
    
    for r in results:
        if not r.get("raw_content"):
            print(f"  📄 爬取：{r['url']}")
            r["full_content"] = scrape_webpage(r["url"])
        else:
            r["full_content"] = r["raw_content"][:8000]
    
    return results
