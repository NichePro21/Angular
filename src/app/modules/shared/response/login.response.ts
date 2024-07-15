export interface LoginResponse {
  message: string;
  data: {
    token: string;
    email: string;
    id: number;
    username: string;
    address: any[];
    roles: {
      id: number;
      name: string;
    }[];
  };
  code: number;
}
