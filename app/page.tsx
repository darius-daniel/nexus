"use client";

import Link from "next/link";
import {
  Briefcase,
  Users,
  MagnifyingGlass,
  Lightning,
  ShieldCheck,
  Globe,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TypingText } from "@/components/animate-ui/primitives/texts/typing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className=" sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container min-w-full flex h-16 items-center px-8">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Briefcase className="size-6" />
              <span className="font-bold">Nexus</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/jobs"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Jobs
              </Link>
              <Link
                href="/companies"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Companies
              </Link>
              <Link
                href="/about"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search placeholder */}
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </nav>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center bg-[url('/assets/images/christina-wocintechchat-com-m-eF7HN40WbAQ-unsplash.jpg')] bg-cover bg-center bg-no-repeat">
          <div className="container">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 text-muted p-16 rounded-2xl">
                <TypingText
                  text="Connect with your next opportunity"
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                />
                <p className="mx-auto max-w-[700px] md:text-xl">
                  The modern job board for seekers and employers. Find your
                  dream job or post openings today.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/jobs">Find Jobs</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/register?role=employer">Post a Job</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why choose Nexus?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Built for both job seekers and employers with modern tools and
                  a clean experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <MagnifyingGlass className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Search</h3>
                <p className="text-muted-foreground">
                  Find relevant jobs with powerful filtering and search
                  capabilities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Applications</h3>
                <p className="text-muted-foreground">
                  Apply to jobs in minutes with your profile and uploaded CV.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lightning className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast Hiring</h3>
                <p className="text-muted-foreground">
                  For employers: Post jobs, review applications, and hire
                  quickly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Built with modern security practices and reliable
                  infrastructure.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Remote & Onsite</h3>
                <p className="text-muted-foreground">
                  Find opportunities that fit your lifestyle, remote or onsite.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">All Industries</h3>
                <p className="text-muted-foreground">
                  From tech to design, finance to healthcare — we&apos;ve got
                  you covered.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center bg-[url('/assets/images/kanhaiya-sharma-T_l246EK19I-unsplash.jpg')] bg-no-repeat bg-cover bg-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to get started?
                </h2>
                <p className="max-w-[600px] text-secondary md:text-xl">
                  Join thousands of job seekers and employers already using
                  Nexus.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/register">Create an account</Link>
                </Button>
                <p className="text-xs text-secondary">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-2">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container min-w-full px-8 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js, Prisma, and Tailwind. © 2026 Nexus. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/about" className="hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/terms" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
