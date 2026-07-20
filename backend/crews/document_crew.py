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
    temperature=0.2,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

from crewai.tools import tool

@tool("UAE Commercial Law RAG Search")
def uae_law_rag_tool(query: str) -> str:
    """Searches the UAE Federal Commercial Companies Law database for compliance rules. Use this to fact-check any contract clauses."""
    import os
    try:
        with open("uae_commercial_law.txt", "r") as f:
            content = f.read()
        return f"Database Content:\n{content}\n\nSearch result for '{query}': Please analyze the content above to verify compliance."
    except Exception as e:
        return f"Error reading legal database: {str(e)}"

# 定義 3 個核心 Agents
legal_translator = Agent(
    role="Certified Legal Translator",
    goal="Translate the provided business contract into accurate, formal Arabic and highlight key legal terms.",
    backstory="A sworn legal translator certified by the UAE Ministry of Justice, specializing in complex commercial contracts.",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

compliance_auditor = Agent(
    role="UAE Compliance Auditor",
    goal="Cross-reference the contract clauses against UAE Federal Commercial Companies Law to identify missing clauses or illegal terms. MUST USE THE RAG TOOL.",
    backstory="A former judge at the Dubai Courts, known for a meticulous eye for regulatory loopholes and non-compete clause violations.",
    verbose=True,
    allow_delegation=False,
    tools=[uae_law_rag_tool],
    llm=llm
)

risk_assessor = Agent(
    role="Risk & Contract Strategist",
    goal="Synthesize the translation and compliance audit into a 'Contract Risk Assessment Report' with actionable recommendations.",
    backstory="A top-tier corporate lawyer helping foreign investors negotiate safely with UAE local partners without getting trapped in unfair terms.",
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
            agent=legal_translator
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
            agents=[legal_translator, compliance_auditor, risk_assessor],
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
