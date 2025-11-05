import Link from 'next/link'

async function getMovies() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/movies`,
      {
        cache: 'no-store',
      }
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Failed to fetch movies:', error)
    return []
  }
}

export default async function HomePage() {
  const movies = await getMovies()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">Movies in Theaters</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-700">Book your tickets now!</p>
      </header>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
          <div className="text-5xl mb-3">🎬</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">No movies available</h3>
          <p className="mt-1 text-gray-700">Ensure the backend is running and the database is seeded.</p>
          <code className="mt-3 rounded bg-gray-50 px-3 py-1.5 text-xs text-gray-700">pnpm db:push && pnpm db:seed</code>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie: any) => (
            <Link key={movie.id} href={`/movies/${movie.slug}`} className="group block">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {movie.poster ? (
                    <>
                      <img 
                        src={movie.poster} 
                        alt={movie.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="w-full rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-gray-900 text-center">
                            Book Now
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/80 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <span className="text-yellow-400">⭐</span>
                    <span>{movie.rating}</span>
                  </div>
                  
                  {movie.genre?.[0] && (
                    <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      {movie.genre[0]}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                    {movie.genre?.join(' • ')}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700">
                      {movie.certificate}
                    </span>
                    <span className="text-gray-500">{movie.duration}min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

