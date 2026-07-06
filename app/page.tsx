import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/sign-in")
  }

  return (
    <main className="p-8">
      <h1>Welcome, {session.user.name} 🎉</h1>
      <p>You are successfully signed in.</p>
    </main>
  )
}
