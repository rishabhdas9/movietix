'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'
import { TrailerModal } from '@/components/TrailerModal'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default function MoviePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [movie, setMovie] = useState<any>(null)
  const [shows, setShows] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  // Generate next 7 days (using UTC to avoid timezone issues)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const now = new Date()
    return new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + i,
      0, 0, 0, 0
    ))
  })

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(formatDate(dates[0]))
    }
  }, [])

  useEffect(() => {
    if (resolvedParams.slug && selectedDate && selectedCity) {
      fetchData()
    }
  }, [resolvedParams.slug, selectedDate, selectedCity])

  const fetchData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      
      // Fetch shows
      const showsRes = await fetch(
        `${apiUrl}/api/movies/${resolvedParams.slug}/shows?city=${selectedCity}&date=${selectedDate}`
      )
      const showsData = await showsRes.json()
      setMovie(showsData.movie)
      setShows(showsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Movie not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movie.trailer}
        movieTitle={movie.title}
      />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] overflow-hidden">
        {/* Background with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
          style={{
            backgroundImage: movie.banner 
              ? `url(${movie.banner})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">🎬</div>
                )}
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="flex-1 text-white text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {movie.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="text-2xl font-bold">{movie.rating}</span>
                  <span className="text-sm opacity-80">/10</span>
                </div>
                
                <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 font-semibold">
                  {movie.certificate}
                </span>
                
                <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2">
                  {movie.duration} min
                </span>
              </div>
              
              {/* Genres as Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre?.map((g: string) => (
                  <span key={g} className="rounded-full border border-white/40 backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                    {g}
                  </span>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {movie.trailer && (
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-8 py-3 font-bold shadow-xl hover:scale-105 transition-transform"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">About the movie</h2>
          <p className="text-gray-700 leading-relaxed">{movie.description}</p>
        </div>

        
        {/* Date & City Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Select Date & City</h2>
          
          {/* City Selection */}
          <div className="mb-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-lg border border-gray-600 text-gray-600 px-3 py-2"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="flex overflow-x-auto gap-3 pb-2">
            {dates.map((date) => {
              const dateStr = formatDate(date)
              const isSelected = dateStr === selectedDate
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex-shrink-0 rounded-lg border-2 px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-gray-300 hover:border-primary-600 text-gray-400'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-base sm:text-lg font-bold">
                    {date.getDate()}
                  </div>
                  <div className="text-[10px] sm:text-xs">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Show Times by Theater */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Select Show Time</h2>
          
          {!shows?.theaters || shows.theaters.length === 0 ? (
            <div className="rounded-lg bg-white py-12 text-center">
              <p className="text-gray-700">
                No shows available for the selected date and city
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {shows.theaters.map((theater: any) => (
                <div key={theater.theater.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1.5 text-gray-500">
                    {theater.theater.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-4">
                    {theater.theater.address}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {theater.shows.map((show: any) => (
                      <Link
                        key={show.id}
                        href={`/booking/${show.id}`}
                        className="rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-600 hover:text-white sm:px-6 sm:py-3"
                      >
                        {formatTime(show.startTime)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-8 mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Cast</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
              {movie.cast.map((person: any, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-32 snap-start group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 ring-2 ring-transparent group-hover:ring-primary-500 transition-all">
                    {person.image ? (
                      <img 
                        src={person.image} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        👤
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 truncate">{person.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {movie.crew && movie.crew.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Crew</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
              {movie.crew.map((person: any, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-32 snap-start group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 ring-2 ring-transparent group-hover:ring-primary-500 transition-all">
                    {person.image ? (
                      <img 
                        src={person.image} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        🎬
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 truncate">{person.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

