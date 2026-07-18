"""
Research Agent - 報告輸出模組
將 Markdown 報告儲存為 .md 或 .pdf 格式
"""

import os
import re
from datetime import datetime
from pathlib import Path


def sanitize_filename(name: str) -> str:
    """清理主題名稱，使其可作為檔名"""
    clean = re.sub(r'[\\/*?:"<>|]', "", name)
    clean = clean.replace(" ", "_")
    return clean[:50]


def save_markdown(topic: str, report: str, output_dir: str = "outputs") -> str:
    """
    儲存 Markdown 報告
    
    Args:
        topic: 研究主題（用於命名檔案）
        report: Markdown 報告內容
        output_dir: 輸出目錄
    
    Returns:
        儲存的檔案路徑
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{sanitize_filename(topic)}_{timestamp}.md"
    filepath = os.path.join(output_dir, filename)
    
    # 加入報告 header
    header = f"""---
title: "{topic} - 深度研究報告"
date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
generated_by: Research Agent (Gemini 1.5 Pro + Tavily)
---

"""
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(header + report)
    
    print(f"📄 Markdown 報告已儲存：{filepath}")
    return filepath


def save_html(topic: str, report: str, output_dir: str = "outputs") -> str:
    """
    將 Markdown 報告轉換並儲存為 HTML
    
    Returns:
        HTML 檔案路徑
    """
    try:
        import markdown as md_lib
        
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{sanitize_filename(topic)}_{timestamp}.html"
        filepath = os.path.join(output_dir, filename)
        
        html_content = md_lib.markdown(
            report,
            extensions=["tables", "fenced_code", "toc", "attr_list"]
        )
        
        full_html = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{topic} - 深度研究報告</title>
    <style>
        body {{
            font-family: 'Segoe UI', 'Microsoft JhengHei', sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.8;
            color: #2c3e50;
            background: #f8f9fa;
        }}
        h1 {{ color: #1a237e; border-bottom: 3px solid #3f51b5; padding-bottom: 10px; }}
        h2 {{ color: #283593; margin-top: 40px; }}
        h3 {{ color: #3949ab; }}
        blockquote {{
            border-left: 4px solid #3f51b5;
            padding: 10px 20px;
            background: #e8eaf6;
            border-radius: 4px;
        }}
        code {{
            background: #f1f3f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }}
        pre code {{
            display: block;
            padding: 16px;
            overflow-x: auto;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        th {{ background: #3f51b5; color: white; }}
        tr:nth-child(even) {{ background: #f2f2f2; }}
        a {{ color: #3f51b5; }}
        .report-meta {{
            background: #e8eaf6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            font-size: 0.9em;
            color: #5c6bc0;
        }}
    </style>
</head>
<body>
    <div class="report-meta">
        📊 由 Research Agent 自動生成 | Powered by Gemini 1.5 Pro + Tavily Search<br>
        📅 生成時間：{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    </div>
    {html_content}
</body>
</html>"""
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(full_html)
        
        print(f"🌐 HTML 報告已儲存：{filepath}")
        return filepath
    
    except Exception as e:
        print(f"⚠️ HTML 輸出失敗：{e}")
        return ""
