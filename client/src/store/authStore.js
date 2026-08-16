import {create} from 'zustand'

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,

    login: (userData) => {
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
        set({user: userData, token: userData.token})
    },

    logout: () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({user: null, token: null})
    },
}))

export default useAuthStore