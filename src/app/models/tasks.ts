export class Task {
    id: number = 0;
    title: string = '';
    description: string = '';
    priority: 'Low' | 'Medium' | 'Urgent' = 'Low'; // Präzisiere den Typ
    created_at: Date = new Date(); 
    status: 'TO_DO' | 'AWAIT_FEEDBACK' | 'IN_PROGRESS' | 'DONE' = 'TO_DO'; // Präzisiere den Typ
    project_lead: number | null = null; // Erlaubt null-Werte
    created_by: number = 0;
    assigned_to: number | null = null; // Erlaubt null-Werte
}