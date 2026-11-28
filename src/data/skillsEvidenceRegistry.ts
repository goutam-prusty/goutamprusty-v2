/**
 * Authoritative Canonical Skills & Evidence Registry
 * goutamprusty.com v2 — Recruiter-First Homepage & Evidence-Driven Skills Architecture
 *
 * Terminology:
 * "55 technologies, frameworks and engineering concepts across projects, active development, research and structured learning."
 *
 * Rules:
 * - No title matching.
 * - No substring matching.
 * - No generic tag matching.
 * - No automatic practical-proficiency claims.
 * - No planned component treated as implemented evidence.
 * - Research and writing relationships must be curated and relevant.
 * - Each relationship explicitly documents what it demonstrates AND what it does not demonstrate.
 */

export type EvidenceClassification =
  | 'project_implementation'
  | 'active_development'
  | 'research_evidence'
  | 'technical_writing';

export type ContentStatus = 'published' | 'in_development';
export type ContentType = 'project' | 'research' | 'writing';

export interface EvidenceRecord {
  contentId: string; // e.g. 'PRJ-004', 'PRJ-005', 'RES-018', 'BLG-001'
  contentSlug: string; // URL slug to link directly to the source
  contentTitle: string; // Verbatim title
  contentType: ContentType;
  classification: EvidenceClassification;
  status: ContentStatus;
  badgeLabel: string; // e.g. 'PRJ-004', 'PRJ-005 (In Dev)', 'RES-018', 'BLG-001'
  demonstrates: string; // Explicit statement of verified scope
  doesNotDemonstrate: string; // Explicit boundary statement
}

export interface CanonicalSkill {
  id: string; // Canonical kebab-case slug e.g. 'python', 'fastapi'
  name: string; // Official display name
  categoryId: string; // e.g. 'core-ai', 'programming-data', etc.
  categoryName: string;
  categoryNumber: string;
  focus: string; // Concise context description
  isRepresentative?: boolean; // Highlighted on compact homepage overview
  evidence: EvidenceRecord[]; // Empty for display-only skills
}

export interface SkillCategory {
  id: string;
  number: string;
  title: string;
  focus: string;
  symbol: string;
  skillIds: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'core-ai',
    number: '01',
    title: 'Core AI & Engineering Systems',
    focus: 'Foundational runtime, core languages & API infrastructure',
    symbol: '⊕',
    skillIds: [
      'python',
      'sql',
      'machine-learning-fundamentals',
      'data-preprocessing',
      'model-training-evaluation',
      'llm-apis',
      'prompt-engineering',
      'embeddings',
      'rag',
      'vector-databases',
      'fastapi',
      'rest-apis',
      'git-github',
      'ai-llm-evaluation',
      'docker',
      'cloud-deployment',
    ],
  },
  {
    id: 'programming-data',
    number: '02',
    title: 'Programming and data',
    focus: 'Data structures, tabular modeling & systems fundamentals',
    symbol: '⟨/⟩',
    skillIds: [
      'oop',
      'data-structures-algorithms',
      'numpy',
      'pandas',
      'linux',
      'debugging',
      'software-testing',
      'postgresql',
    ],
  },
  {
    id: 'ml-nlp',
    number: '03',
    title: 'Machine learning and NLP',
    focus: 'Statistical learning, deep learning & language models',
    symbol: '⊚',
    skillIds: [
      'scikit-learn',
      'supervised-learning',
      'unsupervised-learning',
      'neural-networks',
      'pytorch',
      'tensorflow',
      'nlp',
      'transformers',
      'hugging-face',
    ],
  },
  {
    id: 'gen-ai',
    number: '04',
    title: 'Generative AI and application development',
    focus: 'LLM orchestrators, structured output & application design',
    symbol: '◈',
    skillIds: [
      'large-language-models',
      'structured-outputs',
      'function-calling',
      'tokenization',
      'fine-tuning',
      'langchain',
      'langgraph',
      'llamaindex',
    ],
  },
  {
    id: 'rag-agents',
    number: '05',
    title: 'RAG and agentic systems',
    focus: 'Context retrieval, search ranking & tool-calling protocols',
    symbol: '◬',
    skillIds: [
      'semantic-search',
      'hybrid-search',
      'reranking',
      'ai-agents',
      'tool-calling',
      'agent-workflows',
      'mcp',
    ],
  },
  {
    id: 'deployment-prod',
    number: '06',
    title: 'Deployment and production engineering',
    focus: 'CI/CD, observability, evaluation & container orchestration',
    symbol: '⊞',
    skillIds: [
      'cloud-infrastructure-platforms',
      'ci-cd',
      'model-monitoring',
      'llm-observability',
      'model-deployment',
      'lora-qlora',
      'kubernetes',
    ],
  },
];

/**
 * All 55 Canonical Technologies, Frameworks & Engineering Concepts.
 * Only skills with verified qualifying evidence carry non-empty `evidence` arrays.
 */
export const CANONICAL_SKILLS: Record<string, CanonicalSkill> = {
  // Category 01: Core AI & Engineering Systems
  python: {
    id: 'python',
    name: 'Python',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Backend service runtime and scientific computing',
    isRepresentative: true,
    evidence: [
      {
        contentId: 'PRJ-005',
        contentSlug: 'grounded-technical-docs-rag-assistant',
        contentTitle: 'Grounded Technical Docs RAG Assistant',
        contentType: 'project',
        classification: 'active_development',
        status: 'in_development',
        badgeLabel: 'PRJ-005 (In Dev)',
        demonstrates: 'Python 3.12 service runtime, modern package management (uv), and 32 passing pytest unit and endpoint tests.',
        doesNotDemonstrate: 'Distributed worker queues or high-throughput production ML serving.',
      },
    ],
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Relational database querying and schema modeling',
    evidence: [],
  },
  'machine-learning-fundamentals': {
    id: 'machine-learning-fundamentals',
    name: 'Machine Learning Fundamentals',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Supervised and unsupervised learning principles',
    evidence: [],
  },
  'data-preprocessing': {
    id: 'data-preprocessing',
    name: 'Data Preprocessing',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Feature scaling, missing value imputation and data cleaning',
    evidence: [],
  },
  'model-training-evaluation': {
    id: 'model-training-evaluation',
    name: 'Model Training and Evaluation',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Cross-validation, loss functions and evaluation metrics',
    evidence: [],
  },
  'llm-apis': {
    id: 'llm-apis',
    name: 'LLM APIs',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Model provider client interfaces and request orchestration',
    evidence: [],
  },
  'prompt-engineering': {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Instruction formulation, iterative prompt direction and zero/few-shot prompting',
    isRepresentative: true,
    evidence: [
      {
        contentId: 'PRJ-004',
        contentSlug: 'ai-engineer-command-center',
        contentTitle: 'AI Engineer Command Center',
        contentType: 'project',
        classification: 'project_implementation',
        status: 'published',
        badgeLabel: 'PRJ-004',
        demonstrates: 'Iterative prompt direction and workflow specification used to generate, integrate, and validate React and Firestore application components.',
        doesNotDemonstrate: 'Automated DSPy optimization or production few-shot tuning pipelines.',
      },
    ],
  },
  embeddings: {
    id: 'embeddings',
    name: 'Embeddings',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Dense vector representations for semantic retrieval (Planned in PRJ-005 architecture; not yet instantiated in repo)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  rag: {
    id: 'rag',
    name: 'Retrieval-Augmented Generation (RAG)',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Context-injected prompt synthesis and grounded retrieval architecture (Planned in PRJ-005)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  'vector-databases': {
    id: 'vector-databases',
    name: 'Vector Databases',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Vector indexing and approximate nearest-neighbor search (Qdrant schemas planned in PRJ-005; store not yet spun up)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  fastapi: {
    id: 'fastapi',
    name: 'FastAPI',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Asynchronous Python REST API development',
    isRepresentative: true,
    evidence: [
      {
        contentId: 'PRJ-005',
        contentSlug: 'grounded-technical-docs-rag-assistant',
        contentTitle: 'Grounded Technical Docs RAG Assistant',
        contentType: 'project',
        classification: 'active_development',
        status: 'in_development',
        badgeLabel: 'PRJ-005 (In Dev)',
        demonstrates: 'FastAPI application factory, CORS middleware setup, API routing, and health verification endpoint with passing pytest tests.',
        doesNotDemonstrate: 'Streaming LLM token endpoints or production ASGI multi-worker process clustering.',
      },
    ],
  },
  'rest-apis': {
    id: 'rest-apis',
    name: 'REST APIs',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'HTTP request/response contracts, status codes and endpoint design',
    evidence: [],
  },
  'git-github': {
    id: 'git-github',
    name: 'Git and GitHub',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Source code version control and daily development repository workflows',
    evidence: [],
  },
  'ai-llm-evaluation': {
    id: 'ai-llm-evaluation',
    name: 'AI/LLM Evaluation',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Evaluation benchmarks, hallucination detection and scoring criteria',
    evidence: [],
  },
  docker: {
    id: 'docker',
    name: 'Docker',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Containerized execution environments (Documented in PRJ-005 deployment spec; Dockerfile pending)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  'cloud-deployment': {
    id: 'cloud-deployment',
    name: 'Cloud Deployment',
    categoryId: 'core-ai',
    categoryName: 'Core AI & Engineering Systems',
    categoryNumber: '01',
    focus: 'Hosting web applications on cloud platforms',
    isRepresentative: true,
    evidence: [],
  },

  // Category 02: Programming and data
  oop: {
    id: 'oop',
    name: 'Object-Oriented Programming',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Encapsulation, inheritance and modular class architecture',
    evidence: [],
  },
  'data-structures-algorithms': {
    id: 'data-structures-algorithms',
    name: 'Data Structures and Algorithms',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Algorithm complexity, trees, queues and hash mappings',
    isRepresentative: true,
    evidence: [],
  },
  numpy: {
    id: 'numpy',
    name: 'NumPy',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'N-dimensional array manipulation and vectorized computations',
    evidence: [],
  },
  pandas: {
    id: 'pandas',
    name: 'Pandas',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Tabular DataFrame filtering, aggregation and time-series analysis',
    evidence: [],
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Command-line execution, shell scripting and filesystem navigation',
    evidence: [],
  },
  debugging: {
    id: 'debugging',
    name: 'Debugging',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Root-cause analysis, stack trace inspection and defect remediation',
    evidence: [],
  },
  'software-testing': {
    id: 'software-testing',
    name: 'Software Testing',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Unit assertions, test fixtures and automated regression checks',
    isRepresentative: true,
    evidence: [],
  },
  postgresql: {
    id: 'postgresql',
    name: 'PostgreSQL',
    categoryId: 'programming-data',
    categoryName: 'Programming and data',
    categoryNumber: '02',
    focus: 'Relational schema design, indexes and ACID transactions',
    isRepresentative: true,
    evidence: [],
  },

  // Category 03: Machine learning and NLP
  'scikit-learn': {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Classical statistical learning pipelines and feature selection',
    isRepresentative: true,
    evidence: [],
  },
  'supervised-learning': {
    id: 'supervised-learning',
    name: 'Supervised Learning',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Regression, classification trees and gradient boosting models',
    evidence: [],
  },
  'unsupervised-learning': {
    id: 'unsupervised-learning',
    name: 'Unsupervised Learning',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Clustering algorithms (K-Means) and dimensionality reduction (PCA)',
    evidence: [],
  },
  'neural-networks': {
    id: 'neural-networks',
    name: 'Neural Networks',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Feedforward networks, backpropagation and activation functions',
    evidence: [],
  },
  pytorch: {
    id: 'pytorch',
    name: 'PyTorch',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Tensors, autograd engine and deep learning architectures',
    isRepresentative: true,
    evidence: [],
  },
  tensorflow: {
    id: 'tensorflow',
    name: 'TensorFlow',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Dataflow graphs and computational execution',
    evidence: [],
  },
  nlp: {
    id: 'nlp',
    name: 'Natural Language Processing',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Tokenization, TF-IDF representations and semantic language modeling',
    evidence: [],
  },
  transformers: {
    id: 'transformers',
    name: 'Transformers',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Self-attention mechanisms, encoder-decoder blocks and scaling dynamics',
    isRepresentative: true,
    evidence: [],
  },
  'hugging-face': {
    id: 'hugging-face',
    name: 'Hugging Face',
    categoryId: 'ml-nlp',
    categoryName: 'Machine learning and NLP',
    categoryNumber: '03',
    focus: 'Model hub, tokenizer utilities and transformer pipelines',
    evidence: [],
  },

  // Category 04: Generative AI and application development
  'large-language-models': {
    id: 'large-language-models',
    name: 'Large Language Models',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Foundation models, autoregressive decoding and reasoning architectures',
    isRepresentative: true,
    evidence: [
      {
        contentId: 'RES-018',
        contentSlug: 'strategic-intelligence-report-the-state-of-artificial-intelligence-and-frontier-technologies-in-2026',
        contentTitle: 'Strategic Intelligence Report: The State of Artificial Intelligence and Frontier Technologies in 2026',
        contentType: 'research',
        classification: 'research_evidence',
        status: 'published',
        badgeLabel: 'RES-018',
        demonstrates: 'Comprehensive research briefing evaluating frontier reasoning models (DeepSeek-R1, OpenAI o1), Group Relative Policy Optimization (GRPO), compute scaling constraints, and enterprise adoption bottlenecks.',
        doesNotDemonstrate: 'Training foundation weights from scratch or manual pretraining cluster engineering.',
      },
    ],
  },
  'structured-outputs': {
    id: 'structured-outputs',
    name: 'Structured Outputs',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Constrained generation schemas, grammar-guided decoding and JSON outputs',
    isRepresentative: true,
    evidence: [], // User instruction: Pydantic validation in PRJ-005 is not equivalent to LLM structured output generation
  },
  'function-calling': {
    id: 'function-calling',
    name: 'Function Calling',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'JSON schema declarations for external tool execution via LLMs',
    isRepresentative: true,
    evidence: [],
  },
  tokenization: {
    id: 'tokenization',
    name: 'Tokenization',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Byte-pair encoding, vocabulary bounds and context window budgeting',
    evidence: [],
  },
  'fine-tuning': {
    id: 'fine-tuning',
    name: 'Fine-tuning',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Instruction tuning, supervised parameter updates and domain adaptation',
    evidence: [],
  },
  langchain: {
    id: 'langchain',
    name: 'LangChain',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Composition framework for LLM chains and tool integration',
    evidence: [],
  },
  langgraph: {
    id: 'langgraph',
    name: 'LangGraph',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Cyclic stateful graph orchestration for multi-step agent systems',
    evidence: [],
  },
  llamaindex: {
    id: 'llamaindex',
    name: 'LlamaIndex',
    categoryId: 'gen-ai',
    categoryName: 'Generative AI and application development',
    categoryNumber: '04',
    focus: 'Data ingestion, chunk indexing and retrieval engine patterns',
    evidence: [],
  },

  // Category 05: RAG and agentic systems
  'semantic-search': {
    id: 'semantic-search',
    name: 'Semantic Search',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Dense vector similarity calculation (cosine, dot product)',
    isRepresentative: true,
    evidence: [],
  },
  'hybrid-search': {
    id: 'hybrid-search',
    name: 'Hybrid Search',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Reciprocal Rank Fusion uniting sparse BM25 and dense vector ranking (Planned in PRJ-005)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  reranking: {
    id: 'reranking',
    name: 'Reranking',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Cross-encoder relevance scoring over retrieved candidate chunks (Planned in PRJ-005)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },
  'ai-agents': {
    id: 'ai-agents',
    name: 'AI Agents',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Autonomous decision loops, tool orchestration and environment interaction',
    isRepresentative: true,
    evidence: [
      {
        contentId: 'BLG-001',
        contentSlug: 'agentic-inflection-point',
        contentTitle: 'The Agentic Inflection Point',
        contentType: 'writing',
        classification: 'technical_writing',
        status: 'published',
        badgeLabel: 'BLG-001',
        demonstrates: 'Strategic technical writing and architectural analysis examining where agentic systems stand, SWE-bench performance implications, tool execution constraints, and enterprise integration bottlenecks.',
        doesNotDemonstrate: 'Practical software implementation of autonomous multi-agent execution loops or production tool calling.',
      },
    ],
  },
  'tool-calling': {
    id: 'tool-calling',
    name: 'Tool Calling',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Structured schema invocation for APIs, code interpreters and calculations',
    evidence: [],
  },
  'agent-workflows': {
    id: 'agent-workflows',
    name: 'Agent Workflows',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Sequential, routing, parallel and evaluator-optimizer agent patterns',
    isRepresentative: true,
    evidence: [],
  },
  mcp: {
    id: 'mcp',
    name: 'Model Context Protocol (MCP)',
    categoryId: 'rag-agents',
    categoryName: 'RAG and agentic systems',
    categoryNumber: '05',
    focus: 'Standardized open protocol connecting LLMs to external systems and tools (Documented in PRJ-005 spec; server pending)',
    evidence: [], // Strictly planned architecture: not qualifying as implemented evidence
  },

  // Category 06: Deployment and production engineering
  'cloud-infrastructure-platforms': {
    id: 'cloud-infrastructure-platforms',
    name: 'AWS / Azure / Google Cloud',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Cloud infrastructure components, identity access and serverless hosting',
    isRepresentative: true,
    evidence: [],
  },
  'ci-cd': {
    id: 'ci-cd',
    name: 'CI/CD',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Continuous integration pipelines and automated build triggers',
    isRepresentative: true,
    evidence: [],
  },
  'model-monitoring': {
    id: 'model-monitoring',
    name: 'Model Monitoring',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Data drift detection, inference latency and response distribution telemetry',
    evidence: [],
  },
  'llm-observability': {
    id: 'llm-observability',
    name: 'LLM Observability',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Span tracing, token accounting and prompt/response debugging instrumentation',
    evidence: [],
  },
  'model-deployment': {
    id: 'model-deployment',
    name: 'Model Deployment',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Containerized service endpoints and local API hosting',
    evidence: [],
  },
  'lora-qlora': {
    id: 'lora-qlora',
    name: 'LoRA / QLoRA',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Low-rank parameter adaptation and quantized fine-tuning efficiency',
    evidence: [],
  },
  kubernetes: {
    id: 'kubernetes',
    name: 'Kubernetes',
    categoryId: 'deployment-prod',
    categoryName: 'Deployment and production engineering',
    categoryNumber: '06',
    focus: 'Container orchestration, pod scheduling and cluster scaling',
    isRepresentative: true,
    evidence: [],
  },
};
