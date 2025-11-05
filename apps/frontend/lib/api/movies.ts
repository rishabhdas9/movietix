import api from './client'

export const moviesApi = {
  getAll: (params?: { city?: string; genre?: string; language?: string }) =>
    api.get('/movies', { params }),

  getBySlug: (slug: string) => api.get(`/movies/${slug}`),

  getShows: (slug: string, city: string, date: string) =>
    api.get(`/movies/${slug}/shows`, { params: { city, date } }),
}


