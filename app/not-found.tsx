import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-neutral-background-light">
        <div className="container mx-auto max-w-[1160px] px-4 py-16 sm:py-20">
          <div className="flex flex-col items-start gap-10">
            <h1 className="text-primary-navy-light text-h4 sm:text-h1 leading-none font-semibold tracking-[-0.768px] sm:leading-[64px]">
              Oops!
            </h1>
            <div className="flex w-full items-end justify-end gap-4 pt-16 sm:gap-10 sm:pt-[120px]">
              <p className="text-primary-navy-light sm:text-large text-xl leading-7 font-semibold sm:leading-10">
                Guinea pig ate the page...
              </p>
              <div className="relative h-[54px] w-[107px] shrink-0 sm:h-[107px] sm:w-[214px]">
                <Image
                  src="/Group 367.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-16 sm:pt-20">
            <Button
              asChild
              variant="secondary"
              className="h-10 gap-2 px-4 text-sm font-normal"
            >
              <Link href="/">
                Go to Homepage
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
