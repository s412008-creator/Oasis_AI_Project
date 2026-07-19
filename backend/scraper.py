import httpx
from bs4 import BeautifulSoup
import asyncio

async def fetch_page(url: str, timeout: int = 15) -> str:
    """Fetch raw HTML from a URL."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            return resp.text
    except Exception as e:
        return ""

def clean_html(html: str) -> str:
    """Extract clean text content from HTML, removing ads, navs, footers, etc."""
    if not html:
        return ""
    
    soup = BeautifulSoup(html, "html.parser")
    
    # Remove noise tags
    for element in soup(["script", "style", "nav", "footer", "header", "aside", "form", "iframe", "noscript"]):
        element.decompose()
        
    # Attempt to find the main article container
    main_content = soup.find("main") or soup.find("article") or soup.find("div", role="main")
    
    if main_content:
        text = main_content.get_text(separator="\n", strip=True)
    else:
        text = soup.get_text(separator="\n", strip=True)
        
    # Clean up excessive newlines
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = "\n".join(chunk for chunk in chunks if chunk)
    
    # Truncate if insanely long
    return text[:15000]

async def scrape_and_clean(urls: list[str]) -> dict[str, str]:
    """Fetch and clean multiple URLs concurrently. Returns {url: text_content}"""
    tasks = [fetch_page(url) for url in urls]
    html_results = await asyncio.gather(*tasks, return_exceptions=True)
    
    results = {}
    for url, html in zip(urls, html_results):
        if isinstance(html, Exception) or not html:
            results[url] = ""
        else:
            results[url] = clean_html(html)
            
    return results
