export class Contact {
    id: number;
    first_name: string;
    last_name: string;
    number: string;
    email: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : 0;
        this.first_name = obj ? obj.first_name : '';
        this.last_name = obj ? obj.last_name : ''
        this.number = obj ? obj.number : '';
        this.email = obj ? obj.email : '';
    }
}