import os
import json
import asyncio
import io
import sys
from typing import AsyncGenerator
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model=os.getenv("GEMINI_MODEL", "gemini-3.5-flash"),
    temperature=0.4,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

market_researcher = Agent(
    role="Market Researcher",
    goal="Analyze the user's product and identify the top 3 target business sectors in Dubai.",
    backstory="A local market analyst at Dubai Chamber of Commerce with an extensive database of UAE companies.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

matchmaker = Agent(
    role="B2B Matchmaker",
    goal="Select 3 specific potential clients/partners in Dubai that match the user's offering.",
    backstory="An elite networking executive in the UAE, known for pairing foreign tech startups with massive local enterprises like Emaar, Emirates, or DED.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

outreach_specialist = Agent(
    role="Outreach Specialist",
    goal="Draft an official, culturally appropriate Bilingual (Arabic/English) introductory Cold Email for the matched prospects.",
    backstory="A seasoned Middle East PR expert who knows the exact tone to use when approaching Emirati executives.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

class MatchmakingLogCapture(io.StringIO):
    def __init__(self, loop, queue: asyncio.Queue):
        super().__init__()
        self.loop = loop
        self.queue = queue
        self.current_agent = "SYSTEM"

    def write(self, s):
        if s.strip():
            lower_s = s.lower()
            if "market researcher" in lower_s:
                self.current_agent = "Market Researcher"
            elif "b2b matchmaker" in lower_s:
                self.current_agent = "B2B Matchmaker"
            elif "outreach specialist" in lower_s:
                self.current_agent = "Outreach Specialist"
            
            asyncio.run_coroutine_threadsafe(
                self.queue.put({"type": "agent_log", "agent": self.current_agent, "msg": s.strip()}), 
                self.loop
            )
        super().write(s)

class MatchmakingCrewOrchestrator:
    async def run(self, product_description: str) -> AsyncGenerator[dict, None]:
        log_queue = asyncio.Queue()
        loop = asyncio.get_running_loop()

        task1 = Task(
            description=f"Analyze the following product offering: '{product_description}'. Identify the top 3 business sectors in Dubai that need this.",
            expected_output="A short list of 3 target sectors with brief justification.",
            agent=market_researcher
        )

        task2 = Task(
            description="Based on the identified sectors, invent or find 3 specific potential UAE enterprise clients (e.g., specific banks, real estate firms, government bodies) that would perfectly match.",
            expected_output="A profile of 3 specific UAE companies as targets.",
            agent=matchmaker
        )

        task3 = Task(
            description="Synthesize the targets into a 'Dubai B2B Matchmaking Report' in Traditional Chinese (Markdown). Include: 1. 市場痛點分析, 2. 推薦的三家潛在杜拜客戶, 3. 附上一封專業的 阿拉伯文/英文 雙語破冰信 (Cold Email) 範本.",
            expected_output="An official Markdown matchmaking report in Traditional Chinese.",
            agent=outreach_specialist
        )

        crew = Crew(
            agents=[market_researcher, matchmaker, outreach_specialist],
            tasks=[task1, task2, task3],
            process=Process.sequential,
            verbose=True
        )

        old_stdout = sys.stdout
        sys.stdout = MatchmakingLogCapture(loop, log_queue)

        def _kickoff():
            try:
                return crew.kickoff()
            finally:
                pass

        await log_queue.put({"type": "agent_switch", "agent": "SYSTEM"})
        await log_queue.put({"type": "agent_log", "agent": "SYSTEM", "msg": "[初始化] 杜拜官方商業媒合處啟動中..."})
        
        task_obj = asyncio.to_thread(_kickoff)

        while not task_obj.done():
            try:
                msg = log_queue.get_nowait()
                yield msg
            except asyncio.QueueEmpty:
                await asyncio.sleep(0.1)

        sys.stdout = old_stdout

        while not log_queue.empty():
            yield log_queue.get_nowait()

        result = await task_obj

        yield {
            "type": "result",
            "report": result.raw if hasattr(result, 'raw') else str(result),
            "sources": []
        }
