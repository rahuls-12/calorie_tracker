import { GoalsForm } from "@/components/settings/goals-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <GoalsForm />
    </div>
  )
}
