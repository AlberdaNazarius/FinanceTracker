import { createClient } from "@/helpers/supabase/client";

const signup = async (username: string, email: string, password: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }
}

const login = async (email: string, password: string) => {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
}

const logout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export const AuthService = {
  signup,
  login,
  logout
}