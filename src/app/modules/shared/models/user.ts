import { Role } from "./role";
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  is_Verified: boolean;
  role: Role;
}
