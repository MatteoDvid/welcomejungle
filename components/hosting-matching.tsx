"use client"

import { useState } from 'react'
import { SheetsService, Profile } from '@/lib/sheets'
import { findHostMatches } from '@/lib/utils'
import { HostingCard } from '@/components/ui/hosting-card'
import { Loader2 } from 'lucide-react'
import { translate } from '@/lib/i18n'

/**
 * Composant principal pour la recherche d'hébergement cross-office.
 * Permet de saisir une ville et des dates, puis affiche les hôtes compatibles.
 */
export function HostingMatching({ currentUser }: { currentUser: Profile }) {
  const [city, setCity] = useState('')
  const [dates, setDates] = useState<string[]>([])
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [requestedHost, setRequestedHost] = useState<Profile | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setRequestedHost(null)
    const allProfiles = await SheetsService.getAllProfiles()
    const matches = findHostMatches(currentUser, allProfiles, city, dates)
    setResults(matches)
    setLoading(false)
  }

  const handleRequest = (host: Profile) => {
    setRequestedHost(host)
    setSuccess(true)
    // TODO: call Slack notification + log match
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-jungle-accent">{translate('profile.hostingSection')}</h2>
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-6">
        <label className="flex flex-col gap-1">
          {translate('matches.destinationCity')}
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input input-bordered rounded px-3 py-2"
            placeholder={translate('matches.destinationCityPlaceholder')}
            required
            aria-label={translate('matches.destinationCity')}
          />
        </label>
        <label className="flex flex-col gap-1">
          {translate('matches.travelDates')}
          <input
            type="text"
            value={dates.join(', ')}
            onChange={e => setDates(e.target.value.split(',').map(s => s.trim()))}
            className="input input-bordered rounded px-3 py-2"
            placeholder={translate('matches.travelDatesPlaceholder')}
            required
            aria-label={translate('matches.travelDates')}
          />
        </label>
        <button
          type="submit"
          className="bg-jungle-accent text-jungle-textDark rounded px-4 py-2 font-semibold hover:bg-jungle-accent/90 transition"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5 inline-block mr-2" /> : null}
          {translate('matches.findHost')}
        </button>
      </form>

      {success && requestedHost && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
          <span className="font-bold text-green-700">{translate('matches.requestSent')}</span> {translate('matches.requestedToStayWith', undefined).replace('{name}', requestedHost.name).replace('{city}', requestedHost.city)}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map(host => (
            <HostingCard key={host.id} host={host} onRequest={() => handleRequest(host)} />
          ))}
        </div>
      )}
      {results.length === 0 && !loading && (
        <div className="text-jungle-textLight/60 text-center">{translate('matches.noHostsFound')}</div>
      )}
    </div>
  )
} 