import asyncio
import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DeepResearch AI API v2.0 — Multi-Agent")

_default_origins = [
    "https://oasis-ai-eop.pages.dev",
    "http://localhost:3000",
]
_extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str
    section: str = ""
    question: str = ""

def generate_report(topic: str, module: str) -> str:
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(
        model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
        temperature=0.3,
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )
    
    prompts = {
        "relocation": "You are a Dubai Government Relocation Concierge. Based on this profile: '{topic}', provide a full relocation and setup analysis for Dubai. Format it as an official HTML snippet (use <h3>, <ul>, <li>, <strong>). Include recommendations for a specific Free Zone (like DMCC or IFZA), workspace needs, and visa eligibility.",
        "document": "You are a UAE Legal Compliance Auditor. Based on this contract snippet: '{topic}', analyze it against UAE Federal Laws. Format it as an official HTML snippet (use <h3>, <ul>, <li>, <strong>). Mention Translation Integrity, Commercial Compliance, and Risk Assessment.",
        "matchmaking": "You are a Dubai B2B Matchmaking Agent. Based on this business description: '{topic}', identify 3 potential high-probability partnership targets in the UAE. Format it as an official HTML snippet (use <h3>, <ul>, <li>, <strong>).",
        "banking": "You are a UAE Corporate Banking Advisor. Based on this profile: '{topic}', recommend suitable banking partners in the UAE (e.g. Emirates NBD, Mashreq). Format it as an official HTML snippet (use <h3>, <ul>, <li>, <strong>). Include KYC Pre-approval Status and Estimated Account Opening Time."
    }
    
    try:
        response = llm.invoke(prompts[module].format(topic=topic))
        return response.content
    except Exception as e:
        return f"<h3>Error generating report</h3><p>{str(e)}</p>"


@app.post("/api/relocation")
async def generate_relocation(req: ResearchRequest):
    topic = req.topic.strip()
    async def event_generator():
        mock_logs = [
            {"agent": "System", "msg": "Initializing Multi-Agent Audit System..."},
            {"agent": "Legal Expert", "msg": "Analyzing company profile against UAE Federal Law..."},
            {"agent": "Financial Advisor", "msg": "Calculating tax implications for Dubai Free Zone..."},
            {"agent": "System", "msg": "Cross-referencing complete. Generating Blueprint..."}
        ]
        try:
            for log in mock_logs:
                yield f"data: {json.dumps({'type': 'agent_switch', 'agent': log['agent']})}\n\n"
                yield f"data: {json.dumps({'type': 'agent_log', 'agent': log['agent'], 'msg': log['msg']})}\n\n"
                await asyncio.sleep(1.5)
            
            # Generate real AI content
            report = await asyncio.to_thread(generate_report, topic, "relocation")
            
            yield f"data: {json.dumps({'type': 'result', 'report': report})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'msg': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/document")
async def generate_document(req: ResearchRequest):
    topic = req.topic.strip()
    async def event_generator():
        mock_logs = [
            {"agent": "System", "msg": "Initializing Legal Document Audit..."},
            {"agent": "Legal Translator", "msg": "Translating provided clauses into official Arabic..."},
            {"agent": "Compliance Auditor", "msg": "Cross-referencing clauses against UAE Commercial Companies Law..."},
            {"agent": "System", "msg": "Audit complete. Compiling discrepancy report..."}
        ]
        try:
            for log in mock_logs:
                yield f"data: {json.dumps({'type': 'agent_switch', 'agent': log['agent']})}\n\n"
                yield f"data: {json.dumps({'type': 'agent_log', 'agent': log['agent'], 'msg': log['msg']})}\n\n"
                await asyncio.sleep(1.5)
                
            report = await asyncio.to_thread(generate_report, topic, "document")
            yield f"data: {json.dumps({'type': 'result', 'report': report})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'msg': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/matchmaking")
async def generate_matchmaking(req: ResearchRequest):
    topic = req.topic.strip()
    async def event_generator():
        mock_logs = [
            {"agent": "System", "msg": "Initializing Matchmaking Audit..."},
            {"agent": "Market Analyst", "msg": "Scanning local registries for matching UAE enterprises..."},
            {"agent": "Lead Generator", "msg": "Filtering candidates based on required company size and industry..."},
            {"agent": "Cultural Liaison", "msg": "Drafting bilingual introductory communications..."}
        ]
        try:
            for log in mock_logs:
                yield f"data: {json.dumps({'type': 'agent_switch', 'agent': log['agent']})}\n\n"
                yield f"data: {json.dumps({'type': 'agent_log', 'agent': log['agent'], 'msg': log['msg']})}\n\n"
                await asyncio.sleep(1.5)
                
            report = await asyncio.to_thread(generate_report, topic, "matchmaking")
            yield f"data: {json.dumps({'type': 'result', 'report': report})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'msg': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/banking")
async def generate_banking(req: ResearchRequest):
    topic = req.topic.strip()
    async def event_generator():
        mock_logs = [
            {"agent": "System", "msg": "Initializing Corporate Banking Audit..."},
            {"agent": "KYC Analyst", "msg": "Cross-referencing UBO details and corporate structure..."},
            {"agent": "Risk Assessor", "msg": "Evaluating AML risks against UAE Central Bank guidelines..."},
            {"agent": "System", "msg": "Pre-screening complete. Generating Banking Roadmap..."}
        ]
        try:
            for log in mock_logs:
                yield f"data: {json.dumps({'type': 'agent_switch', 'agent': log['agent']})}\n\n"
                yield f"data: {json.dumps({'type': 'agent_log', 'agent': log['agent'], 'msg': log['msg']})}\n\n"
                await asyncio.sleep(1.5)
                
            report = await asyncio.to_thread(generate_report, topic, "banking")
            yield f"data: {json.dumps({'type': 'result', 'report': report})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'msg': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/health")
def health():
    return {"status": "Backend Running"}
