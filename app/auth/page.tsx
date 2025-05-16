import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Simple Calorie Tracker</h1>
        <AuthForm />
      </div>
    </div>
  )
} 