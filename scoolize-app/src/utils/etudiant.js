import { supabase } from '../supabaseClient';

export const getLocalUser = () => {
  const raw = localStorage.getItem('scoolize_user');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const getEtudiantFromLocal = async () => {
  const user = getLocalUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('etudiants')
    .select('*')
    .eq('email', user.email)
    .single();

  if (error) return null;
  return data;
};


