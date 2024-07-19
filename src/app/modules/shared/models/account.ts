import { Role } from "./role";

export interface Account {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string;
  roles: Role[];
  addresses: any[];
}
