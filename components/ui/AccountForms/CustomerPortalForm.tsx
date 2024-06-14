'use client';

import Button from '@/components/ui/Button';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createStripePortal } from '@/utils/stripe/server';
import { Tables } from '@/types_db';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: subscription.prices?.currency!,
    minimumFractionDigits: 0
  }).format((subscription.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <div className="card card-bordered bg-base-100 shadow-xl w-96 max-w-full m-2">
      <div className="card-body">
        <h2 className="card-title">Your Plan</h2>
        <p>
          You are currently on the <b>{subscription.prices?.products?.name}</b>{' '}
          plan.
        </p>
        <p className="font-semibold my-2">{`${subscriptionPrice}/${subscription.prices?.interval}`}</p>
        <div className="card-actions justify-end">
          <Button
            variant="slim"
            onClick={handleStripePortalRequest}
            loading={isSubmitting}
          >
            Open customer portal
          </Button>
        </div>
      </div>
    </div>
  );
}
