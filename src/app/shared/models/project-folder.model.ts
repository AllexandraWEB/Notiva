export interface ProjectFolder {
  id: string;
  name: string;
  color: string;
  tag: string;
  createdAt: string;
}

export interface CreateProjectPayload {
  name: string;
  tag: string;
}
