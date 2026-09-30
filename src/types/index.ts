export type RequestType = 'problem' | 'idea';

export type RequestStatus = 
  | 'new'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type Category = 
  | 'Дороги'
  | 'Освещение'
  | 'Мусор'
  | 'Транспорт'
  | 'Благоустройство'
  | 'Экология'
  | 'Водоснабжение'
  | 'Безопасность'
  | 'Другое';

export type Department = 
  | 'ЖКХ'
  | 'Транспорт'
  | 'Благоустройство'
  | 'Экология'
  | 'Городская инфраструктура';

export type District = 
  | 'Центральный'
  | 'Левобережный'
  | 'Затон'
  | 'Восточный'
  | 'Юность';

export interface OfficialFeedbackMessage {
  id: string;
  author: string;
  department: string;
  text: string;
  created_at: string;
}

export interface CityRequest {
  id: string;
  type: RequestType;
  title: string;
  original_text: string;
  cleaned_text: string;
  category: Category;
  subcategory: string;
  department: Department;
  priority: PriorityLevel;
  priority_reason: string;
  status: RequestStatus;
  location_address: string;
  latitude: number;
  longitude: number;
  district?: District;
  photo_before_url?: string;
  photo_after_url?: string;
  video_url?: string;
  resolution_report?: string;
  created_at: string;
  resolved_at?: string;
  upvotes: number;
  similar_to_id?: string;
  
  // Confidential information (visible only to Госслужбы & Администрация сайта)
  author_id?: string;
  author_name?: string;
  author_phone?: string;
  author_email?: string;
  is_anonymous?: boolean;

  // Moderation & Governance (Admin role)
  moderation_status?: 'approved' | 'rejected' | 'flagged_inappropriate';
  moderation_reason?: string;

  // Feedback loop from department to citizen
  official_feedback?: OfficialFeedbackMessage[];
}

export interface AIAnalysisResult {
  title: string;
  cleaned_text: string;
  category: Category;
  subcategory: string;
  department: Department;
  priority: PriorityLevel;
  priority_reason: string;
  detected_duplicates?: Array<{
    id: string;
    title: string;
    distance_meters: number;
  }>;
}

export interface CreateRequestInput {
  type?: RequestType;
  title?: string;
  original_text: string;
  cleaned_text?: string;
  category?: Category;
  subcategory?: string;
  department?: Department;
  priority?: PriorityLevel;
  priority_reason?: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  district?: District;
  photo_before_url?: string;
  video_url?: string;
  author_id?: string;
  author_name?: string;
  author_phone?: string;
  author_email?: string;
  is_anonymous?: boolean;
}

export interface UpdateRequestInput {
  status?: RequestStatus;
  department?: Department;
  priority?: PriorityLevel;
  resolution_report?: string;
  photo_after_url?: string;
  upvotes?: number;
  moderation_status?: 'approved' | 'rejected' | 'flagged_inappropriate';
  moderation_reason?: string;
  add_feedback?: {
    author: string;
    department: string;
    text: string;
  };
}

export interface RequestStats {
  total: number;
  in_progress: number;
  high_priority: number;
  resolved: number;
  total_ideas?: number;
  avg_resolution_days?: number;
  by_category?: Record<string, number>;
  by_district?: Record<string, number>;
}

export type UserRole = 'citizen' | 'employee' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  phone: string;
  district: District;
  isGuest?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link: string;
  type: 'status_change' | 'idea_support' | 'duplicate_merged' | 'system' | 'moderation';
}

export interface DeveloperFeedback {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_role: UserRole;
  topic: string;
  message: string;
  created_at: string;
}
