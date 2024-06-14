import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes
} from '@/utils/auth-helpers/settings';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import SignUp from '@/components/ui/AuthForms/Signup';
import clsx from 'clsx';

export default async function SignIn({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { disable_button: boolean };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView =
      cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div
      className={clsx(
        'card p-6 shadow-2xl',
        viewProp === 'signup'
          ? 'bg-neutral text-neutral-content'
          : 'bg-base-100 text-base-content'
      )}
    >
      <h1 className="card-title">
        {viewProp === 'forgot_password'
          ? 'Reset Password'
          : viewProp === 'update_password'
            ? 'Update Password'
            : viewProp === 'signup'
              ? 'Sign Up'
              : 'Sign In'}
      </h1>
      {viewProp === 'password_signin' && (
        <PasswordSignIn
          allowEmail={allowEmail}
          redirectMethod={redirectMethod}
        />
      )}
      {viewProp === 'email_signin' && (
        <EmailSignIn
          allowPassword={allowPassword}
          redirectMethod={redirectMethod}
          disableButton={searchParams.disable_button}
        />
      )}
      {viewProp === 'forgot_password' && (
        <ForgotPassword
          allowEmail={allowEmail}
          redirectMethod={redirectMethod}
          disableButton={searchParams.disable_button}
        />
      )}
      {viewProp === 'update_password' && (
        <UpdatePassword redirectMethod={redirectMethod} />
      )}
      {viewProp === 'signup' && (
        <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
      )}
      {viewProp !== 'update_password' &&
        viewProp !== 'signup' &&
        allowOauth && (
          <>
            {/*<div className="divider" />*/}
            {/*<OauthSignIn />*/}
          </>
        )}
    </div>
  );
}
