/**
 * Recruiter-Prioritized AI Engineering Learning Roadmap Data (CommonJS)
 * goutamprusty.com v2 Rebuild — T9 Follow-up
 */

const learningRoadmap = {
  title: 'AI Engineering Learning Roadmap',
  eyebrow: 'Planned Learning · Structured Progression',
  description:
    'A planned, recruiter-prioritized curriculum focused on foundational engineering, machine learning systems, and agentic workflows. These represent active study priorities and planned capabilities, rather than claimed project credentials.',
  corePrioritiesTitle: 'Core AI Engineering learning priorities',
  corePrioritiesDescription:
    'High-recurrence competencies frequently required in fresher and early-intermediate AI Engineering job requirements. Prioritized for depth and hands-on implementation.',
  corePriorities: [
    'Python',
    'SQL',
    'Machine Learning Fundamentals',
    'Data Preprocessing',
    'Model Training and Evaluation',
    'LLM APIs',
    'Prompt Engineering',
    'Embeddings',
    'Retrieval-Augmented Generation (RAG)',
    'Vector Databases',
    'FastAPI',
    'REST APIs',
    'Git and GitHub',
    'AI/LLM Evaluation',
    'Docker',
    'Cloud Deployment',
  ],
  supportingTitle: 'Supporting foundations and advanced learning areas',
  supportingDescription:
    'Underlying software engineering practices, modeling theory, and production tooling organized by domain.',
  supportingSubgroups: [
    {
      title: 'Programming and data',
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
      title: 'Machine learning and NLP',
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
      title: 'Generative AI and application development',
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
      title: 'RAG and agentic systems',
      items: [
        'Semantic Search',
        'Hybrid Search',
        'Reranking',
        'AI Agents',
        'Tool Calling',
        'Agent Workflows',
        'Model Context Protocol (MCP)',
      ],
    },
    {
      title: 'Deployment and production engineering',
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

module.exports = {
  learningRoadmap,
};
