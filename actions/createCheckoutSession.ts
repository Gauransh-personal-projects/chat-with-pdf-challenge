"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseURL from "@/lib/getBaseURL";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
  //create stripe checkout session

  const { userId } = await auth();
  // auth().protect()

  if (!userId) {
    throw new Error("User not found");
  }

  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    await adminDb.collection("users").doc(userId).set({
      stripeCustomerId: customer.id,
    });

    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [
      {
        price: "price_1Pgrz0BTDQn4k1xySpBX8tAg",
        quantity: 1,
      },
    ],
    success_url: `${getBaseURL()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseURL()}/upgrade`,
  });

  return session.id;
}
