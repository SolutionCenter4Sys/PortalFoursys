export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      plans: {
        Row: {
          created_at: string;
          id: string;
          monthly_minutes: number | null;
          name: string;
          price_cents: number;
          stripe_price_id: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          monthly_minutes?: number | null;
          name: string;
          price_cents?: number;
          stripe_price_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          monthly_minutes?: number | null;
          name?: string;
          price_cents?: number;
          stripe_price_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          locale: string;
          onboarding_completed: boolean;
          prefs: Json;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          locale?: string;
          onboarding_completed?: boolean;
          prefs?: Json;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          locale?: string;
          onboarding_completed?: boolean;
          prefs?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          created_at: string;
          duration_seconds: number | null;
          ended_at: string | null;
          id: string;
          plan_id: string | null;
          started_at: string;
          user_id: string;
          voice_mode: string;
        };
        Insert: {
          created_at?: string;
          duration_seconds?: number | null;
          ended_at?: string | null;
          id?: string;
          plan_id?: string | null;
          started_at?: string;
          user_id: string;
          voice_mode?: string;
        };
        Update: {
          created_at?: string;
          duration_seconds?: number | null;
          ended_at?: string | null;
          id?: string;
          plan_id?: string | null;
          started_at?: string;
          user_id?: string;
          voice_mode?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          plan_id: string;
          status: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan_id?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan_id?: string;
          status?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      transcripts: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          role: string;
          session_id: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          role: string;
          session_id: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
          session_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_memories: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          kind: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          kind?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      message_feedback: {
        Row: {
          assistant_answer: string | null;
          created_at: string;
          id: string;
          rating: number;
          session_id: string | null;
          user_id: string;
          user_question: string | null;
        };
        Insert: {
          assistant_answer?: string | null;
          created_at?: string;
          id?: string;
          rating: number;
          session_id?: string | null;
          user_id: string;
          user_question?: string | null;
        };
        Update: {
          assistant_answer?: string | null;
          created_at?: string;
          id?: string;
          rating?: number;
          session_id?: string | null;
          user_id?: string;
          user_question?: string | null;
        };
        Relationships: [];
      };
      usage_logs: {
        Row: {
          created_at: string;
          id: string;
          minutes_used: number;
          period_month: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          minutes_used?: number;
          period_month: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          minutes_used?: number;
          period_month?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
