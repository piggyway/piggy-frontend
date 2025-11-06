export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-6xl font-semibold text-primary-navy">
            Piggy Way Crossing
          </h1>
          <p className="text-xl text-slate-900">
            Design System Configuration Complete
          </p>
        </div>

        {/* Color Palette Showcase */}
        <section className="mb-16">
          <h2 className="mb-8 text-4xl font-semibold text-primary-navy">
            Color Palette
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">Primary</h3>
              <div className="space-y-2">
                <div className="flex h-16 items-center rounded-lg bg-primary-navy px-4 text-primary-gold">
                  <span className="font-medium">Navy</span>
                </div>
                <div className="flex h-16 items-center rounded-lg bg-primary-purple px-4 text-slate-900">
                  <span className="font-medium">Purple</span>
                </div>
                <div className="flex h-16 items-center rounded-lg bg-primary-gold px-4 text-primary-navy">
                  <span className="font-medium">Gold</span>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">Secondary</h3>
              <div className="space-y-2">
                <div className="flex h-16 items-center rounded-lg bg-secondary-mint px-4 text-slate-900">
                  <span className="font-medium">Mint</span>
                </div>
                <div className="flex h-16 items-center rounded-lg bg-secondary-pink px-4 text-slate-900">
                  <span className="font-medium">Pink</span>
                </div>
                <div className="flex h-16 items-center rounded-lg bg-secondary-blue px-4 text-slate-900">
                  <span className="font-medium">Blue</span>
                </div>
              </div>
            </div>

            {/* Neutral Colors */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">Neutral</h3>
              <div className="space-y-2">
                <div className="flex h-16 items-center rounded-lg border border-neutral-stroke bg-neutral-background px-4 text-slate-900">
                  <span className="font-medium">Background</span>
                </div>
                <div className="flex h-16 items-center rounded-lg border border-neutral-stroke bg-neutral-background-light px-4 text-slate-900">
                  <span className="font-medium">Background Light</span>
                </div>
                <div className="flex h-16 items-center rounded-lg border border-neutral-stroke bg-neutral-white px-4 text-slate-900">
                  <span className="font-medium">White</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Showcase */}
        <section className="mb-16">
          <h2 className="mb-8 text-4xl font-semibold text-primary-navy">
            Typography (Outfit)
          </h2>
          <div className="space-y-4">
            <h1 className="text-6xl font-semibold text-slate-900">Heading 1</h1>
            <h2 className="text-5xl font-semibold text-slate-900">Heading 2</h2>
            <h4 className="text-4xl font-semibold text-slate-900">Heading 4</h4>
            <p className="text-2xl font-semibold text-slate-900">Lead Text</p>
            <p className="text-xl font-medium text-slate-900">UI Text</p>
            <p className="text-base text-slate-900">
              Body text - Regular weight for comfortable reading
            </p>
            <p className="text-sm text-slate-400">Subtle text - Small and muted</p>
          </div>
        </section>

        {/* Shadcn UI Colors */}
        <section>
          <h2 className="mb-8 text-4xl font-semibold text-primary-navy">
            Shadcn UI Colors (Mapped)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-primary p-6 text-primary-foreground">
              <div className="font-medium">Primary</div>
              <div className="text-sm opacity-90">Navy Blue</div>
            </div>
            <div className="rounded-lg bg-secondary p-6 text-secondary-foreground">
              <div className="font-medium">Secondary</div>
              <div className="text-sm opacity-90">Mint Green</div>
            </div>
            <div className="rounded-lg bg-accent p-6 text-accent-foreground">
              <div className="font-medium">Accent</div>
              <div className="text-sm opacity-90">Purple</div>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground">
              <div className="font-medium">Card</div>
              <div className="text-sm opacity-90">Light Cream</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
