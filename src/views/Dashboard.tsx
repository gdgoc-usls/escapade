import { useEffect, useMemo, useState } from 'react'
import CrewModal from '../components/CrewModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { Navbar } from '../views/Navbar'
import { useLandingController } from '../controllers/useLandingController'
import { Footer } from '../views/Footer'
import {
  addCrew,
  deleteCrew,
  getCrews,
  updateCrew,
} from '../controllers/crewController'
import type { CrewWithEscapeTime } from '../models/crewModel'
import dashboardBg from '../assets/dashboard_bg.png'
import { useNavigate } from 'react-router-dom'
import {
  getStoredAdmin,
  isAuthenticated,
  logoutUser,
} from '../controllers/authController'


const Dashboard = () => {
  const controller = useLandingController()
  const navigate = useNavigate()
  const [adminUser] = useState(() => getStoredAdmin())
  const [crews, setCrews] = useState<CrewWithEscapeTime[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [editingCrew, setEditingCrew] =
    useState<CrewWithEscapeTime | null>(null)

  const [crewToDelete, setCrewToDelete] =
    useState<CrewWithEscapeTime | null>(null)

  const loadCrews = async () => {
    try {
      setError('')

      const data = await getCrews()
      setCrews(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin', { replace: true })
      return
    }
    loadCrews()
  }, [navigate])

  const handleLogout = () => {
    logoutUser()
    navigate('/admin', { replace: true })
  }

  const filteredCrews = useMemo(() => {
    return crews.filter((crew) =>
      crew.crew_name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [crews, search])

  const leaderboard = useMemo(() => {
    return [...crews]
      .filter((crew) => crew.escape_time !== null)
      .sort(
        (a, b) =>
          (a.escape_time ?? Infinity) -
          (b.escape_time ?? Infinity)
      )
      .slice(0, 5)
  }, [crews])

  const handleSave = async (
    crewName: string,
    escapeTime: number
  ) => {
    try {
      if (editingCrew) {
        await updateCrew(
          editingCrew.id,
          crewName,
          escapeTime
        )
      } else {
        await addCrew(crewName, escapeTime)
      }

      await loadCrews()

      setModalOpen(false)
      setEditingCrew(null)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to save crew.'
      )
    }
  }

  const handleDelete = async () => {
    if (!crewToDelete) {
      return
    }

    try {
      setError('')

      await deleteCrew(crewToDelete.id)

      setCrewToDelete(null)

      await loadCrews()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete crew.'
      )
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  const formatEscapeTime = (totalMilliseconds: number | null) => {
    if (totalMilliseconds === null) {
      return '—'
    }

    const minutes = Math.floor(totalMilliseconds / 60000)

    const seconds = Math.floor(
      (totalMilliseconds % 60000) / 1000
    )

    const milliseconds = Math.floor(
      (totalMilliseconds % 1000) / 10
    )

    return `${minutes}m ${String(seconds).padStart(2, '0')}s ${String(milliseconds).padStart(2, '0')}ms`
  }

  const [sortField, setSortField] = useState<
    'crew_name' | 'created_at' | 'escape_time'
  >('created_at')

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (
    field: 'crew_name' | 'created_at' | 'escape_time'
  ) => {
    if (sortField === field) {
      setSortDirection((current) =>
        current === 'asc' ? 'desc' : 'asc'
      )
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedCrews = useMemo(() => {
    return [...filteredCrews].sort((a, b) => {
      let comparison = 0

      if (sortField === 'crew_name') {
        comparison = a.crew_name.localeCompare(b.crew_name)
      }

      if (sortField === 'created_at') {
        comparison =
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      }

      if (sortField === 'escape_time') {
        const aTime = a.escape_time ?? Infinity
        const bTime = b.escape_time ?? Infinity

        comparison = aTime - bTime
      }

      return sortDirection === 'asc'
        ? comparison
        : -comparison
    })
  }, [filteredCrews, sortField, sortDirection])


    

  return (
    <div
        className="relative min-h-screen bg-cover bg-center bg-fixed text-white flex flex-col"
        style={{ backgroundImage: `url(${dashboardBg})` }}
    >
    <div className="absolute inset-0 bg-black/90" />
    <div className="relative z-10 flex min-h-screen flex-col">
    <main className="flex-1">
        <Navbar
            navSections={controller.navSections}
            activeSection="home"
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            onCloseMobileMenu={() => setMobileMenuOpen(false)}
            dashboard
            onLogout={handleLogout}
        />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-8">

        {/* Admin Header & Logout Bar */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="font-['Orbitron'] text-xl sm:text-2xl font-bold tracking-wide text-white">
              Admin Dashboard
            </h1>
            <p className="mt-0.5 font-['Space_Grotesk'] text-xs sm:text-sm text-gray-400">
              Signed in as <span className="font-semibold text-[#FDFDFB]">{adminUser?.user_name || 'Admin'}</span>
            </p>
          </div>
          {/* <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 font-['Michroma'] text-xs tracking-wider text-red-400 transition hover:bg-red-500/20 hover:text-white"
          >
            LOGOUT
          </button> */}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
{/* crew count */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-xl">
            <p className="font-['Michroma'] text-xs tracking-wider text-gray-400">
              TOTAL CREWS
            </p>

            <p className="mt-2 sm:mt-3 font-['Orbitron'] text-3xl sm:text-4xl font-bold">
              {crews.length}
            </p>
          </div>
{/* top 1 */}
          <div className="rounded-xl border border-white/15 bg-[#11151C]/70 p-5 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:col-span-2">
            <p className="font-['Michroma'] text-xs tracking-wider text-gray-400">
              TOP 1
            </p>

            {leaderboard.length > 0 ? (
              <div className="mt-2 sm:mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-[#FDFDFB] truncate">
                    {leaderboard[0].crew_name}
                  </h2>

                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-400">
                    Fastest escape time
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <p className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-[#FDFDFB]">
                    {formatEscapeTime(leaderboard[0].escape_time)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 sm:mt-3 text-sm text-gray-500">
                No escape times recorded.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">

{/* crew controls */}
            <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="font-['Orbitron'] text-base sm:text-lg font-bold">
                    Current Crews
                    </h2>

                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-400 sm:text-gray-500">
                    Manage registered crews.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-2.5 sm:gap-3 sm:w-auto">
                    <div className="relative flex-1 sm:w-[260px] md:w-[320px] lg:w-[380px]">
                    <input
                        type="text"
                        placeholder="Search crew..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#FDFDFB]"
                    />
                    </div>

                    <button
                    type="button"
                    onClick={() => {
                        setEditingCrew(null)
                        setModalOpen(true)
                    }}
                    className="flex items-center justify-center gap-1.5 shrink-0 rounded-md bg-[#FDFDFB] px-4 py-2 sm:px-5 sm:py-2.5 font-['Space_Grotesk'] text-sm font-semibold text-[#010206] transition hover:bg-[#FFFDEE] active:scale-[0.99]"
                    >
                    <span className="text-base leading-none font-bold">+</span>
                    <span>Add Crew</span>
                    </button>
                </div>
            </div>

            {/* Mobile Sort Controls */}
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#11151C]/60 p-2.5 md:hidden">
              <span className="font-['Michroma'] text-[11px] uppercase tracking-wider text-gray-400">
                Sort by:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { key: 'crew_name', label: 'Crew' },
                    { key: 'created_at', label: 'Created' },
                    { key: 'escape_time', label: 'Time' },
                  ] as const
                ).map((sortOption) => {
                  const isActive = sortField === sortOption.key
                  return (
                    <button
                      key={sortOption.key}
                      type="button"
                      onClick={() => handleSort(sortOption.key)}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs transition ${
                        isActive
                          ? 'bg-[#FDFDFB] text-[#010206] font-semibold'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {sortOption.label}
                      {isActive && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mobile Cards List */}
            <div className="space-y-3 md:hidden">
              {loading ? (
                <div className="rounded-xl border border-white/10 bg-[#11151C]/70 p-8 text-center text-sm text-gray-500">
                  Loading crews...
                </div>
              ) : filteredCrews.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-[#11151C]/70 p-8 text-center text-sm text-gray-500">
                  No crews found.
                </div>
              ) : (
                sortedCrews.map((crew) => (
                  <div
                    key={crew.id}
                    className="rounded-xl border border-white/10 bg-[#11151C]/70 p-4 shadow-sm backdrop-blur-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#FDFDFB] truncate">
                          {crew.crew_name}
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatDate(crew.created_at)}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {crew.escape_time !== null ? (
                          <div className="inline-flex items-center rounded-md border border-white/10 bg-[#181D25]/70 px-2.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <span className="font-['Orbitron'] text-xs font-bold tracking-wide text-[#FDFDFB]">
                              {formatEscapeTime(crew.escape_time)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCrew(crew)
                          setModalOpen(true)
                        }}
                        className="flex-1 rounded-md border border-white/10 bg-white/5 py-2 text-center text-xs font-medium text-gray-300 transition hover:border-white/30 hover:bg-white/10 hover:text-[#FDFDFB]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setCrewToDelete(crew)}
                        className="flex-1 rounded-md border border-red-500/20 bg-red-500/10 py-2 text-center text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-[#11151C]/70">

              <div className="max-h-[calc(115vh-480px)] overflow-auto">
                <table className="w-full min-w-[700px] text-left">

                  <thead className="sticky top-0 z-10 border-b border-white/10 bg-[#11151C]">
                    <tr>
                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleSort('crew_name')}
                          className="font-['Michroma'] text-xs tracking-wider text-gray-500 transition hover:text-[#FDFDFB]"
                        >
                          CREW
                          {sortField === 'crew_name' && (
                            <span className="ml-2">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>

                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleSort('created_at')}
                          className="font-['Michroma'] text-xs tracking-wider text-gray-500 transition hover:text-[#FDFDFB]"
                        >
                          CREATED
                          {sortField === 'created_at' && (
                            <span className="ml-2">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>

                      <th className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleSort('escape_time')}
                          className="font-['Michroma'] text-xs tracking-wider text-gray-500 transition hover:text-[#FDFDFB]"
                        >
                          ESCAPE TIME
                          {sortField === 'escape_time' && (
                            <span className="ml-2">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>

                      <th className="px-5 py-4 text-right font-['Michroma'] text-xs tracking-wider text-gray-500">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-sm text-gray-500"
                        >
                          Loading crews...
                        </td>
                      </tr>
                    ) : filteredCrews.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-10 text-center text-sm text-gray-500"
                        >
                          No crews found.
                        </td>
                      </tr>
                    ) : (
                      sortedCrews.map((crew) => (
                        <tr
                          key={crew.id}
                          className="border-b border-white/5 transition hover:bg-white/[0.03]"
                        >
                          <td className="px-5 py-4">
                            <span className="font-['Space_Grotesk'] font-medium">
                              {crew.crew_name}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-400">
                            {formatDate(crew.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            {crew.escape_time !== null ? (
                              <div className="inline-flex items-center rounded-md border border-white/10 bg-[#181D25]/70 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                <span className="font-['Orbitron'] text-xs font-bold tracking-wide text-[#FDFDFB]">
                                  {formatEscapeTime(crew.escape_time)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() => {
                                  setEditingCrew(crew)
                                  setModalOpen(true)
                                }}
                                className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:border-white/30 hover:text-[#FDFDFB]"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  setCrewToDelete(crew)
                                }
                                className="rounded-md border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                              >
                                Delete
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </section>

{/* leaderboard section */}
          <section>
            <div className="mb-4 sm:mb-5">
              <h2 className="font-['Orbitron'] text-base sm:text-lg font-bold">
                Leaderboard
              </h2>

              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-400 sm:text-gray-500">
                Fastest escape times.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3">

              {leaderboard.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-gray-500">
                  No leaderboard records.
                </div>
              ) : (
                leaderboard.map((crew, index) => (
                  <div
                    key={crew.id}
                    className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3.5 sm:p-4 backdrop-blur-xl ${
                      index === 0
                        ? 'border-white/15 bg-[#11151C]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full font-['Orbitron'] text-xs sm:text-sm font-bold ${
                      index === 0
                        ? 'bg-[#FDFDFB] text-[#010206]'
                        : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-['Space_Grotesk'] text-sm sm:text-base font-semibold">
                        {crew.crew_name}
                      </p>

                      <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500">
                        Rank #{index + 1}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-md border border-white/10 bg-[#181D25]/70 px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <p className="font-['Orbitron'] text-[11px] sm:text-xs font-bold tracking-wide text-[#FDFDFB]">
                        {formatEscapeTime(crew.escape_time)}
                      </p>
                    </div>
                  </div>
                ))
              )}

            </div>
          </section>

        </div>
      </div>

      {modalOpen && (
        <CrewModal
          crew={editingCrew}
          onClose={() => {
            setModalOpen(false)
            setEditingCrew(null)
          }}
          onSave={handleSave}
        />
      )}

      {crewToDelete && (
        <DeleteConfirmModal
          crew={crewToDelete}
          onClose={() => setCrewToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    
    </main>
    <Footer />
    </div>
    </div>
  )
}

export default Dashboard