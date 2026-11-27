/**
 * Portfolio Technical Landscape — Technologies & Tools
 *
 * Presents all 55 technologies and domains across 6 categories without
 * proficiency claims, progress-tracker framing, or personal/training details.
 */

/**
 * Portfolio Technical Landscape — Technologies & Tools
 *
 * Presents all 55 technologies and domains across 6 categories without
 * proficiency claims, progress-tracker framing, or personal/training details.
 */

export interface TechnologyItem {
  name: string;
  projectSlug?: string;
  projectCode?: string;
}

export interface TechnologyGroup {
  id: string;
  number: string;
  title: string;
  focus: string;
  symbol: string;
  items: (string | TechnologyItem)[];
}

export interface TechnologiesSectionData {
  eyebrow: string;
  title: string;
  groups: TechnologyGroup[];
}

export const verifiedTechnologies: TechnologiesSectionData = {
  eyebrow: 'Technical Landscape',
  title: 'Technologies & Tools',
  groups: [
    {
      id: 'core-ai',
      number: '01',
      title: 'Core AI & Engineering Systems',
      focus: 'Foundational runtime, core languages & API infrastructure',
      symbol: '⊕',
      items: [
        { name: 'Python', projectSlug: 'ai-engineer-command-center', projectCode: 'PRJ-004' },
        'SQL',
        'Machine Learning Fundamentals',
        'Data Preprocessing',
        'Model Training and Evaluation',
        'LLM APIs',
        'Prompt Engineering',
        { name: 'Embeddings', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
        { name: 'Retrieval-Augmented Generation (RAG)', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
        { name: 'Vector Databases', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
        { name: 'FastAPI', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
        'REST APIs',
        { name: 'Git and GitHub', projectSlug: 'ai-engineer-command-center', projectCode: 'PRJ-004' },
        'AI/LLM Evaluation',
        { name: 'Docker', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
        'Cloud Deployment',
      ],
    },
    {
      id: 'programming-data',
      number: '02',
      title: 'Programming and data',
      focus: 'Data structures, tabular modeling & systems fundamentals',
      symbol: '⟨/⟩',
      items: [
        'Object-Oriented Programming',
        'Data Structures and Algorithms',
        'NumPy',
        'Pandas',
        'Linux',
        'Debugging',
        'Software Testing',
        'PostgreSQL',
      ],
    },
    {
      id: 'ml-nlp',
      number: '03',
      title: 'Machine learning and NLP',
      focus: 'Statistical learning, deep learning & language models',
      symbol: '⊚',
      items: [
        'Scikit-learn',
        'Supervised Learning',
        'Unsupervised Learning',
        'Neural Networks',
        'PyTorch',
        'TensorFlow',
        'Natural Language Processing',
        'Transformers',
        'Hugging Face',
      ],
    },
    {
      id: 'gen-ai',
      number: '04',
      title: 'Generative AI and application development',
      focus: 'LLM orchestrators, structured output & application design',
      symbol: '◈',
      items: [
        'Large Language Models',
        'Structured Outputs',
        'Function Calling',
        'Tokenization',
        'Fine-tuning',
        'LangChain',
        'LangGraph',
        'LlamaIndex',
      ],
    },
    {
      id: 'rag-agents',
      number: '05',
      title: 'RAG and agentic systems',
      focus: 'Context retrieval, search ranking & tool-calling protocols',
      symbol: '◬',
      items: [
        'Semantic Search',
        'Hybrid Search',
        'Reranking',
        'AI Agents',
        'Tool Calling',
        'Agent Workflows',
        { name: 'Model Context Protocol (MCP)', projectSlug: 'grounded-technical-docs-rag-assistant', projectCode: 'PRJ-005' },
      ],
    },
    {
      id: 'deployment-prod',
      number: '06',
      title: 'Deployment and production engineering',
      focus: 'CI/CD, observability, evaluation & container orchestration',
      symbol: '⊞',
      items: [
        'AWS / Azure / Google Cloud',
        'CI/CD',
        'Model Monitoring',
        'LLM Observability',
        'Model Deployment',
        'LoRA / QLoRA',
        'Kubernetes',
      ],
    },
  ],
};
