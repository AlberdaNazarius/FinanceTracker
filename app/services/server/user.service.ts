import {cookies} from "next/headers";
import {createClient} from "@/helpers/supabase/server";
import {User} from "@/types/user";
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
        preferredCurrency:preferred_currency_id (*)
      `)
      .eq("id", authUser.id)
      .single();

    const userProfile: User = {
      username: profile?.username,
      preferredCurrency: Array.isArray(profile?.preferredCurrency)
        ? profile!.preferredCurrency[0]
        : profile!.preferredCurrency!
    }

    return userProfile ?? null;
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