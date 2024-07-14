export interface Customer {
  id: string;
  name: string;
  phone: string;
  currentDebt: number;
  totalSales: number;
  totalSalesMinusReturns: number;
  birthdate?: Date;
  CreatedDate?: Date;
  group?: string;
  gender?: string;
  taxCode?: string;
  email?: string;
  facebook?: string;
  address?: string;
  city?: string;
  ward?: string;
  createdBy?: string;
  createdDate?: string;
  customerType?: string;
  notes?: string;
}
