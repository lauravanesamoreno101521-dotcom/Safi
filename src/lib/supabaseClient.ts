import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto solo debería verse si falta el archivo .env.local (en desarrollo)
  // o las variables de entorno en Vercel (en producción).
  console.error(
    'Faltan las variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. ' +
    'Revisa tu archivo .env.local (local) o la configuración de variables de entorno en Vercel (producción).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
