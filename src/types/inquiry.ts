export type InquiryStatus = "new" | "contacted" | "in_progress" | "converted" | "archived";

export type UserRole = "admin" | "manager" | "staff";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  submittedAt: string;
  assignedTo?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
}
