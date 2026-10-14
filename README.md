# Henode

A buyer-facing e-commerce app — browse products, manage a cart, and check out. Built with Expo (React Native + TypeScript), Android-first.

This first build uses **local mock data** (no backend) and a **stubbed payment flow** (full UI, simulated success/failure — no real Paystack calls). See [the project plan](../.claude/plans) for the full scope and rationale.

## Requirements

- Node.js 18+
- The [Expo Go](https://expo.dev/go) app on an Android phone, **or** an Android emulator (Android Studio)

## Run it

```bash
npm install
npm run android
```

- With a physical device: scan the QR code shown in the terminal using the Expo Go app.
- With an emulator: start it first (Android Studio > Device Manager), then run `npm run android` — Expo will detect and launch into it automatically.

## What to try

1. **Onboarding → Sign in** — "Get started" walks through phone + OTP (any 6 digits work) or the Google/Apple buttons; "Browse without an account" skips straight in as a guest.
2. **Browse** — category chips and the product grid on Home; tap the search bar to get to Search, try the Filters sheet (price/rating/delivery/pay-in-4).
3. **Product detail** — pick a colour, adjust quantity, Add to cart (watch the Cart tab badge update).
4. **Cart → Checkout** — edit quantities, try coupon codes `WELCOME10`, `SAVE5K`, or `HENODE20`, pick/add an address, choose a delivery speed.
5. **Payment** — pick a method and pay. In a dev build there's a "Force failure" toggle in the payment sheet to see the decline screen; otherwise payments always succeed after a short simulated delay.
6. **Order tracking / history** — a successful payment lands on the tracking timeline; the Account tab lists all orders (All/Active/Delivered), including a few seeded historical orders (delivered, pay-in-4 in progress, refunded) so every card state is visible without placing 4 orders.

## Notes for a future backend swap

All data access goes through `src/data/repositories/*` (`productRepository`, `addressRepository` seed, `orderRepository` seed, `authRepository`, `paymentRepository`). These currently read local arrays and simulate network delay — replacing one with a real backend (e.g. Supabase) means writing a new implementation behind the same interface and swapping the import; screens and stores never touch mock data directly.
