# Stage B Preparation: Evidence-Based Content Refinement & Editorial Portrait Approval

> **Status:** Proposal for Owner Review (Approval-First Gate — Stage B Unimplemented)  
> **Repository:** `goutamprusty-v2`  
> **Active Branch:** `codex/visual-experience-upgrade`  
> **Inspection Date:** 28 November 2026  
> **Execution Constraint:** Zero published CMS writes, zero asset overwrites, zero commits or pushes until explicit owner approval.

---

## 1. Executive Recommendation

This document provides the complete, evidence-backed preparation for Stage B. It resolves the three core credibility and visual concerns identified across our independent audits:
1. **Portrait Presentation**: Establishes a restrained editorial grade that harmonises naturally with the Paper & Signal design system while strictly preserving authentic facial detail, skin texture, and clothing.
2. **PRJ-004 Authorship Disclosure**: Replaces self-sabotaging copy (*"copying and applying AI-generated code"*) with an accurate, defensible technical disclosure of AI-assisted engineering that honestly distinguishes personal requirements/workflow specification from AI code generation.
3. **55-Technology Credibility Audit**: Re-audits every entry against empirical project code, enforcing the critical boundary that planned architecture is not implemented capability.

---

## 2. Portrait Comparison & Recommendation

### A. Photographic Analysis & Defect Diagnosis
The original photograph (`public/images/portrait/goutam-prusty.webp`, 800×1000px WebP) is an authentic, uncorrupted daylight capture. However, pixel analysis reveals why it feels visually disconnected from the site:
- **Luminance Imbalance**: The facial region sits at an average luminance of **90.6 / 255 (mid-shadow)**, while the ambient background window edge sits at **166.6 / 255 (highlight)**. In classical portrait composition, the face should be the brightest midtone.
- **Color Cast**: The window on the left introduces a cool daylight cast (`B=159.2`), clashing with the warm cream Paper & Signal palette (`#F7F4EC` / `#FDFCF8`).
- **Contrast & Flare**: Harsh specular reflections on the left curtain fold draw the eye away from the expression.

### B. Two Editorial Grading Candidates (Non-Destructive)
Two candidate corrections were generated using deterministic Python (PIL/NumPy) scripts. **The original `public/images/portrait/goutam-prusty.webp` remains completely untouched.**

| Metric | Original (`goutam-prusty.webp`) | Candidate 1: Warm Editorial (`goutam-prusty-editorial.webp`) | Candidate 2: Restrained Editorial (`goutam-prusty-editorial-restrained.webp`) | Target / Reference |
| :--- | :---: | :---: | :---: | :---: |
| **Cheek RGB** | `130.0, 96.7, 84.4` | `144.8, 110.2, 93.5` | **`140.2, 106.7, 92.4`** | Fresh, authentic skin |
| **Cheek R/G Ratio** | `1.34` | `1.31` | **`1.31`** | **Not orange/yellow** |
| **Forehead Shadow** | `35.1, 39.2, 51.6` | `46.1, 50.2, 61.2` | **`42.9, 47.2, 59.5`** | Natural shadow detail |
| **Gamma Adjustment** | `1.00` | `0.86` (+16% lift) | **`0.89` (+10% lift)** | Preserves rich contrast |
| **Color Temperature** | Camera default | $+3.5\%\text{ R}, -3.5\%\text{ B}$ | **$+2.0\%\text{ R}, +1.0\%\text{ G}, -1.8\%\text{ B}$** | Soft daylight harmony |
| **Highlight Rolloff** | None (specular) | Soft knee above 0.85 | **Soft knee above 0.82 (prevents blowout)** | Controlled window glare |
| **Facial Texture** | Original | Unsharp mask ($r=1.5, 40\%$) | **Mild clarity ($r=1.2, 30\%$)** | Pores/eyes 100% natural |

### C. Visual Evidence & Viewport Crops

#### 1. Full-Resolution Comparison
![Full Resolution Comparison](../../public/images/portrait/portrait-full-comparison.png)

#### 2. Desktop Hero Arch Crop (Simulated 430×526px at 1440px viewport)
![Desktop Hero Arch Comparison](../../public/images/portrait/portrait-desktop-arch-comparison.png)

#### 3. Mobile Hero Arch Crop (Simulated 240×300px at 390px viewport)
![Mobile Hero Arch Comparison](../../public/images/portrait/portrait-mobile-arch-comparison.png)

### D. Art Director Recommendation
**Recommendation: Select Candidate 2 (`goutam-prusty-editorial-restrained.webp`).**  
*Reason:* Candidate 2 strikes the ideal balance. It gently illuminates your facial expression (+10 RGB points) and eliminates the dreary blue window cast without pushing skin tones into yellow or orange territory. It harmonises naturally with the cream background while keeping the hair, eyes, and polo texture 100% authentic.

---

## 3. PRJ-004: Evidence-Based AI-Assisted Development Disclosure

### A. Source-of-Truth Verification & Claim Audit
We inspected the actual project source tree (`github.com/goutam-prusty/ai-engineer-command-center`), `docs/drafts/command-center-case-study.md`, and unit tests (`tests/merge.test.ts`, `tests/codecs-rules.test.ts`):

1. **Did Goutam personally define functional requirements?**
   - **Verified:** Yes. Conceived as a personal tracking utility specifically structured around the 20-week DataMites curriculum (CDM-DSF-112). Goutam specified the weekly hour pacing, study categories, milestone portfolio projects, flashcard concepts, and learning journal schema.
2. **Did Goutam specify learning workflows?**
   - **Verified:** Yes. Designed the sequential learning workflow: Weekly Study Room $\rightarrow$ Topic Status Flags $\rightarrow$ Active Recall Flashcards $\rightarrow$ Study Session Logging $\rightarrow$ Progress Analytics.
3. **Did Goutam direct implementation through prompts?**
   - **Verified:** Yes. Iteratively formulated prompts using ChatGPT, Claude, and Antigravity IDE to produce the React components, state context, and Firestore codecs.
4. **Did Goutam integrate generated code?**
   - **Verified:** Yes. Goutam assembled the generated files, views (`src/views/`), contexts (`src/context/`), and data files into a cohesive Vite project structure and configured build/deploy toolchains.
5. **Did Goutam run local validation & debugging?**
   - **Verified:** Yes. Verified local offline functionality (`localStorage`), tested Firebase Google OAuth authentication, executed local builds, and verified Vercel production hosting.
6. **Which architectural decisions were personal vs. AI-suggested?**
   - *Goutam's Decisions:* Product vision, single-page application scope, 20-week syllabus taxonomy, local-first offline requirement, and Google OAuth login option.
   - *AI-Suggested / Generated:* Component modularization, `AppStateContext` reducer structure, Tailwind CSS styling tokens, Firestore security rule syntax, and test assertions.

### B. Proposed Side-by-Side Copy Revisions

| Field / Location | Current Self-Sabotaging Copy | Proposed Professional & Truthful Replacement | Evidence & Verification Note |
| :--- | :--- | :--- | :--- |
| **`role`**<br>*(Metadata Strip & Card)* | *Project conception, learning workflow specification, and prompt formulation; copying and applying AI-generated code.* | **Project conception, learning workflow specification, prompt direction, code integration, and local functional validation.** | Accurately describes the end-to-end management of an AI-assisted engineering workflow without claiming independent manual coding. |
| **`aiAttribution`**<br>*(Case Study Disclosure Box)* | *The idea was mine and I initially made the project for my own use. I later expanded it so my friends could use it too. ChatGPT, Claude and Antigravity IDE generated the code and suggested the architecture, technology stack, project structure and development plan. My hands-on coding contribution was copying and applying the AI-generated code.* | **Conceived and specified as a personal learning workspace for an intensive 20-week AI engineering curriculum. Developed through an AI-assisted engineering workflow using ChatGPT, Claude, and Antigravity IDE. My contribution focused on defining functional requirements and learning workflows, directing implementation through structured prompts, integrating generated code into a working repository, and validating application behaviour locally.** | Transparently acknowledges AI code generation while eliminating self-deprecating phrasing. Defensible in technical interviews. |
| **`body` Block 2**<br>*(Case Study Text)* | *...with hands-on development focused on defining workflow requirements, prompt direction, copying, applying, and validating generated code locally.* | *...Application code and project structure were developed collaboratively through AI assistance (ChatGPT, Claude, and Antigravity IDE), with hands-on development centered on specifying curriculum workflows, iterative prompt direction, component integration, and local validation.* | Professional editorial standard; maintains strict boundary regarding code generation. |

---

## 4. Technology Credibility: Revalidation of All 55 Entries

### A. Strict Classification Principles
Per the user's directive, we enforce a strict empirical boundary:
- **Level 1 — Demonstrated in Published Project**: Direct code implementation live in a public repository (`PRJ-004` Command Center or Portfolio).
- **Level 2 — Documented in Active Project**: Present in an active in-development codebase. Implemented foundation code is distinguished from planned architecture.
- **Level 3 — Practised or Explored**: Coursework modules (DataMites 20-week training), hands-on lab exercises, or published analytical research (`RES-018`).
- **Level 4 — Conceptual / Exploring**: Conceptual familiarity without repository code or dedicated lab deployment.

### B. PRJ-005 Repository Ground-Truth Audit (`D:\grounded-technical-docs-rag-assistant`)
Direct inspection of the PRJ-005 codebase revealed:
- **Implemented & Tested (32 pytest tests passing in 0.73s):**
  - `Python 3.12` runtime (`pyproject.toml`, `.venv`)
  - `FastAPI` service (`src/rag_assistant/api/app.py`, `GET /health` integration test)
  - `Pydantic v2` data contracts & validation (`src/rag_assistant/schemas.py`, comprehensive unit tests)
  - `Uvicorn` ASGI server configuration
  - `Pytest` and `Ruff` tooling
- **Planned / Documented ONLY (Scaffolded empty `__init__.py` files, schemas only):**
  - `Vector Databases (Qdrant)`: Schemas exist in `schemas.py`, but no Qdrant client connection or database instance running.
  - `Embeddings (BGE)`: Field names exist in schemas, but no embedding model or tokenizer instantiated.
  - `Hybrid Search & Reranking`: Algorithmic steps documented in specification, but no retrieval engine coded.
  - `Docker`: Documented in deployment plan, but no `Dockerfile` present in repository.
  - `Model Context Protocol (MCP)`: Documented in integration spec, but no MCP server implemented.

### C. Complete 55-Item Revalidation Table

| Technology | Previous Level | Verified Status | Evidence & Repository Ground-Truth | Recommended Level | Project Association |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **Python** | Level 2 | Implemented & Tested | Python 3.12 backend foundation in PRJ-005 with 32 passing pytest assertions. | **Level 2** | `PRJ-005` (Foundation) |
| **SQL** | Level 3 | Practised in Coursework | Relational database schema and query exercises in DataMites syllabus. | **Level 3** | None |
| **Machine Learning Fundamentals** | Level 3 | Practised in Coursework | Supervised/unsupervised learning theory and evaluation metrics in curriculum. | **Level 3** | None |
| **Data Preprocessing** | Level 3 | Practised in Coursework | Data cleaning, feature scaling, and categorical encoding in coursework. | **Level 3** | None |
| **Model Training and Evaluation** | Level 3 | Practised in Coursework | Model evaluation workflows (accuracy, precision, recall, F1, RMSE) in ML labs. | **Level 3** | None |
| **LLM APIs** | Level 3 | Explored in Research | API prompting, latency, and capability evaluations in strategic research briefings. | **Level 3** | None |
| **Prompt Engineering** | Level 1 | Demonstrated in Production | Interactive prompt formulation and instruction design in PRJ-004 and research. | **Level 1** | `PRJ-004` |
| **Embeddings** | Level 2 | **Documented / Planned** | Dense vector embedding pipeline architected in PRJ-005 schemas; model not yet connected. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **Retrieval-Augmented Generation (RAG)** | Level 2 | **Documented / Planned** | Grounded RAG architecture, chunking, and validation pipeline specified in PRJ-005. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **Vector Databases** | Level 2 | **Documented / Planned** | Qdrant vector indexing and payload schemas specified in PRJ-005; store not yet spun up. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **FastAPI** | Level 2 | Implemented & Tested | FastAPI application with CORS and health endpoints in PRJ-005 (`test_health.py` passing). | **Level 2** | `PRJ-005` (Foundation) |
| **REST APIs** | Level 1 | Demonstrated in Production | Firebase REST/SDK endpoints in PRJ-004 and HTTP endpoints in PRJ-005. | **Level 1** | `PRJ-004` / `PRJ-005` |
| **Git and GitHub** | Level 1 | Demonstrated in Production | Version control across public repositories for PRJ-004, PRJ-005, and portfolio. | **Level 1** | `PRJ-004` / `PRJ-005` |
| **AI/LLM Evaluation** | Level 3 | Explored in Research | Strategic benchmark evaluation (ARC-AGI, Humanity's Last Exam) in RES-018. | **Level 3** | None |
| **Docker** | Level 2 | **Documented / Planned** | Containerized runtime documented in PRJ-005 project specification; Dockerfile pending. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **Cloud Deployment** | Level 1 | Demonstrated in Production | Live production deployments on Vercel (PRJ-004) and Cloudflare Pages (Portfolio). | **Level 1** | `PRJ-004` |
| **Object-Oriented Programming** | Level 1 | Demonstrated in Production | TypeScript classes, state stores in PRJ-004, and Python Pydantic classes in PRJ-005. | **Level 1** | `PRJ-004` / `PRJ-005` |
| **Data Structures and Algorithms** | Level 1 | Demonstrated in Production | Queue management, revision schedule algorithms, and state trees in PRJ-004. | **Level 1** | `PRJ-004` |
| **NumPy** | Level 3 | Practised in Coursework | Array manipulation, matrix operations, and linear algebra coursework exercises. | **Level 3** | None |
| **Pandas** | Level 3 | Practised in Coursework | DataFrame filtering, aggregation, and exploratory data analysis exercises. | **Level 3** | None |
| **Linux** | Level 3 | Practised in Development | Shell execution target and daily local development environment. | **Level 3** | None |
| **Debugging** | Level 1 | Demonstrated in Production | Integration debugging and error boundary resolution in PRJ-004 and PRJ-005. | **Level 1** | `PRJ-004` / `PRJ-005` |
| **Software Testing** | Level 1 | Demonstrated in Production | Unit tests in PRJ-004 (`merge.test.ts`) and 32 passing pytest tests in PRJ-005. | **Level 1** | `PRJ-004` / `PRJ-005` |
| **PostgreSQL** | Level 3 | Practised in Coursework | Relational database schema modeling, queries, and constraints in curriculum. | **Level 3** | None |
| **Scikit-learn** | Level 3 | Practised in Coursework | Classification and regression pipelines in introductory machine learning labs. | **Level 3** | None |
| **Supervised Learning** | Level 3 | Practised in Coursework | Regression, decision trees, random forests, and SVM modules in syllabus. | **Level 3** | None |
| **Unsupervised Learning** | Level 3 | Practised in Coursework | K-Means clustering and PCA dimensionality reduction modules in syllabus. | **Level 3** | None |
| **Neural Networks** | Level 3 | Practised in Coursework | Perceptrons, activation functions, and backpropagation in deep learning modules. | **Level 3** | None |
| **PyTorch** | Level 3 | Practised in Coursework | Tensor operations and basic neural network construction exercises in curriculum. | **Level 3** | None |
| **TensorFlow** | Level 3 | Practised in Coursework | Keras/TensorFlow graph concepts in deep learning introductory modules. | **Level 3** | None |
| **Natural Language Processing** | Level 3 | Practised in Coursework | Text preprocessing, TF-IDF, n-grams, and sentiment analysis coursework. | **Level 3** | None |
| **Transformers** | Level 3 | Explored in Research | Comprehensive architectural analysis of attention mechanisms in RES-018. | **Level 3** | None |
| **Hugging Face** | Level 3 | Practised in Coursework | Tokenizer inspection and pretrained model exploration in curriculum labs. | **Level 3** | None |
| **Large Language Models** | Level 3 | Explored in Research | In-depth strategic briefing on frontier models and scaling limits in RES-018. | **Level 3** | None |
| **Structured Outputs** | Level 2 | Implemented & Tested | Pydantic v2 schemas and JSON validation in PRJ-005 (`test_schemas.py` passing). | **Level 2** | `PRJ-005` (Foundation) |
| **Function Calling** | Level 3 | Explored in Research | Tool execution schemas and agentic protocol specifications in research. | **Level 3** | None |
| **Tokenization** | Level 3 | Explored in Research | Token arithmetic and context window constraints analyzed in RES-018 and writing. | **Level 3** | None |
| **Fine-tuning** | Level 3 | Explored in Research | PEFT, LoRA economics, and domain adaptation analysis in RES-018. | **Level 3** | None |
| **LangChain** | Level 4 | Conceptual Familiarity | Framework concepts understood; no dedicated implementation in public repos. | **Level 4** | None |
| **LangGraph** | Level 4 | Conceptual Familiarity | Stateful agent graph concepts understood; no repository code implemented. | **Level 4** | None |
| **LlamaIndex** | Level 4 | Conceptual Familiarity | RAG indexing concepts understood; PRJ-005 uses custom FastAPI/Pydantic stack. | **Level 4** | None |
| **Semantic Search** | Level 3 | Explored in Research | Dense retrieval mechanics analyzed in RES-018 and architected in PRJ-005. | **Level 3** | None |
| **Hybrid Search** | Level 2 | **Documented / Planned** | Reciprocal Rank Fusion (dense + BM25) specified in PRJ-005 architecture. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **Reranking** | Level 2 | **Documented / Planned** | Cross-encoder scoring stage specified in PRJ-005 architecture; not yet coded. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **AI Agents** | Level 3 | Explored in Research | Published essay ('The Agentic Inflection Point') and strategic briefings. | **Level 3** | None |
| **Tool Calling** | Level 3 | Explored in Research | Agent interaction schemas and execution patterns in research. | **Level 3** | None |
| **Agent Workflows** | Level 3 | Explored in Research | Multi-agent orchestration and task decomposition analyzed in research. | **Level 3** | None |
| **Model Context Protocol (MCP)** | Level 2 | **Documented / Planned** | Integration plan specified in PRJ-005; MCP server not yet implemented. | **Level 2** | `PRJ-005` *(Planned Arch)* |
| **AWS / Azure / Google Cloud** | Level 3 | Practised in Coursework | Cloud infrastructure fundamentals, IAM, and compute evaluation in syllabus. | **Level 3** | None |
| **CI/CD** | Level 1 | Demonstrated in Production | Automated GitHub-triggered deployment pipelines on Vercel and Cloudflare Pages. | **Level 1** | `PRJ-004` |
| **Model Monitoring** | Level 4 | Conceptual Familiarity | Concept understood; no production model monitoring telemetry deployed. | **Level 4** | None |
| **LLM Observability** | Level 4 | Conceptual Familiarity | Concept understood; no tracing harness (e.g. Langfuse, Arize) deployed. | **Level 4** | None |
| **Model Deployment** | Level 3 | Practised in Coursework | FastAPI serving concepts and local endpoint hosting in PRJ-005. | **Level 3** | `PRJ-005` (Local API) |
| **LoRA / QLoRA** | Level 3 | Explored in Research | Parameter-efficient fine-tuning analyzed in depth in RES-018 research report. | **Level 3** | None |
| **Kubernetes** | Level 4 | Conceptual Familiarity | Container orchestration concepts understood; no cluster deployed. | **Level 4** | None |

### D. Proposed Technology Section Presentation
To maintain visual calm while providing complete transparency:
1. **Header Subtitle**:
   *“55 engineering disciplines, frameworks, and tools across published systems, active architecture, and structured technical research.”*
2. **Project Link Boundaries**:
   - Only attach clickable signal-lime project pips (`PRJ-004`, `PRJ-005`) to items that have **active, working, or foundation repository code** (e.g., Python, FastAPI, Git, REST APIs, CI/CD, Structured Outputs).
   - Planned architecture components (e.g., Vector Databases, Embeddings, Docker, MCP) are represented in the group lists without misleading "live project" pips until their code is merged.
3. **Understated Legend**: Add a clean, single-line monospace legend beneath the section:  
   `[PRJ-004 / PRJ-005] Active Project Evidence · Curriculum & Empirical Research · Conceptual & Exploring`

---

## 5. Revised Stage B Implementation Plan

### Tier 1: Safe Local File Changes (Executed immediately upon Stage B approval)
- **Portrait Asset**: Copy approved `goutam-prusty-editorial-restrained.webp` to `public/images/portrait/goutam-prusty.webp` (preserving the original in a safe archive `public/images/portrait/original/goutam-prusty-raw.webp`).
- **Technologies Data**: Update [`src/data/technologies.ts`](file:///d:/goutamprusty-v2/src/data/technologies.ts) with verified project associations and the revised subtitle.
- **Technologies UI**: Update [`src/components/TechnologiesTools.astro`](file:///d:/goutamprusty-v2/src/components/TechnologiesTools.astro) with the subtle evidence legend.
- **Case Study Draft**: Update [`docs/drafts/command-center-case-study.md`](file:///d:/goutamprusty-v2/docs/drafts/command-center-case-study.md) with approved wording.

### Tier 2: Sanity CMS Updates (Explicit approval required)
- **Target Record**: `project-PRJ-004` on dataset `development` (Project ID `l94q5yx8`).
- **Fields to Mutate**:
  - `role`: *"Project conception, learning workflow specification, prompt direction, code integration, and local functional validation."*
  - `aiAttribution`: Updated paragraph accurately describing AI assistance without self-deprecation.
  - `body`: Update Block 2 text to match the refined case study draft.
- **Execution Method**: Synchronous Node.js script using `@sanity/client` targeting the `development` dataset only. Zero token printing.

### Tier 3: Production Release (Separate user approval required)
- Merge `codex/visual-experience-upgrade` into `main` after local inspection.
- Cloudflare Pages static build triggered automatically on production.

---

## 6. Verification Steps & Rollback Plan

### Verification Checks
1. Run `astro check` (must remain 0 errors, 0 warnings).
2. Run `astro build` (all 60 static routes must build cleanly).
3. Inspect `http://localhost:4321/` in browser:
   - Check portrait skin tone across desktop and mobile.
   - Verify `/projects/ai-engineer-command-center/` displays the approved AI disclosure.
   - Verify `/` Technologies section displays the updated subtitle and legend.

### Rollback Plan
- **Portrait**: Original `goutam-prusty.webp` is preserved and can be restored with a single file copy command.
- **Code**: `git checkout -- .` instantly reverts any uncommitted local file modifications.
- **CMS**: Previous draft payload in `docs/drafts/command-center-case-study.md` preserves the historical Sanity document state.

---

## 7. Explicit Approval Checklist

Before proceeding to Stage B implementation, please confirm your approval on the following four decisions:

- [ ] **1. Portrait Selection**: Approve Candidate 2 (`goutam-prusty-editorial-restrained.webp`) as the primary portrait.
- [ ] **2. PRJ-004 Disclosure Copy**: Approve the revised wording for `role`, `aiAttribution`, and case study `body`.
- [ ] **3. Technology Pips & Subtitle**: Approve the strict implementation criteria and refined subtitle/legend.
- [ ] **4. Sanity CMS Write Authorization**: Authorize updating record `project-PRJ-004` on the `development` dataset with the approved copy.
