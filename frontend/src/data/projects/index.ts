export interface ProjectMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  tags: string[];
}

export const projects: ProjectMeta[] = [
  {
    id: 'lawbot',
    title: 'Law Bot',
    description: 'Quick access to Jamaican legal information and guidance',
    icon: '⚖️',
    date: 'March 2024',
    tags: ['AI', 'Legal Tech', 'ChatBot', 'NLP'],
  },
  {
    id: 'finance-bot',
    title: 'Finance Bot',
    description: 'AI-powered financial assistance for Jamaican businesses',
    icon: '📊',
    date: 'Ongoing',
    tags: ['AI', 'Finance', 'Business'],
  },
  {
    id: 'patois-speech',
    title: 'Improving Speech to Text for Patois',
    description: 'Advanced speech recognition for Jamaican Patois',
    icon: '🗣️',
    date: 'Ongoing',
    tags: ['AI', 'Speech Recognition', 'NLP', 'Patois'],
  },
  {
    id: 'music-filter',
    title: 'AI Tool for Cleaning up Lewd Jamaican Music',
    description: 'Content filtering and moderation for music platforms',
    icon: '🎵',
    date: 'Research Phase',
    tags: ['AI', 'Audio Processing', 'Content Moderation'],
  },
];

