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

translator = Agent(
    role="Legal Translator",
    goal="Translate the provided document into clear Arabic and English, preserving legal terminology.",
    backstory="A certified bilingual legal translator in Dubai courts, ensuring strict accuracy for foreign documents.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

compliance_auditor = Agent(
    role="Compliance Auditor",
    goal="Audit the translated document against UAE Federal Commercial Companies Law.",
    backstory="A strict compliance officer at the UAE Ministry of Economy. Knows exactly what clauses are prohibited or required.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

risk_assessor = Agent(
    role="Risk Assessor",
    goal="Synthesize the audit findings into an official UAE 'Legal Risk & Compliance Report'.",
    backstory="A senior risk mitigation consultant who finalizes government reports in Markdown format.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

class DocumentLogCapture(io.StringIO):
    def __init__(self, loop, queue: asyncio.Queue):
        super().__init__()
        self.loop = loop
        self.queue = queue
        self.current_agent = "SYSTEM"

    def write(self, s):
        if s.strip():
            lower_s = s.lower()
            if "legal translator" in lower_s:
                self.current_agent = "Legal Translator"
            elif "compliance auditor" in lower_s:
                self.current_agent = "Compliance Auditor"
            elif "risk assessor" in lower_s:
                self.current_agent = "Risk Assessor"
            
            asyncio.run_coroutine_threadsafe(
                self.queue.put({"type": "agent_log", "agent": self.current_agent, "msg": s.strip()}), 
                self.loop
            )
        super().write(s)

class DocumentCrewOrchestrator:
    async def run(self, document_content: str) -> AsyncGenerator[dict, None]:
        log_queue = asyncio.Queue()
        loop = asyncio.get_running_loop()

        task1 = Task(
            description=f"Review the uploaded text: '{document_content}'. Provide a summary of the translation into Arabic and English.",
            expected_output="A brief translation summary highlighting key legal clauses.",
            agent=translator
        )

        task2 = Task(
            description="Audit the translated text. Identify any conflicts with UAE Commercial Law (e.g., local sponsor requirements, restricted activities).",
            expected_output="A list of compliance issues or a statement of full compliance.",
            agent=compliance_auditor
        )

        task3 = Task(
            description="Format the audit results into a highly professional 'UAE Document Compliance Report' in Traditional Chinese (Markdown). Include: 1. 翻譯摘要, 2. 阿聯酋法規合規性審查, 3. 法律風險與建議修改事項.",
            expected_output="An official Markdown compliance report in Traditional Chinese.",
            agent=risk_assessor
        )

        crew = Crew(
            agents=[translator, compliance_auditor, risk_assessor],
            tasks=[task1, task2, task3],
            process=Process.sequential,
            verbose=True
        )

        old_stdout = sys.stdout
        sys.stdout = DocumentLogCapture(loop, log_queue)

        def _kickoff():
            try:
                return crew.kickoff()
            finally:
                pass

        await log_queue.put({"type": "agent_switch", "agent": "SYSTEM"})
        await log_queue.put({"type": "agent_log", "agent": "SYSTEM", "msg": "[初始化] 跨國智能合約審查局啟動中..."})
        
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
