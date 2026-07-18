"""
Research Agent - 心智圖生成模組
使用 Gemini 萃取關鍵概念，並以 networkx + pyvis 生成互動式心智圖
"""

import os
import json
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from dotenv import load_dotenv

load_dotenv()


def extract_mind_map_data(topic: str, report: str) -> dict:
    """
    使用 Gemini 從報告中萃取心智圖結構
    
    Returns:
        {
            "center": "主題",
            "branches": [
                {
                    "label": "分支名稱",
                    "children": ["子節點1", "子節點2", ...]
                }
            ]
        }
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=api_key,
        temperature=0.1,
    )
    
    prompt = f"""從以下研究報告中，萃取關鍵概念，生成心智圖的 JSON 結構。

研究主題：{topic}

報告內容（部分）：
{report[:3000]}

請輸出以下 JSON 格式（只輸出 JSON，不要有其他文字）：
{{
    "center": "{topic}",
    "branches": [
        {{
            "label": "分支主題名稱",
            "children": ["關鍵點1", "關鍵點2", "關鍵點3"]
        }},
        ...
    ]
}}

要求：
- 最多 6 個主要分支
- 每個分支最多 4 個子節點
- 使用繁體中文
- 內容要精簡有力（每個節點不超過 15 字）"""
    
    response = llm.invoke([HumanMessage(content=prompt)])
    
    try:
        # 嘗試解析 JSON
        raw = response.content.strip()
        # 移除可能的 markdown 代碼塊
        if raw.startswith("```"):
            raw = "\n".join(raw.split("\n")[1:-1])
        return json.loads(raw)
    except Exception as e:
        print(f"⚠️ 心智圖資料解析失敗：{e}")
        # 回傳預設結構
        return {
            "center": topic,
            "branches": [
                {"label": "背景現況", "children": ["目前發展", "市場規模"]},
                {"label": "核心技術", "children": ["關鍵要素", "技術突破"]},
                {"label": "未來趨勢", "children": ["短期展望", "長期影響"]},
            ]
        }


def generate_mind_map_html(topic: str, report: str, output_dir: str = "outputs") -> str:
    """
    生成互動式心智圖 HTML（使用 pyvis）
    
    Returns:
        HTML 檔案路徑
    """
    try:
        from pyvis.network import Network
        from datetime import datetime
        import re
        
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        
        print("🧠 正在萃取心智圖結構...")
        data = extract_mind_map_data(topic, report)
        
        # 建立網路圖
        net = Network(
            height="700px",
            width="100%",
            bgcolor="#1a1a2e",
            font_color="#e0e0e0",
            directed=False,
        )
        
        net.set_options("""{
            "nodes": {
                "font": { "size": 16 },
                "borderWidth": 2,
                "shadow": { "enabled": true }
            },
            "edges": {
                "smooth": { "type": "curvedCW", "roundness": 0.2 },
                "shadow": { "enabled": true }
            },
            "physics": {
                "forceAtlas2Based": {
                    "gravitationalConstant": -80,
                    "centralGravity": 0.01,
                    "springLength": 150
                },
                "solver": "forceAtlas2Based",
                "stabilization": { "iterations": 150 }
            }
        }""")
        
        # 中心節點
        center = data.get("center", topic)
        net.add_node(
            "center",
            label=center,
            size=40,
            color={"background": "#e040fb", "border": "#ce93d8"},
            title=f"主題：{center}",
            shape="dot",
        )
        
        # 分支顏色
        branch_colors = [
            "#00bcd4", "#4caf50", "#ff9800", "#f44336",
            "#2196f3", "#9c27b0"
        ]
        
        for i, branch in enumerate(data.get("branches", [])):
            color = branch_colors[i % len(branch_colors)]
            branch_id = f"branch_{i}"
            label = branch.get("label", f"分支 {i+1}")
            
            net.add_node(
                branch_id,
                label=label,
                size=25,
                color={"background": color, "border": "#ffffff"},
                title=label,
                shape="dot",
            )
            net.add_edge("center", branch_id, width=3, color=color)
            
            for j, child in enumerate(branch.get("children", [])):
                child_id = f"child_{i}_{j}"
                net.add_node(
                    child_id,
                    label=child,
                    size=15,
                    color={"background": "#37474f", "border": color},
                    title=child,
                    shape="dot",
                )
                net.add_edge(branch_id, child_id, width=1.5, color=color)
        
        # 儲存
        clean_topic = re.sub(r'[\\/*?:"<>|]', "", topic).replace(" ", "_")[:30]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"mindmap_{clean_topic}_{timestamp}.html"
        filepath = os.path.join(output_dir, filename)
        
        net.save_graph(filepath)
        print(f"🧠 心智圖已儲存：{filepath}")
        return filepath
    
    except ImportError:
        print("⚠️ 請安裝 pyvis：pip install pyvis")
        return ""
    except Exception as e:
        print(f"⚠️ 心智圖生成失敗：{e}")
        return ""
