export class Task {
    id: number = 0;
    title: string = '';
    description: string = '';
    priority: 'Low' | 'Medium' | 'Urgent' = 'Low'; // Präzisiere den Typ
    created_at: Date = new Date(); 
    status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE' = 'TO_DO'; // Präzisiere den Typ
    // project_lead: number = 0; 
}