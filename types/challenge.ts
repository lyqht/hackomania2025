export interface ChallengeMetadata {
  judges?: string[];
  teamQuota?: number;
  references?: string[];
  [key: string]: unknown;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  metadata: ChallengeMetadata | null;
  createdAt: string;
  updatedAt: string;
}
