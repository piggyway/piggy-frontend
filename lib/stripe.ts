import { loadStripe } from '@stripe/stripe-js';

// 确保你的 .env.local 文件中有这个变量
// 注意：在 Next.js 中，只有以 NEXT_PUBLIC_ 开头的环境变量才能在前端（浏览器端）访问
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.warn(
    'Stripe Publishable Key is missing. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file.'
  );
}

// 使用单例模式导出 stripePromise，避免多次初始化
export const stripePromise = loadStripe(publishableKey || '');


