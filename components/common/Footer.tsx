import Image from "next/image";
import Link from "next/link";
import {
  footerLinks,
  socialMediaLinks,
  paymentMethods,
} from "@/lib/types/navigation";

export function Footer() {
  return (
    <footer className="w-full">
      {/* Main Footer Section */}
      <div className="bg-primary-navy rounded-t-[32px] px-[140px] py-14">
        <div className="flex flex-col gap-14">
          {/* Logo and Slogan */}
          <div className="flex items-center gap-10">
            <div className="relative h-[82px] w-[160px] shrink-0">
              <Image
                src="/footer-logo.png"
                alt="Piggy Way Crossing"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 items-center justify-end gap-5">
              <p className="text-primary-gold text-right text-2xl leading-8 font-semibold">
                Tiny feet, big comfort.
              </p>
              <div className="relative h-[26px] w-[45px] shrink-0">
                <Image
                  src="/baba.svg"
                  alt="Piggy icon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex gap-10">
            {footerLinks.map((group, index) => (
              <div key={index} className="flex w-40 flex-col gap-3">
                {group.title && (
                  <h3 className="text-2xl leading-8 font-semibold text-white">
                    {group.title}
                  </h3>
                )}
                {!group.title && <div className="h-8" />}
                <div className="flex flex-col gap-0">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="hover:text-primary-gold text-base leading-6 font-normal text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Terms & Privacy Links */}
            <div className="flex w-40 flex-col gap-3">
              <div className="h-8" /> {/* Spacer for alignment */}
              <div className="flex flex-col gap-0">
                <Link
                  href="/terms"
                  className="hover:text-primary-gold text-base leading-6 font-normal text-white transition-colors"
                >
                  Terms & conditions
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-primary-gold text-base leading-6 font-normal text-white transition-colors"
                >
                  Privacy policy
                </Link>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex w-40 flex-col gap-3">
              <h3 className="text-2xl leading-8 font-semibold text-white">
                Follow us
              </h3>
              <div className="flex gap-3.5">
                {socialMediaLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="relative h-5 w-5 transition-opacity hover:opacity-70"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      fill
                      className="object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-secondary-purple-light px-[140px] py-5">
        <div className="flex flex-col items-center gap-3">
          <p className="text-primary-navy text-center text-base leading-6 font-normal">
            Payments
          </p>
          <div className="flex items-center gap-10">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="relative h-7 w-7 shrink-0"
                aria-label={method.name}
              >
                <Image
                  src={method.icon}
                  alt={method.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-primary-gold px-[140px] py-3.5">
        <div className="text-primary-navy flex items-center justify-between gap-10 text-sm leading-5 font-normal">
          <p>Piggyway Crossing© 2025</p>
          <div className="flex gap-10">
            <Link href="/terms" className="transition-colors hover:underline">
              Terms & conditions
            </Link>
            <Link href="/privacy" className="transition-colors hover:underline">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
