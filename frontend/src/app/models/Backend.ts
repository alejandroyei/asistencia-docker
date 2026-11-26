export interface ApiUser {
  user_id: number;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  user_password?: string;
  user_microsoft_id?: string;
  user_auth_provider?: string;
  user_job_title?: string;
  user_department?: string;
  user_office_location?: string;
  user_mobile_phone?: string;
  user_business_phones?: string;
  user_permissions?: unknown;
  user_role_id: number;
  user_program_id: number;
  user_status_id: number;
  user_created_at: string;
  Programs?: ProgramModel;
}

export interface ProgramModel {
  id: number;
  name: string;
}

export interface PromotionModel {
  id_promotion: number;
  name_promotion: string;
  id_programs: number;
  status_promotions: number;
  Programs?: ProgramModel;
}

export interface SubjectModel {
  id: number;
  name: string;
  status: number;
}

export interface RoleModel {
  id_role: number;
  name_role: string;
}

export interface RegistrationModel {
  id: number;
  users: number;
  groups: number;
  status: number;
}

export interface ProgramSubjectModel {
  id: number;
  id_programs: number;
  id_subjects: number;
  programs?: ProgramModel;
  subjects?: SubjectModel;
  status: number;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface CreateUserResponse {
  message: string;
  userId: number;
}
