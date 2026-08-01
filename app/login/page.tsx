import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"


export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 self-center font-bold">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Nexus.
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
