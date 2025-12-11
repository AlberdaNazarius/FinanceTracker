import axios from "axios";
import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {User} from "@/types/user";

const getUser = async () => {
  const response = await axios.get("/api/user");
  return response.data;
}

const getUserRequest = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: {user: authUser},
    } = await supabase.auth.getUser();

    if (!authUser) {
      return null;
    }

    const {data: profile} = await supabase
      .from("user")
      .select(`
        username,
        balance,
        preferred_currency:preferred_currency_id (*)
      `)
      .eq("id", authUser.id)
      .single();

    const userProfile: User = {
      username: profile?.username,
      balance: profile?.balance,
      preferred_currency: Array.isArray(profile?.preferred_currency)
        ? profile!.preferred_currency[0]
        : profile!.preferred_currency!
    }

    return userProfile ?? null;
  } catch (error) {
    console.log("Error fetching user:", error);
    return Promise.reject();
  }
}

export const UserService = {
  getUser,
  getUserRequest
}