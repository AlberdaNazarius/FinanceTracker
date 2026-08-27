import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {User} from "@/types/user";
import {toUser} from "@/helpers/user-mapper";
import {isDynamicServerError} from "next/dist/client/components/hooks-server-context";

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
        dashboard_settings,
        preferredCurrency:preferred_currency_id (*)
      `)
      .eq("id", authUser.id)
      .single();

    return toUser(profile);
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.log("Error fetching user:", error);
    return Promise.reject();
  }
}

export const UserServerService = {
  getUserRequest,
}