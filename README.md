# Pizza Config

A full-stack pizza ordering application featuring a custom pizza builder, real-time kitchen updates, live order tracking, and browser push notifications. Inspired by my time working in a kitchen, and built specifically with this case study in mind.

Includes a kitchen-side "admin" app, intended to be displayed on a large touch screen inside the kitchen for use by the cooks to directly send updates to the customer app.

<img width="2419" height="2480" alt="App collage" src="https://github.com/user-attachments/assets/cbaf974c-3201-4ad9-a64a-3838f175aa0e" />

## Demo

### Pizza visualiser

Custom pizza configurator and visualiser. The kitchen that I worked at offered fully custom pizzas, and this aims to provide a visual idea of the pizza to the customer, as well as giving them the "pizza chef" experience. Assets are custom-made svgs, but could be refined for more detail/specific styles.

https://github.com/user-attachments/assets/42ead087-4fb6-4027-a9a5-c05fda23d297

### Realtime order tracking

Realtime subscription to the backend for both kitchen and customer-facing applications means that the customers receive immediate updates concerning the status of their pizza, hopefully reducing occurances of customer going to the bar to enquire about the status of their order.

https://github.com/user-attachments/assets/c8ebe918-f8b1-4100-9bf9-d99371a60043

### Push notification on order status change

As long as the browser is open, the customer will receive notifications whenever the pizza status changes. In the future, I'd love to include iOS and android specific push notification, also.

https://github.com/user-attachments/assets/2021c45e-e2c7-4191-ba07-1f451b9db99f

### Mobile-first development with animated side menus

https://github.com/user-attachments/assets/f77f5529-c410-4f6d-b1e1-44b5f3a1c08c

---

## Tech stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- CSS Modules

### Backend / Infrastructure
- Supabase (Auth, Database, Realtime)
- Supabase Edge Functions
- Express (Push Notification Server)
- Web Push API
- Service Workers
- Trigger functions and RLS policies

### Testing
- Vitest
- React Testing Library
- Coverage reporting

## Architecture Summary

Customer App
→ Supabase (orders table)
→ Kitchen Dashboard
→ Push Server (Express)
→ Web Push
→ Service Worker
→ Browser Notification

Push notifications are user-specific and tied to authenticated users.

---

## Running locally

Start supabase
```bash
npm install
```
```bash
npm run dev
```
```bash
node server.js
```

## Running tests

Run tests:
```bash
npm run test
```

Run tests and generate coverage:
```bash
npm run test:coverage
```
