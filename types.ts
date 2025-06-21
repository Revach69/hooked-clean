export interface UserData {
  id?: string;
  full_name?: string;
  bio?: string;
  interests?: string[];
  height?: string;
  profile_color?: string;
  profile_photo_url?: string;
  age?: number;
  gender_identity?: string;
  interested_in?: string;
}

export interface EventProfileData {
  id?: string;
  event_id?: string;
  session_id?: string;
  profile_photo_url?: string;
  first_name?: string;
  age?: number;
  gender_identity?: string;
  interested_in?: string;
  profile_color?: string;
  bio?: string;
}

export interface EventData {
  id: string;
  name?: string;
  code?: string;
  location?: string;
  description?: string;
  organizer_email?: string;
  starts_at?: string;
  expires_at?: string;
}
