'use client'

import { TrendUpIcon } from "@phosphor-icons/react"
import { BriefcaseIcon, SearchIcon } from "lucide-react"

const features = [
  {
    icon: <BriefcaseIcon size={18} />,
    title: "Top Companies",
    description: "Access Opportunities from leading employers."
  },
  {
    icon: <SearchIcon size={18} />,
    title: "Smart Search",
    description: "Find jobs that match your skills and goals."
  },
  {
    icon: <TrendUpIcon size={18} />,
    title: "Career Growth",
    description: "Build your future with better opportunities."
  }
]

export default function AuthBanner() {
  return (
    <section className="relative hidden bg-muted bg-[url(/assets/images/auth-banner.png)] bg-cover bg-no-repeat bg-center md:flex flex-col gap-6 justify-end px-8 py-4 text-white">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold max-w-2/3">
          Find Your Next Career Opportunity
        </h2>
        <p className="text-base font-medium leading-tight max-w-2/3">
          Discover thousands of jobs from trusted employers worldwide.
        </p>
      </div>

      <div className="flex gap-2">
        {features.map((entry, idx) => (
          <article key={idx} className="flex flex-col gap-1 w-1/3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              {entry.icon}
            </span>

            <div className="flex flex-col gap-0.5 leading-tight">
              <h3 className="font-bold">{entry.title}</h3>
              <p>{entry.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}