/**
 * Portfolio Technical Landscape — Technologies & Tools
 *
 * Presents all 55 technologies and domains across 6 categories without
 * proficiency claims, progress-tracker framing, or personal/training details.
 */

export interface TechnologyGroup {
  title: string;
  items: string[];
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
      title: 'Core AI & Engineering Systems',
      items: [
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
    },
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
