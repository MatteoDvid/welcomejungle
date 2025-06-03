import { memo } from 'react'
import { Profile } from '@/lib/sheets'
import { translate } from '@/lib/i18n'

/**
 * Card displaying a host's profile for cross-office stays.
 * @param {Profile} host
 * @param {() => void} onRequest
 */
export const HostingCard = memo(function HostingCard({
  host,
  onRequest,
}: {
  host: Profile
  onRequest: () => void
}) {
  return (
    <div className="rounded-xl border bg-white/10 p-4 flex flex-col gap-2 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏡</span>
        <div>
          <div className="font-bold text-lg">{host.name} <span className="text-xs text-jungle-accent">({host.city})</span></div>
          <div className="text-sm text-jungle-textLight/70">{host.hostingDetails}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {host.interests.map(i => (
          <span key={i} className="px-2 py-1 bg-jungle-accent/20 rounded text-xs">{i}</span>
        ))}
      </div>
      <div className="text-xs text-jungle-green">{translate('matches.availableDates')}: {host.hostingDates?.join(', ')}</div>
      <button
        className="mt-2 px-4 py-2 bg-jungle-accent text-jungle-textDark rounded hover:bg-jungle-accent/90 transition"
        onClick={onRequest}
        aria-label={translate('matches.requestToStay') + ' ' + host.name}
      >
        {translate('matches.requestToStay')}
      </button>
    </div>
  )
}) 