import type { CrewWithEscapeTime } from '../models/crewModel'

interface DeleteConfirmModalProps {
  crew: CrewWithEscapeTime | null
  onClose: () => void
  onConfirm: () => Promise<void>
}

const DeleteConfirmModal = ({
  crew,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!crew) {
    return null
  }

  const handleDelete = async () => {
    await onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010206]/80 p-4 sm:px-6 backdrop-blur-md">

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#11151C]/90 p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">

        <div className="mb-5 sm:mb-6">
          <h2 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-[#FDFDFB]">
            Delete Crew
          </h2>

          <p className="mt-2 text-xs sm:text-sm leading-6 text-gray-400 break-words">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-[#FDFDFB]">
              {crew.crew_name}
            </span>
            ?
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            This will also delete the crew's escape time from the leaderboard.
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-2.5 sm:gap-3">

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-white/10 bg-[#181D25]/50 px-4 py-2.5 sm:px-5 sm:py-3 font-['Space_Grotesk'] text-sm text-gray-300 transition hover:border-white/20 hover:bg-[#1D232D]/80 hover:text-[#FDFDFB]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-full rounded-md bg-red-500 px-4 py-2.5 sm:px-5 sm:py-3 font-['Space_Grotesk'] text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.99]"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal