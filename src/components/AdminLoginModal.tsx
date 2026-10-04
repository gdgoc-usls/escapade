import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../controllers/authController'

interface AdminLoginModalProps {
  onClose: () => void
}

const AdminLoginModal = ({ onClose }: AdminLoginModalProps) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!username.trim() || !password) {
      setError('Please enter your username and password.')
      return
    }

    try {
      setLoading(true)
      setError('')

      await loginUser({
        user_name: username,
        password,
      })

      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Login failed:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to login.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#010206]/85 p-4 sm:px-6 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#11151C]/95 p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-4 text-2xl text-gray-500 transition hover:text-white"
          aria-label="Close login"
        >
          ×
        </button>

        <div className="mb-6 sm:mb-7">
          <h2 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-white">
            Admin Login
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Sign in to access the dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block font-['Michroma'] text-xs tracking-wider text-gray-300">
              Username
            </label>

            <input
              type="text"
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full rounded-md border border-white/10 bg-[#181D25]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-white/30 focus:bg-[#1D232D]/80 focus:ring-1 focus:ring-white/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block font-['Michroma'] text-xs tracking-wider text-gray-300">
              Password
            </label>

            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-md border border-white/10 bg-[#181D25]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-white/30 focus:bg-[#1D232D]/80 focus:ring-1 focus:ring-white/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#FDFDFB] px-5 py-3 font-['Space_Grotesk'] text-sm font-semibold text-[#010206] transition hover:bg-[#FFFDEE] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginModal