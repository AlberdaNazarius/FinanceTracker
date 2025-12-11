import axios from "axios";
import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {User} from "@/types/user";

const getUser = async () => {
  const response = await axios.get("/api/user");
  return response.data;
}

const getUserRequest = async (): Promise<User> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return Promise.reject();
  }

  const { data: profile } = await supabase
    .from("user")
    .select(`
        username,
        balance,
        preferred_currency:preferred_currency_id (*)
      `)
    .eq("id", authUser.id)
    .single();
  
  if (!profile) {
    return Promise.reject();
  }

  return profile;
}

export const UserService = {
  getUser,
  getUserRequest
}