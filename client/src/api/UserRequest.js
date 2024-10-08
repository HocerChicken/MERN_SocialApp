import axios from 'axios'

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL })

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('accessToken')
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`
//   }
//   console.log(req.headers)
//   return req
// })

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config
//     if (
//       error.response.status === 401 &&
//       error.response.data.message === 'Token expired' &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true
//       try {
//         const { data } = await axios.post(
//           `${process.env.REACT_APP_SERVER_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true }
//         )
//         localStorage.setItem('accessToken', data.accessToken)
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
//         return API(originalRequest)
//       } catch (err) {
//         console.error('Refresh token expired or invalid', err)
//         // Handle refresh token expiration (e.g., redirect to login)
//         localStorage.removeItem('accessToken')
//         window.location.href = '/auth'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

const getAllUser = () => API.get('/user')
const getUser = (id) => API.get(`/user/${id}`)
const updateUser = (id, formData) => API.put(`/user/${id}`, formData)
const followUser = (id, data) => API.put(`/user/${id}/follow`, data)
const unFollowUser = (id, data) => API.put(`/user/${id}/unfollow`, data)
const enterRoom = (id) => API.post('/studyroom/enter', { id })
const exitRoom = (id) => API.post('/studyroom/exit', { id })
const searchUsers = (query) => API.post(`/user/search?query=${query}`)

export {
  getAllUser,
  getUser,
  updateUser,
  followUser,
  unFollowUser,
  searchUsers,
  enterRoom,
  exitRoom,
}
