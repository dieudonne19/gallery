"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { login, type LoginState } from "../actions/auth"
import { PasswordInput } from "./PasswordInput"

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
        />
        {state.error ? (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending} className="h-11 text-base">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  )
}
