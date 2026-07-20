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
    model=os.getenv("GEMINI_MODEL", "gemini-1.5-pro"),
    temperature=0.2,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

kyc_expert = Agent(
    role="KYC & AML Specialist",
    goal="Evaluate the user's business plan and flag any potential compliance or money laundering risks.",
    backstory="A former Central Bank of the UAE compliance officer. Knows exactly what triggers a bank account rejection.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

banking_matchmaker = Agent(
    role="Corporate Banking Matchmaker",
    goal="Recommend the easiest and most suitable UAE bank (e.g., Wio Bank, Mashreq Neo, Emirates NBD) based on the KYC assessment and generate an action plan.",
    backstory="A well-connected financial broker in Dubai. Specializes in getting startup bank accounts opened in record time.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

class BankingLogCapture(io.StringIO):
    def __init__(self, loop, queue: asyncio.Queue):
        super().__init__()
        self.loop = loop
        self.queue = queue
        self.current_agent = "SYSTEM"

    def write(self, s):
        if s.strip():
            lower_s = s.lower()
            if "kyc & aml specialist" in lower_s:
                self.current_agent = "KYC Specialist"
            elif "corporate banking matchmaker" in lower_s:
                self.current_agent = "Banking Matchmaker"
            
            asyncio.run_coroutine_threadsafe(
                self.queue.put({"type": "agent_log", "agent": self.current_agent, "msg": s.strip()}), 
                self.loop
            )
        super().write(s)

class BankingCrewOrchestrator:
    async def run(self, company_profile: str) -> AsyncGenerator[dict, None]:
        log_queue = asyncio.Queue()
        loop = asyncio.get_running_loop()

        task1 = Task(
            description=f"Review this startup profile: '{company_profile}'. Perform a strict KYC/AML check. Identify red flags that might cause a UAE bank to reject them.",
            expected_output="A structured KYC risk assessment report.",
            agent=kyc_expert
        )

        task2 = Task(
            description="Based on the KYC assessment, recommend the best 2 UAE banks (Digital or Traditional). Write a 'Corporate Banking Setup Guide' in Traditional Chinese (Markdown). Include: 1. KYC 風險評估摘要, 2. 推薦銀行與開戶門檻, 3. 應備文件清單.",
            expected_output="An official Markdown banking roadmap in Traditional Chinese.",
            agent=banking_matchmaker
        )

        crew = Crew(
            agents=[kyc_expert, banking_matchmaker],
            tasks=[task1, task2],
            process=Process.sequential,
            verbose=True
        )

        old_stdout = sys.stdout
        sys.stdout = BankingLogCapture(loop, log_queue)

        def _kickoff():
            try:
                return crew.kickoff()
            finally:
                pass

        await log_queue.put({"type": "agent_switch", "agent": "SYSTEM"})
        await log_queue.put({"type": "agent_log", "agent": "SYSTEM", "msg": "[初始化] 企業銀行開戶導航局啟動中..."})
        
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
