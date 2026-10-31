# AI TOOLS — Knowledge Base & Learning Roadmap

> Language: Hebrew. This file is reference material for the AI TOOLS learning project, not a set of runtime instructions.
> Updated: 2026-10-28. Verify rapidly changing product capabilities against official documentation before relying on them.

## 1. Project mission

Build a practical, accurate atlas of the AI engineering ecosystem from the perspective of an experienced software developer. The goal is to become proficient in **Applied AI Engineering**, agentic systems and enterprise AI automation, including architecture, integration, evaluation, security and delivery.

Existing background: C#, .NET / ASP.NET, React, JavaScript, SQL / Oracle, REST APIs, enterprise systems, Git, GitHub, Jira, and AI coding assistants such as Codex.

Prioritize architectural understanding, practical projects and sound technology selection over memorizing many vendor APIs.

## 2. Twelve knowledge areas

The numbering below is stable and should be preserved across project notes.

| ID | Category | Key concepts / tools | Starting priority |
|---|---|---|---|
| 00 | AI Ecosystem | AI, ML, DL, LLMs, tokens, context, inference, fine-tuning, agents, RAG | Very high |
| 01 | AI Coding Assistants | Codex, Claude Code, Cursor, GitHub Copilot, Windsurf | Very high |
| 02 | Agent Frameworks & Orchestration | LangChain, LangGraph, OpenAI Agents SDK, CrewAI, Microsoft Agent Framework, Pydantic AI | Very high |
| 03 | Workflow Automation | n8n, Make, Zapier, Activepieces, Temporal | Very high |
| 04 | RAG & Knowledge Systems | LlamaIndex, Haystack, RAGFlow, embeddings, chunking, reranking | Very high |
| 05 | Vector Databases | Qdrant, Pinecone, Weaviate, pgvector, Milvus | Medium |
| 06 | Visual AI Builders | Dify, Flowise, Langflow, Botpress | Medium |
| 07 | LLMs & Model Providers | GPT, Claude, Gemini, Llama, Qwen, Mistral, DeepSeek, Gemma, Phi; Hugging Face, OpenRouter, Together AI | Very high |
| 08 | Local AI & Inference | Ollama, llama.cpp, vLLM, LM Studio, LiteLLM | Medium |
| 09 | MCP, Tools & Integrations | MCP, tool/function calling, REST APIs, connectors, clients, servers | Very high |
| 10 | Observability, Evals & Security | LangSmith, Langfuse, Phoenix, Ragas, Promptfoo; tracing, evals, guardrails | High |
| 11 | Training, Fine-tuning & MLOps | PyTorch, Transformers, PEFT/LoRA, MLflow, Weights & Biases | Medium |

Distinguish among model, model provider, inference runtime, library, SDK, framework, protocol, orchestration engine, product, and hosted service. A tool may span multiple categories.

## 3. Detailed focus: Area 02 — Agent Frameworks & Orchestration

### LangChain
- **Type:** Agent/application framework and integrations.
- **Main languages:** Python, TypeScript.
- **Purpose:** Connect models, tools, data sources and application components.
- **Trade-off:** Rich integrations; abstractions and dependency management add complexity.
- Docs: https://docs.langchain.com/
- GitHub: https://github.com/langchain-ai/langchain

### LangGraph
- **Type:** Stateful graph-based agent/workflow orchestration framework.
- **Main languages:** Python, TypeScript.
- **Purpose:** Nodes, edges, shared state, conditional transitions, persistence, interrupts and long-running workflows.
- **Trade-off:** Fine-grained control; requires explicit flow and state design.
- Docs: https://docs.langchain.com/oss/python/langgraph/overview
- GitHub: https://github.com/langchain-ai/langgraph

### OpenAI Agents SDK
- **Type:** Agent SDK.
- **Main official SDK languages:** Python, TypeScript; verify current language support before implementation.
- **Purpose:** Agents, runner/agent loop, tools, handoffs, guardrails, tracing.
- **Important:** Do not confuse the Agents SDK with OpenAI's API or the separate OpenAI .NET SDK. A C# application can implement model/tool calls without using Agents SDK.
- Docs: https://openai.github.io/openai-agents-python/
- GitHub: https://github.com/openai/openai-agents-python and https://github.com/openai/openai-agents-js

### CrewAI
- **Type:** Multi-agent/team orchestration framework.
- **Main language:** Python.
- **Purpose:** Roles, tasks, crews and flows.
- **Trade-off:** Convenient multi-agent patterns; more agents may increase cost, latency and failure modes.
- Docs: https://docs.crewai.com/
- GitHub: https://github.com/crewAIInc/crewAI

### Microsoft Agent Framework
- **Type:** Agent and workflow development framework.
- **Main languages:** C#/.NET, Python.
- **Purpose:** Tool-using agents, orchestration, workflows and enterprise integrations.
- **Relevance:** Strong candidate for native C# implementation.
- **Caution:** Verify current packages, API signatures, stability and compatibility with the target .NET version; do not assume every feature in one language is identical in another.
- Docs: https://learn.microsoft.com/en-us/agent-framework/
- GitHub: https://github.com/microsoft/agent-framework

### Pydantic AI
- **Type:** Typed agent framework.
- **Main language:** Python.
- **Purpose:** Agents, typed outputs, dependency injection and validation.
- **Trade-off:** Especially useful in Python-heavy projects; equivalent business validation remains necessary.
- Docs: https://ai.pydantic.dev/
- GitHub: https://github.com/pydantic/pydantic-ai

### Important .NET integration distinction

Among these six, Microsoft Agent Framework is the clearest official C#/.NET-first option discussed. Others are primarily Python/TypeScript/Python frameworks. Possible integration into a .NET system:
1. Run the framework in a separate Python/Node service and invoke it via HTTP/gRPC/events.
2. Use an appropriate native .NET alternative (for example Microsoft Agent Framework or a custom agent loop).
3. Directly use an LLM provider's .NET SDK/API and implement only the needed orchestration.

Do **not** treat community ports as equivalent to first-party SDKs. Re-check current support when making implementation choices.

## 4. Three different but related engineering disciplines

1. **AI-assisted software development:** Codex, Claude Code, IDE agents; AI helps developers build software.
2. **AI-powered application development:** Build products whose runtime includes models, RAG, agents, tool calling and business rules.
3. **Enterprise workflow automation:** Integrate email, documents, CRM, ERP, databases and approvals. It may be deterministic, AI-assisted or agentic.

MCP/tool calling are relevant to multiple disciplines. n8n is not itself an LLM. RAG usually does not require fine-tuning.

## 5. Choosing languages and tools for enterprise projects

- **Python:** Largest practical ecosystem for AI research, training, many agent/RAG libraries, prototyping and AI backends.
- **TypeScript:** Strong choice for web-centric AI applications, Node.js services and React-based products.
- **C#/.NET:** Strong choice for established .NET organizations, enterprise APIs, authorization, typed business logic and integration; Microsoft Agent Framework is a relevant option.
- **Java:** Relevant for Java-centric enterprise estates.
- **n8n / Make:** Fast to integrate familiar services and deliver relatively straightforward workflow automation.

There is **no universally proven language ranking for enterprise AI implementations**. Choose according to existing infrastructure, team, official SDK support, integration needs, latency, security, cost and maintainability. Python's dominance in AI repositories does not imply every business automation should be written in Python.

### Decision examples

| Situation | Initial candidate | Alternatives / notes |
|---|---|---|
| Existing ASP.NET Core system needs an AI assistant | C# + model SDK / Microsoft Agent Framework | Separate Python agent service only if it adds clear value |
| New agent/RAG service heavily dependent on Python libraries | Python + FastAPI + appropriate agent framework | TypeScript where supported |
| Web product with Node/React team | TypeScript | Python/C# backend depending on ecosystem |
| Simple cross-app process (email → parse → review → update) | n8n / Make | Custom code for harder security, reliability or complexity |
| Multi-step stateful agent requiring checkpoints | LangGraph or suitable Microsoft workflows | Evaluate feature parity and operational burden |
| Model training/fine-tuning | Python ecosystem | Separate operational/application layers as needed |

## 6. Practical learning sequence

1. Implement a **manual tool-calling agent loop in C#** to understand messages, model response, tool execution, result feedback, validation, retries, state, and approval.
2. Implement the same scenario with **Microsoft Agent Framework** and compare what it abstracts.
3. Learn practical Python essentials for an experienced developer: environment management, typing, async, packaging, FastAPI, Pydantic.
4. Explore **OpenAI Agents SDK**, **LangChain**, **LangGraph** on the same use case.
5. Learn **n8n** and compare low-code to custom orchestration.
6. Add RAG and vector retrieval where the business problem truly requires it.
7. Introduce evals, tracing, authorization, prompt-injection defenses, cost monitoring and human approval before production.
8. Survey CrewAI and Pydantic AI, then implement only if their unique capabilities justify the dependency.

## 7. Reference practice project — Enterprise equipment request agent

Business example: a request arrives in natural language; the system extracts item IDs and quantities, checks available stock via SQL/API, validates business rules, requests missing fields, prepares a proposed action, obtains explicit authorized approval, executes permitted changes and writes audit logs.

### Example components
- UI: React.
- Backend: ASP.NET Core.
- Data: SQL/Oracle and existing REST APIs.
- LLM/Agent: begin with model API + manual loop; compare Microsoft Agent Framework and optionally Python service approaches.
- Safety: least-privilege tool scopes, server-side validation, approval before writes, audit trail, idempotency and retries.

### Suggested comparisons
- Amount of code and abstractions.
- State persistence and recovery.
- Human-in-the-loop controls.
- Observability and evaluation.
- Unit/integration testing.
- Cost and latency.
- Deployment complexity and operational ownership.

## 8. Knowledge-writing standard for every tool

For each tool document:
1. Purpose and problem solved.
2. Category: model / library / SDK / framework / protocol / platform / product.
3. Internal architecture and execution flow.
4. Example of an actual enterprise use case.
5. C#, Python and TypeScript support; official SDK versus indirect integration.
6. Main alternatives and trade-offs.
7. Connections to other AI TOOLS categories.
8. Official website, docs and GitHub links where available.
9. Adoption/maturity only with current verifiable sources.
10. Priority: must learn / should know / enrichment.
11. Prerequisites and hands-on exercise.
12. Security, privacy, cost and production implications.

## 9. Next learning task

**Compare a native, manual C# agent with Microsoft Agent Framework using the same inventory request scenario.** Start with a concrete execution trace (model → tool request → validated C# function → tool result → model) and then cover state, errors, guardrails, multi-agent coordination, checkpoints, approvals and telemetry. Explain what is handled by the framework and what is still the application's responsibility.

## 10. Source-of-truth policy

This document captures conclusions and learning priorities from an earlier conversation. It is **not** a current authoritative compatibility matrix. Re-check version-specific APIs, SDK language coverage, support policies and deprecations in official documentation before coding or making categorical claims.
