import {createClient, SupabaseClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SUPABASE_URL, SUPABASE_ANON_KEY} from '../config/supabase';

let supabase: SupabaseClient | null = null;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] 환경변수(SUPABASE_URL, SUPABASE_ANON_KEY)가 설정되지 않았습니다.',
  );
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: AsyncStorage,
    },
  });
}

export {supabase};

