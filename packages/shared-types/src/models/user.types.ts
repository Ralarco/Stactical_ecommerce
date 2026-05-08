import type { UserRole, CustomerType } from '../enums';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  customerType: CustomerType;
  organizationId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/** B2B-ready organization entity */
export type Organization = {
  id: string;
  name: string;
  rut: string | null;
  contactEmail: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
