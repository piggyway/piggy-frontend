import { NextResponse } from "next/server";
import Stripe from "stripe";

// 初始化 Stripe 实例
// 注意：STRIPE_SECRET_KEY 必须在服务端使用，不要暴露给前端
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia", // 使用最新的 API 版本，或者你可以去掉这行使用默认版本
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email,
      fullName,
      phone,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
    } = body as Record<string, string>;

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required to start checkout." } },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "测试商品 - 豚鼠笼子",
              description: "这是一个用于测试 Stripe 支付功能的虚拟商品",
              images: [
                "https://images.unsplash.com/photo-1548767797-d8c844163c65?q=80&w=1000&auto=format&fit=crop",
              ],
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      billing_address_collection: "auto",
      metadata: {
        customer_name: fullName || "",
        customer_phone: phone || "",
        address_line1: address1 || "",
        address_line2: address2 || "",
        address_city: city || "",
        address_state: state || "",
        address_postal_code: postalCode || "",
        address_country: country || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/canceled`,
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: { message: err.message } },
      { status: 500 }
    );
  }
}
