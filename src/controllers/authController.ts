import { ensureSupabaseClient } from '../lib/supabase'
import type { LoginData } from '../models/authModel'

const ADMIN_STORAGE_KEY = 'escapade_admin_user'

export interface AdminUser {
  id: string
  user_name: string
  loggedInAt: number
}

// In-memory fallback if localStorage is disabled or restricted
let inMemoryAdmin: AdminUser | null = null

export const loginUser = async ({ user_name, password }: LoginData): Promise<AdminUser> => {
  const username = user_name.trim()
  const supabase = ensureSupabaseClient()

  // 1. Try exact username match first
  let { data: admin, error } = await supabase
    .from('admin')
    .select('id, user_name, password')
    .eq('user_name', username)
    .maybeSingle()

  // 2. If no exact match and no error, try case-insensitive match
  if (!admin && !error) {
    const ilikeResult = await supabase
      .from('admin')
      .select('id, user_name, password')
      .ilike('user_name', username)
      .maybeSingle()

    if (ilikeResult.data) {
      admin = ilikeResult.data
    } else if (ilikeResult.error) {
      console.warn('Case-insensitive admin lookup error:', ilikeResult.error)
    }
  }

  console.log('ADMIN:', admin)
  console.log('ERROR:', error)

  if (error) {
    console.error('Supabase login error:', error)
    throw new Error(error.message || 'Unable to access admin table.')
  }

  if (!admin) {
    throw new Error('Username not found.')
  }

  if (admin.password !== password) {
    throw new Error('Incorrect password.')
  }

  const user: AdminUser = {
    id: String(admin.id ?? 'admin'),
    user_name: String(admin.user_name ?? username),
    loggedInAt: Date.now(),
  }

  inMemoryAdmin = user

  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user))
  } catch (storageError) {
    console.warn('Could not write admin session to localStorage, using in-memory session:', storageError)
  }

  return user
}

export const getStoredAdmin = (): AdminUser | null => {
  if (inMemoryAdmin) {
    return inMemoryAdmin
  }

  try {
    const item = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (!item) return null
    const parsed = JSON.parse(item)
    if (parsed && (parsed.user_name || parsed.id !== undefined)) {
      const user: AdminUser = {
        id: String(parsed.id ?? 'admin'),
        user_name: String(parsed.user_name ?? 'Admin'),
        loggedInAt: Number(parsed.loggedInAt || Date.now()),
      }
      inMemoryAdmin = user
      return user
    }
    return null
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return getStoredAdmin() !== null
}

export const logoutUser = () => {
  inMemoryAdmin = null
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY)
  } catch (storageError) {
    console.error('Failed to remove admin session:', storageError)
  }
}