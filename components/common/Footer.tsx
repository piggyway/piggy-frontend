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
      <div className="bg-primary-navy rounded-t-[32px] px-4 py-8 sm:px-8 sm:py-10 lg:px-[140px] lg:py-14">
        <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
          {/* Logo and Slogan */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-10">
            <div className="relative h-16 w-32 shrink-0 sm:h-20 sm:w-40 lg:h-[82px] lg:w-[160px]">
              <Image
                src="/footer-logo.png"
                alt="Piggy Way Crossing"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-5">
              <p className="text-primary-gold text-p text-center font-semibold sm:text-right">
                Tiny feet, big comfort.
              </p>
              <div className="relative h-6 w-10 shrink-0 sm:h-[26px] sm:w-[45px]">
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
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:flex lg:gap-10">
            {footerLinks.map((group, index) => (
              <div key={index} className="flex flex-col gap-2 sm:gap-3 lg:w-40">
                {group.title && (
                  <h3 className="text-p-ui font-semibold text-white">
                    {group.title}
                  </h3>
                )}
                {!group.title && <div className="h-6 sm:h-8" />}
                <div className="flex flex-col gap-0">
                  {group.links.map((link, linkIndex) => (
                    <Link
                      key={`${group.title}-${link.label}-${linkIndex}`}
                      href={link.href}
                      className="hover:text-primary-gold text-p font-normal text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Terms & Privacy Links */}
            <div className="flex flex-col gap-2 sm:gap-3 lg:w-40">
              <h3 className="text-p-ui font-semibold text-white">Policies</h3>
              <div className="flex flex-col gap-0">
                <Link
                  href="/terms"
                  className="hover:text-primary-gold text-p font-normal text-white transition-colors"
                >
                  Terms & conditions
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-primary-gold text-p font-normal text-white transition-colors"
                >
                  Privacy policy
                </Link>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-2 sm:gap-3 lg:w-40">
              <h3 className="text-p-ui font-semibold text-white">Follow us</h3>
              <div className="flex gap-3 sm:gap-3.5">
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
      <div className="bg-secondary-purple-light px-4 py-4 sm:px-8 sm:py-5 lg:px-[140px]">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <p className="text-primary-navy text-p text-center font-normal">
            Payments
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-10">
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
      <div className="bg-primary-gold px-4 py-3 sm:px-8 sm:py-3.5 lg:px-[140px]">
        <div className="text-primary-navy text-p flex flex-col items-center justify-center gap-2 font-normal sm:flex-row sm:gap-4 lg:gap-10">
          <p>Piggyway Crossing© 2026</p>
          {/* <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-10">
            <Link href="/terms" className="transition-colors hover:underline">
              Terms & conditions
            </Link>
            <Link href="/privacy" className="transition-colors hover:underline">
              Privacy policy
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
