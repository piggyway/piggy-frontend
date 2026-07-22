## 一、最核心的几件事（必须做）

### 1. 用 SSR/SSG 输出可抓取的 HTML 内容

电商网站最重要的是：**商品页 / 分类页 / 内容页面要有真实 HTML，不要全靠 CSR**。

在 Next.js（App Router）里：

- 商品详情页：`app/products/[slug]/page.tsx`
- 分类列表页：`app/category/[slug]/page.tsx`

代码层面：

```tsx
// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const products = await fetch("https://api.example.com/products").then((r) =>
    r.json()
  );
  return products.map((p: any) => ({ slug: p.slug }));
}

// 或者改用 generateMetadata，见下一节

export default async function ProductPage({ params }: Props) {
  const product = await fetch(
    `https://api.example.com/products/${params.slug}`,
    {
      cache: "force-cache", // SSG / ISR 场景
    }
  ).then((r) => r.json());

  if (!product) return notFound();

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* 其它详情 */}
    </main>
  );
}
```

要点：

- 商品页/分类页用 **`fetch` + SSG/SSR** 输出完整 HTML。
- 搜索结果页、购物车、结算页可以容忍部分 CSR。

---

### 2. 正确设置 `<title>`、`<meta>` 等基础 SEO 信息

在 App Router 里推荐用 **`generateMetadata`**：

```tsx
// app/products/[slug]/page.tsx
import type { Metadata } from "next";

type Props = { params: { slug: string } };

async function getProduct(slug: string) {
  const res = await fetch(`https://api.example.com/products/${slug}`, {
    cache: "force-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) {
    return {
      title: "Product not found | Piggyway",
      robots: { index: false, follow: false },
    };
  }

  const url = `https://www.example.com/products/${product.slug}`;

  return {
    title: `${product.name} | Piggyway`,
    description: product.seo_description ?? product.short_description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name,
      description: product.seo_description ?? product.short_description,
      url,
      type: "product",
      images: product.images?.map((img: any) => ({
        url: img.url,
        alt: product.name,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.seo_description ?? product.short_description,
      images: product.images?.[0]?.url,
    },
  };
}
```

关键点：

- `title`：包含品牌 + 关键词（商品名、类目）。
- `description`：用商品简介 / SEO 字段，不要留空。
- `alternates.canonical`：防重复内容（比如带 query 参数的 URL）。
- `openGraph` / `twitter`：影响分享卡片 + 部分 SEO 信号。

同理，可以在 `app/layout.tsx` 设置站点级默认 `metadata`，子页面再覆盖。

---

### 3. 使用语义化 HTML + 合理的 Heading 结构

代码层面：

```tsx
export default function ProductPage({ product }: { product: Product }) {
  return (
    <main>
      <article>
        <header>
          <h1>{product.name}</h1>
          <p>{product.short_description}</p>
        </header>

        <section aria-label="Product gallery">
          {/* 用 <img> / <Image> + alt */}
        </section>

        <section aria-label="Product details">
          <h2>Details</h2>
          <p>{product.description}</p>
        </section>

        <section aria-label="Specifications">
          <h2>Specifications</h2>
          {/* ... */}
        </section>
      </article>
    </main>
  );
}
```

注意：

- 一个页面 **只一个 `<h1>`**（通常是商品名/页面主标题）。
- 其它用 `<h2> / <h3>`，不要全是 `<div>`.
- 图片用 `alt` 文本（包含关键词但不要堆砌）。

---

### 4. 为商品和面包屑添加结构化数据（Schema.org JSON-LD）

搜索引擎很看重电商的 **Product schema**、**BreadcrumbList**，可以拿到丰富结果（价格、评分等）。

Next.js App Router 可以这样（注意：必须用原生 `<script>`，不能用 `next/script` 的 `<Script>`。
`<Script>` 默认 afterInteractive，在 hydration 之后才注入，JSON-LD 不会出现在服务端 HTML 里，爬虫看不到）：

```tsx
// app/products/[slug]/page.tsx

export default function ProductPage({ product }: { product: Product }) {
  const url = `https://www.example.com/products/${product.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img: any) => img.url),
    description: product.short_description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Piggyway",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "AUD",
      price: product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.example.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `https://www.example.com/category/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <main>
      {/* 页面内容 */}
      <script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
```

---

### 5. 生成 sitemap.xml 和 robots.txt

Next.js App Router 自带约定式 `sitemap` & `robots`：

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetch("https://api.example.com/products").then((r) =>
    r.json()
  );
  const categories = await fetch("https://api.example.com/categories").then(
    (r) => r.json()
  );

  const staticUrls: MetadataRoute.Sitemap = [
    { url: "https://www.example.com/", lastModified: new Date() },
    { url: "https://www.example.com/about", lastModified: new Date() },
  ];

  const productUrls = products.map((p: any) => ({
    url: `https://www.example.com/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  const categoryUrls = categories.map((c: any) => ({
    url: `https://www.example.com/category/${c.slug}`,
    lastModified: new Date(c.updated_at),
  }));

  return [...staticUrls, ...productUrls, ...categoryUrls];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cart", "/checkout"],
    },
    sitemap: "https://www.example.com/sitemap.xml",
  };
}
```

---

### 6. URL 设计与 Canonical/去重

电商常见问题：同一商品多种 URL（带参数的筛选、排序、tracking 等）。

代码侧对策：

- 商品 URL 简洁：`/products/cotton-liner-xl`
- 分类 URL：`/category/bedding`
- 有 filter/sort/search 的页面：
  - 尽量用 **对 SEO 友好的 query 参数**（`?sort=price_asc` 可以；`?utm_source=` 的页面一般 canonical 到不带 utm 的版本）

- 用 `canonical` 指向主 URL（见前面的 `generateMetadata` 示例）

如果做尺寸/颜色变体：

- 如果每个变体有独立内容/图片，可用独立 URL；
- 如果只是选项，通常一个商品 URL + schema 的 `offers` 里写多种变体即可。

---

## 二、进阶层面：性能 & 体验相关的 SEO

### 7. Core Web Vitals：性能优化

在 Next.js 里，有几个你代码能控制的点：

- 图片：用 `next/image` + 合理的 `sizes` + 正确的 `width/height`
- 组件拆分：用 `dynamic(() => import("./HeavyComponent"), { ssr: false })` 做延迟加载
- 减少阻塞脚本：第三方脚本（如 GA、埋点）用 `next/script` 的 `strategy="afterInteractive" / "lazyOnload"`
- 尽量 CSR 的只留在「不需要 SEO」的页面（购物车、结算），而把商品详情/分类用 SSR/SSG。

示例：

```tsx
import Image from "next/image";

<Image
  src={product.images[0].url}
  alt={product.name}
  width={800}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>;
```

---

### 8. 国际化/多语言（如果你以后做中英双语）

用 Next.js 的 `i18n` 或自己做多语言路径，比如：

- 英文：`/products/cotton-liner-xl`
- 中文：`/zh/products/cotton-liner-xl`

在 `generateMetadata` 里配 `alternates.languages`：

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  const urlEn = `https://www.example.com/products/${product.slug}`;
  const urlZh = `https://www.example.com/zh/products/${product.slug}`;

  return {
    title: product.name,
    alternates: {
      canonical: urlEn,
      languages: {
        en: urlEn,
        zh: urlZh,
      },
    },
  };
}
```

---

### 9. 分类页 / 列表页的分页处理

常见做法：

- URL：`/category/bedding?page=2`
- 第一页最好是没有 `?page=1` 的纯路径。
- 用 `generateMetadata` 里的 `title`、`description` 带上分页信息（避免完全重复）。

```ts
export async function generateMetadata({
  params,
  searchParams,
}: any): Promise<Metadata> {
  const page = Number(searchParams.page ?? 1);
  const category = await getCategory(params.slug);

  const baseTitle = `${category.name} | Piggyway`;
  const title = page > 1 ? `${baseTitle} - Page ${page}` : baseTitle;

  return {
    title,
    description: category.seo_description,
  };
}
```

---

### 10. 对不希望被收录的页面设定 noindex

例如：

- `/cart`
- `/checkout`
- `/orders`
- `/account` 等

可以在对应页面的 `generateMetadata` 里写：

```ts
export const metadata: Metadata = {
  title: "Your Cart | Piggyway",
  robots: {
    index: false,
    follow: false,
  },
};
```

---

## 三、给你一个「电商 SEO Checklist」方便你对照实现

**页面层面**

- [ ] 商品详情页 SSR/SSG 输出完整 HTML
- [ ] 分类/专题页 SSR/SSG
- [ ] 有清晰的 URL 结构和面包屑

**元信息**

- [ ] 每个页面有独立的 `title` & `meta description`
- [ ] 正确设置 canonical URL
- [ ] 配置 OpenGraph、Twitter 卡片

**结构化数据**

- [ ] 商品页有 `Product` JSON-LD
- [ ] 站点有 `BreadcrumbList`
- [ ] 必要时有 `Organization` / `WebSite` schema（在首页或 layout 里写）

**站点级**

- [ ] `sitemap.xml` 自动生成（商品 & 分类 & 静态页）
- [ ] `robots.txt` 配置允许爬取并指明 sitemap
- [ ] 不希望收录的页面加 `noindex`

**性能**

- [ ] 图片统一用 `next/image`
- [ ] 重要内容优先 SSR/SSG，次要功能用 CSR/懒加载
- [ ] 控制第三方脚本的加载时机

---
