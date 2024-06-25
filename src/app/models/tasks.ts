export class Task {
    id: number = 0;
    title: string = '';
    description: string = '';
    priority: 'Low' | 'Medium' | 'Urgent' = 'Low';
    created_at: Date = new Date();
    status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE' = 'TO_DO';
    project_lead: number | null = null;
    created_by: number = 0;
    assigned_to: { id: number; first_name: string; last_name: string }[] = []; // Korrekte Typisierung
  }