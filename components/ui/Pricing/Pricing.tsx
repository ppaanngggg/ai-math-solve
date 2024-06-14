'use client';

import Button from '@/components/ui/Button';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    subscription?.prices?.interval === 'month' ? 'month' : 'year'
  );
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return router.push('/account');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    console.log('No products found');
    redirect('/');
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="max-w-full p-2 text-4xl font-extrabold text-base-content text-center ">
        Pricing Plans
      </h1>
      <div className="divider" />
      <div className="join bg-base-100 shadow-xl">
        {intervals.includes('month') && (
          <button
            onClick={() => setBillingInterval('month')}
            type="button"
            className={clsx(
              billingInterval === 'month' ? 'btn btn-neutral' : 'btn btn-ghost',
              'join-item'
            )}
          >
            Monthly billing
          </button>
        )}
        {intervals.includes('year') && (
          <button
            onClick={() => setBillingInterval('year')}
            type="button"
            className={clsx(
              billingInterval === 'year' ? 'btn btn-neutral' : 'btn btn-ghost',
              'join-item'
            )}
          >
            Yearly billing
          </button>
        )}
      </div>
      <div className="carousel carousel-center max-w-md p-4 space-x-4 rounded-box">
        {products.map((product) => {
          const price = product?.prices?.find(
            (price) => price.interval === billingInterval
          );
          if (!price) return null;
          const priceString = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency!,
            minimumFractionDigits: 0
          }).format((price?.unit_amount || 0) / 100);
          return (
            <div
              key={product.id}
              className={clsx(
                product.name === subscription?.prices?.products?.name
                  ? 'border-2 border-pink-500'
                  : '',
                'mt-4 carousel-item card w-60 bg-base-100'
              )}
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold leading-6 text-base-content">
                  {product.name}
                </h2>
                <div className="mt-4">
                  <p>• Unlimited AI revoke</p>
                </div>
                <p className="mt-10">
                  <span className="text-4xl font-extrabold text-base-content">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-base-content">
                    /{billingInterval}
                  </span>
                </p>
                <Button
                  variant="slim"
                  type="button"
                  loading={priceIdLoading === price.id}
                  onClick={() => handleStripeCheckout(price)}
                  className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                >
                  {subscription ? 'Manage' : 'Subscribe'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
