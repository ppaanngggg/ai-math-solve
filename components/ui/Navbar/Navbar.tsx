import { createClient } from '@/utils/supabase/server';
import NavUser from './NavUser';
import Image from 'next/image';
import Link from 'next/link';

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav>
      <div className="navbar h-16 shadow-xl border-base-300">
        <div className="navbar-start">
          <Link href="/" aria-label="Logo">
            <Image
              src="/favicon.ico"
              alt="logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </Link>
          <nav className="ml-6 space-x-2">
            <Link href="/pricing">Pricing</Link>
            {user && <Link href="/account">Account</Link>}
          </nav>
        </div>
        <div className="navbar-end mr-6">
          <NavUser user={user} />
        </div>
      </div>
    </nav>
  );
}
