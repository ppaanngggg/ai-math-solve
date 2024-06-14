import CustomerPortalForm from '@/app/account/CustomerPortalForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .order('current_period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold">Account</h1>
      <h2></h2>
      <div className="divider" />
      {subscription && <CustomerPortalForm subscription={subscription} />}
    </div>
  );
}
