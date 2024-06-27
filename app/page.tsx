import { createClient } from '@/utils/supabase/server';
import Conversation from '@/app/Conversation';
import Homepage from '@/app/Homepage';

export const maxDuration = 60;

export default async function MainPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .order('current_period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <>
      {user != null && subscription != null ? (
        <Conversation />
      ) : (
        <Homepage user={user} />
      )}
    </>
  );
}
