export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  created_at: Date;
  status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE';
  project_lead: number | null;
  created_by: User;
  assigned_to: User[];
  category: {  
    id: number;
    name: string;
    color: string;
  }; 
  due_date: Date | null;
  subtasks: Subtask[];
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  color: string;  
}
