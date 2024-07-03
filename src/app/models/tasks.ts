export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  created_at: Date;
  status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE';
  project_lead: number | null;
  created_by: { id: number; username: string; first_name: string; last_name: string };
  assigned_to: assigned_to[];
}

interface assigned_to {
  first_name: string;
  last_name:string;
  email:string;
  id:number
  // username: string;
}
