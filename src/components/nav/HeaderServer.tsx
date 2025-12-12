
import { MainNav } from "@/components/layout/MainNav";
import { supabaseServer } from "@/lib/supabaseServer";

export async function HeaderServer() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <MainNav isAuthed={!!user} />;
}
