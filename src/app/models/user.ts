export interface User {
    token: string;
    username: string;
    first_name: string;
    last_name: string;
    // Weitere nützliche Eigenschaften
  }


  export interface GuestUser {
    id: null;
    username: string;
    
  }