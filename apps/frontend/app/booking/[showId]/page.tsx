'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { seatsApi } from '@/lib/api/seats'
import { bookingsApi } from '@/lib/api/bookings'
import { generateSessionId, formatTime, formatCurrency } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    showId: string
  }>
}

export default function BookingPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [sessionId] = useState(() => generateSessionId())
  const [seats, setSeats] = useState<any[]>([])
  const [show, setShow] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchSeats = async () => {
      try {
        const response = await seatsApi.getAvailability(resolvedParams.showId)
        if (isMounted) {
          setSeats(response.data.seats)
          setShow(response.data.show)
          setLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching seats:', error)
        }
      }
    }

    fetchSeats()
    const interval = setInterval(fetchSeats, 5000) // Refresh every 5s
    
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [resolvedParams.showId])

  const MAX_SEATS = 10

  const handleSeatClick = async (seat: any) => {
    if (seat.status === 'booked') return

    const isSelected = selectedSeats.includes(seat.id)
    
    // If deselecting, allow
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.id))
      return
    }
    
    // If at max capacity, show warning
    if (selectedSeats.length >= MAX_SEATS) {
      alert(`You can only select up to ${MAX_SEATS} seats per booking`)
      return
    }
    
    // Add seat
    setSelectedSeats([...selectedSeats, seat.id])
  }

  const calculateTotal = () => {
    if (!show) return 0
    return selectedSeats.reduce((sum, seatId) => {
      const seat = seats.find((s) => s.id === seatId)
      return sum + (show.pricing[seat?.seatType] || 0)
    }, 0)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSeats.length === 0) return

    try {
      setBooking(true)
      
      // First, lock the seats
      await seatsApi.lockSeats({
        showId: resolvedParams.showId,
        seatIds: selectedSeats,
        sessionId,
      })
      
      // Then create the booking
      const response = await bookingsApi.create({
        showId: resolvedParams.showId,
        seatIds: selectedSeats,
        userName,
        userEmail,
        userPhone,
        sessionId,
      })
      
      // Redirect to success page
      router.push(`/success?bookingCode=${response.data.bookingCode}`)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💺</div>
          <p className="text-gray-700">Loading seats...</p>
        </div>
      </div>
    )
  }

  // Group seats by row and type
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = []
    acc[seat.row].push(seat)
    return acc
  }, {} as Record<string, any[]>)

  const rows = Object.keys(seatsByRow).sort()
  
  // Determine section types based on seat types in each row
  const getSectionType = (row: string) => {
    const rowSeats = seatsByRow[row]
    if (rowSeats.some((s: any) => s.seatType === 'VIP')) return 'VIP'
    if (rowSeats.some((s: any) => s.seatType === 'PREMIUM')) return 'PREMIUM'
    return 'REGULAR'
  }
  
  // Group rows by section
  const sections = rows.reduce((acc, row) => {
    const sectionType = getSectionType(row)
    if (!acc[sectionType]) acc[sectionType] = []
    acc[sectionType].push(row)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight">Select Seats</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-3 sm:p-5 md:p-6 shadow-xl ring-1 ring-black/5">
            {/* Screen */}
            <div className="mb-8 perspective-1000">
              <div className="rounded-t-3xl bg-gradient-to-b from-gray-300 to-gray-400 py-4 text-center shadow-lg">
                <span className="text-2xl mb-1 block">🎬</span>
                <div className="text-sm font-bold text-gray-700">SCREEN THIS WAY</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-t-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md"></div>
                <span className="font-medium text-gray-700">Available</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-t-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-md"></div>
                <span className="font-medium text-gray-700">Selected</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white px-2 sm:px-4 py-1.5 sm:py-2 shadow-sm">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-t-lg bg-gradient-to-br from-gray-300 to-gray-500 shadow-md"></div>
                <span className="font-medium text-gray-700">Booked</span>
              </div>
            </div>

            {/* Seats by Section */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* VIP Section */}
              {sections.VIP && sections.VIP.length > 0 && (
                <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-2 sm:p-3 md:p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-purple-600 px-3 py-1 text-xs text-white">VIP</span>
                      <span>₹{show?.pricing?.VIP || 0}</span>
                    </h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {sections.VIP.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2">
                        <div className="w-4 sm:w-6 md:w-8 text-center font-bold text-purple-700 text-[10px] sm:text-xs md:text-base">
                          {row}
                        </div>
                        <div className="flex gap-0.5 sm:gap-1.5 md:gap-2">
                          {seatsByRow[row]
                            .sort((a: any, b: any) => a.column - b.column)
                            .map((seat: any) => {
                              const isSelected = selectedSeats.includes(seat.id)
                              let statusClass = 'available'
                              
                              if (seat.status === 'booked') statusClass = 'booked'
                              else if (isSelected) statusClass = 'selected'

                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={seat.status === 'booked'}
                                  className={`seat-enhanced ${statusClass} ${
                                    seat.seatType === 'VIP' ? 'ring-2 ring-purple-400' : ''
                                  }`}
                                  title={`${seat.seatNumber} - ${seat.seatType} - ₹${show?.pricing?.[seat.seatType] || 0}`}
                                >
                                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold">
                                    {seat.column}
                                  </span>
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Section */}
              {sections.PREMIUM && sections.PREMIUM.length > 0 && (
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-2 sm:p-3 md:p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs text-white">PREMIUM</span>
                      <span>₹{show?.pricing?.PREMIUM || 0}</span>
                    </h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {sections.PREMIUM.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2">
                        <div className="w-4 sm:w-6 md:w-8 text-center font-bold text-blue-700 text-[10px] sm:text-xs md:text-base">
                          {row}
                        </div>
                        <div className="flex gap-0.5 sm:gap-1.5 md:gap-2">
                          {seatsByRow[row]
                            .sort((a: any, b: any) => a.column - b.column)
                            .map((seat: any) => {
                              const isSelected = selectedSeats.includes(seat.id)
                              let statusClass = 'available'
                              
                              if (seat.status === 'booked') statusClass = 'booked'
                              else if (isSelected) statusClass = 'selected'

                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={seat.status === 'booked'}
                                  className={`seat-enhanced ${statusClass} ${
                                    seat.seatType === 'PREMIUM' ? 'ring-2 ring-blue-400' : ''
                                  }`}
                                  title={`${seat.seatNumber} - ${seat.seatType} - ₹${show?.pricing?.[seat.seatType] || 0}`}
                                >
                                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold">
                                    {seat.column}
                                  </span>
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Section */}
              {sections.REGULAR && sections.REGULAR.length > 0 && (
                <div className="rounded-xl border-2 border-gray-200 bg-gray-50/50 p-2 sm:p-3 md:p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-gray-600 px-3 py-1 text-xs text-white">REGULAR</span>
                      <span>₹{show?.pricing?.REGULAR || 0}</span>
                    </h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {sections.REGULAR.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-0.5 sm:gap-1.5 md:gap-2">
                        <div className="w-4 sm:w-6 md:w-8 text-center font-bold text-gray-700 text-[10px] sm:text-xs md:text-base">
                          {row}
                        </div>
                        <div className="flex gap-0.5 sm:gap-1.5 md:gap-2">
                          {seatsByRow[row]
                            .sort((a: any, b: any) => a.column - b.column)
                            .map((seat: any) => {
                              const isSelected = selectedSeats.includes(seat.id)
                              let statusClass = 'available'
                              
                              if (seat.status === 'booked') statusClass = 'booked'
                              else if (isSelected) statusClass = 'selected'

                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => handleSeatClick(seat)}
                                  disabled={seat.status === 'booked'}
                                  className={`seat-enhanced ${statusClass}`}
                                  title={`${seat.seatNumber} - ${seat.seatType} - ₹${show?.pricing?.[seat.seatType] || 0}`}
                                >
                                  <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold">
                                    {seat.column}
                                  </span>
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-700">Booking Summary</h2>
            
            <div className="mb-4 text-sm">
              <p className="text-gray-700">Selected Seats:</p>
              <p className="font-semibold">
                <span className="text-gray-700">
                {selectedSeats.length > 0
                  ? selectedSeats
                      .map((id) => seats.find((s) => s.id === id)?.seatNumber)
                      .join(', ')
                  : 'None'}
                  </span>
              </p>
            </div>

            <div className="mb-4 text-sm">
              <p className="text-gray-700">Total Amount:</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(calculateTotal())}
              </p>
            </div>

            {selectedSeats.length > 0 && (
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={booking}
                  className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {booking ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

