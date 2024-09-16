import {create} from 'zustand'



type UserStore = {
    isAuth: boolean
    email?: string,
    logOut: () => void,
    setUser: (token: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
    isAuth: false,
    email: undefined,
    logOut: () => {
        localStorage.removeItem('token')
        set({isAuth: false, email: ''})
    },
    setUser: (email: string) => {
        set({email: email, isAuth: true})
    }
}))
