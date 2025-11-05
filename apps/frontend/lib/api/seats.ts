import api from './client'

export interface LockSeatsData {
  showId: string
  seatIds: string[]
  sessionId: string
}

export const seatsApi = {
  getAvailability: (showId: string) =>
    api.get(`/seats/availability/${showId}`),

  lockSeats: (data: LockSeatsData) => api.post('/seats/lock', data),

  releaseSeats: (sessionId: string) =>
    api.post('/seats/release', { sessionId }),
}


