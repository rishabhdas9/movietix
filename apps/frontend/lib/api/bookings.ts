import api from './client'

export interface CreateBookingData {
  showId: string
  seatIds: string[]
  userName: string
  userEmail: string
  userPhone: string
  sessionId: string
}

export const bookingsApi = {
  create: (data: CreateBookingData) => api.post('/bookings', data),

  getByCode: (bookingCode: string) => api.get(`/bookings/${bookingCode}`),

  confirm: (bookingCode: string) =>
    api.post(`/bookings/${bookingCode}/confirm`),

  cancel: (bookingCode: string) => api.post(`/bookings/${bookingCode}/cancel`),
}


