export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_premium: boolean;
  premium_start: string | null;
  premium_until: string | null;
  createdAt: string;
  updatedAt: string;
}
