'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { bookingsApi } from '@/lib/api/bookings'
import { formatTime, formatCurrency, formatDateDisplay } from '@/lib/utils'

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingCode = searchParams.get('bookingCode')
  const [booking, setBooking] = useState<any>(null)
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (bookingCode) {
      fetchBooking()
    }
  }, [bookingCode])

  useEffect(() => {
    if (!booking || booking.status !== 'PENDING') {
      setTimeRemaining(0)
      setIsExpired(false)
      return
    }

    const calculateExpiryTime = () => {
      // Use expiresAt if available, otherwise calculate from bookedAt + 5 minutes
      if (booking.expiresAt) {
        return new Date(booking.expiresAt).getTime()
      } else if (booking.bookedAt) {
        const bookedTime = new Date(booking.bookedAt).getTime()
        return bookedTime + (5 * 60 * 1000) // 5 minutes in milliseconds
      }
      return null
    }

    const expiryTime = calculateExpiryTime()
    if (!expiryTime) {
      setTimeRemaining(0)
      setIsExpired(false)
      return
    }

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, expiryTime - now)
      
      setTimeRemaining(remaining)
      setIsExpired(remaining === 0)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [booking])

  const fetchBooking = async () => {
    try {
      const response = await bookingsApi.getByCode(bookingCode!)
      const bookingData = response.data

      setBooking(bookingData)

      // Initialize timer for pending bookings
      if (bookingData.status === 'PENDING') {
        const calculateExpiryTime = () => {
          if (bookingData.expiresAt) {
            return new Date(bookingData.expiresAt).getTime()
          } else if (bookingData.bookedAt) {
            const bookedTime = new Date(bookingData.bookedAt).getTime()
            return bookedTime + (5 * 60 * 1000)
          }
          return null
        }

        const expiryTime = calculateExpiryTime()
        if (expiryTime) {
          const remaining = Math.max(0, expiryTime - Date.now())
          setTimeRemaining(remaining)
          setIsExpired(remaining === 0)
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async () => {
    if (!bookingCode) return
    
    try {
      setConfirming(true)
      await bookingsApi.confirm(bookingCode)
      fetchBooking() // Refresh to show confirmed status
    } catch (error: any) {
      alert(error.response?.data?.message || 'Payment confirmation failed')
    } finally {
      setConfirming(false)
    }
  }

  const formatTimeRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-gray-700">Loading booking...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Booking not found</p>
        </div>
      </div>
    )
  }

  const isPending = booking.status === 'PENDING'

  // Show expired message if booking has expired
  if (isPending && isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold mb-2 text-red-600">Booking Expired</h1>
          <p className="text-gray-700 mb-6">
            Your booking has expired. The seats have been released and are now available for others to book.
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
          >
            Book Again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {isPending ? '⏳' : '✅'}
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-700">
          {isPending ? 'Booking Created!' : 'Booking Confirmed!'}
        </h1>
        <p className="text-gray-700">
          {isPending
            ? 'Please complete the payment to confirm your booking'
            : 'Your tickets have been booked successfully'}
        </p>
      </div>

      {/* Mock Payment Button */}
      {isPending && (
        <div className="mb-8 rounded-xl border-2 border-yellow-400 bg-yellow-50 p-5">
          <div className="text-center mb-4">
            <p className="font-semibold mb-2 text-gray-700">Complete your payment</p>
            {timeRemaining > 0 ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm text-gray-700">Time remaining:</span>
                  <span className={`text-2xl font-bold ${timeRemaining < 60000 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTimeRemaining(timeRemaining)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1">
                  Seats will be released after timer expires
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-700">Calculating time remaining...</p>
            )}
          </div>
          <button
            onClick={handleConfirmPayment}
            disabled={confirming || isExpired}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirming ? 'Processing Payment...' : isExpired ? 'Payment Expired' : 'Pay Now (Mock Payment)'}
          </button>
          <p className="text-xs text-center mt-2 text-gray-700">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      )}

      {/* Ticket */}
      <div className="overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="bg-primary-600 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Booking Code</p>
              <div className="relative inline-block">
                <p className={`text-2xl font-bold ${isPending ? 'blur-sm select-none' : ''}`}>
                  {booking.bookingCode}
                </p>
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs opacity-80 bg-white/20 px-2 py-1 rounded">Complete payment to view</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`rounded-full px-4 py-2 text-sm font-semibold ${
              booking.status === 'CONFIRMED'
                ? 'bg-green-500'
                : 'bg-yellow-500'
            }`}>
              {booking.status}
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Movie Details */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-600">{booking.movie.title}</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-700">Theater</p>
                  <p className="font-semibold text-gray-500">{booking.theater.name}</p>
                  <p className="text-xs text-gray-700">{booking.theater.address}</p>
                </div>

                <div>
                  <p className="text-gray-700">Screen</p>
                  <p className="font-semibold text-gray-500">{booking.screen}</p>
                </div>

                <div>
                  <p className="text-gray-700">Show Time</p>
                  <p className="font-semibold text-gray-500">
                    {formatDateDisplay(booking.showTime)} at{' '}
                    {formatTime(booking.showTime)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700">Seats</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {booking.seats.map((seat: any) => (
                      <span
                        key={seat.seatNumber}
                        className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold"
                      >
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-700">Total Amount</p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-700 mb-4">
                {isPending ? 'QR code will be available after payment' : 'Show this QR code at the theater'}
              </p>
              <div className="relative rounded-lg bg-white p-4 shadow-inner">
                <QRCodeSVG 
                  value={isPending ? 'PENDING_PAYMENT' : booking.bookingCode} 
                  size={200} 
                />
                {isPending && (
                  <div className="absolute inset-0 backdrop-blur-md rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-sm font-semibold text-gray-900">Complete Payment</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative inline-block mt-4">
                <p className={`text-xs text-gray-700 text-center ${isPending ? 'blur-sm select-none' : ''}`}>
                  Booking ID: {booking.bookingCode}
                </p>
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs opacity-60">Complete payment to view</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="font-semibold mb-2 text-gray-600">Customer Details</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-700">Name</p>
                <p className="font-medium text-gray-500">{booking.userName}</p>
              </div>
              <div>
                <p className="text-gray-700">Email</p>
                <p className="font-medium text-gray-500">{booking.userEmail}</p>
              </div>
              <div>
                <p className="text-gray-700">Phone</p>
                <p className="font-medium text-gray-500">{booking.userPhone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-700">
          <p>Thank you for booking with MovieTix! 🎬</p>
          <p className="text-xs mt-1">
            Please arrive 15 minutes before the show time.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center gap-3 sm:gap-4">
        <button
          onClick={() => window.print()}
          className="rounded-lg border-2 border-primary-600 bg-white px-5 py-2 font-semibold text-primary-600 hover:bg-primary-50 sm:px-6"
        >
          Print Ticket
        </button>
        <a
          href="/"
          className="rounded-lg bg-primary-600 px-5 py-2 font-semibold text-white hover:bg-primary-700 sm:px-6"
        >
          Book More Tickets
        </a>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

