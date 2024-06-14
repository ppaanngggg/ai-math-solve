import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Conversation from '@/app/Conversation';

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
        <>
          <h1 className="text-5xl font-extrabold">AI Math Solver 🥳</h1>
          <Link href={user != null ? '/pricing' : '/signin/signup'}>
            <button className="m-6 btn btn-neutral ">{'Get Start !'}</button>
          </Link>
        </>
      )}
    </>
  );
}
