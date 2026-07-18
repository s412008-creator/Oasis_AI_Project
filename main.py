"""
Research Agent - CLI 版本（不需要 Streamlit）
直接從命令列執行研究任務
"""

import sys
import argparse
from agent.researcher import run_research_agent
from agent.report_generator import save_markdown, save_html
from agent.mind_map import generate_mind_map_html


def main():
    parser = argparse.ArgumentParser(
        description="🤖 Research Agent - 深度報告自動生成員",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用範例：
  python main.py "2026年電動車電池技術發展"
  python main.py "台灣半導體供應鏈" --no-mindmap
  python main.py "AI市場趨勢" --output-dir my_reports
        """
    )
    
    parser.add_argument("topic", help="研究主題")
    parser.add_argument("--output-dir", default="outputs", help="輸出目錄（預設：outputs）")
    parser.add_argument("--no-mindmap", action="store_true", help="不生成心智圖")
    parser.add_argument("--no-html", action="store_true", help="不輸出 HTML 格式")
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("🤖 Research Agent - 深度報告自動生成員")
    print("=" * 60)
    print(f"📌 研究主題：{args.topic}")
    print(f"📂 輸出目錄：{args.output_dir}")
    print("=" * 60)
    
    # 執行 Agent
    result = run_research_agent(args.topic)
    
    # 儲存報告
    md_path = save_markdown(args.topic, result["report"], args.output_dir)
    
    if not args.no_html:
        html_path = save_html(args.topic, result["report"], args.output_dir)
        print(f"🌐 HTML 報告：{html_path}")
    
    if not args.no_mindmap:
        mindmap_path = generate_mind_map_html(
            args.topic, result["report"], args.output_dir
        )
        if mindmap_path:
            print(f"🧠 心智圖：{mindmap_path}")
    
    print("\n" + "=" * 60)
    print("🎉 研究完成！")
    print(f"📄 Markdown 報告：{md_path}")
    print("=" * 60)
    
    # 印出報告摘要
    lines = result["report"].split("\n")
    print("\n📋 報告摘要（前 20 行）：")
    print("\n".join(lines[:20]))


if __name__ == "__main__":
    main()
