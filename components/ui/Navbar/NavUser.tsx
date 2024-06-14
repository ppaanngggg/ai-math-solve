'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';

interface NavUserProp {
  user?: any;
}

export default function NavUser({ user }: NavUserProp) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <>
      {user ? (
        <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
          <input type="hidden" name="pathName" value={usePathname()} />
          <button type="submit">Sign out</button>
        </form>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </>
  );
}
