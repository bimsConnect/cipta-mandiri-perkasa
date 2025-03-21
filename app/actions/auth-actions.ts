"use server"

import { login, logout } from "@/lib/auth"

export async function loginAction(email: string, password: string) {
  return await login(email, password)
}

export async function logoutAction() {
  return await logout()
}

