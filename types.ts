
export enum View {
  ONBOARDING = 'onboarding',
  DASHBOARD = 'dashboard',
  IDEAS = 'ideas',
  CALENDAR = 'calendar',
  EDITOR = 'editor'
}

export interface ContentIdea {
  id: string;
  type: 'Reels' | 'Carousel' | 'Story' | 'Static' | 'Promo';
  title: string;
  hook?: string;
  description?: string;
  structure?: string[];
  cta?: string;
  caption?: string;
  callToAction?: string;
  image?: string;
  isEdited?: boolean;
  isFavorite?: boolean;
  isUsed?: boolean;
  createdAt?: string;
  bestTime?: string; // Sugestão de melhor dia/hora para postar
}

export interface ScheduledContent {
  id: string;
  title: string;
  type: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X';
  date: string;
  status: 'Planejado' | 'Pendente' | 'Rascunho' | 'Publicado';
}
