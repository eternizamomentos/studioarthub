export type GUTScore = {
    g: number; // Gravidade
    u: number; // Urgência
    t: number; // Tendência
  };
  
  export type TaskItem = {
    id: string;
    title: string;
    owner: string;
    due: string; // ISO date string
    gut: GUTScore;
  };
  
  export type TaskColumn = {
    title: string;
    color: string;
    items: TaskItem[];
  };
  
  export type BoardState = TaskColumn[];  