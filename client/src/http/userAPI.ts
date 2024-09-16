import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    email: string
}

type SignupData = {
    email: string;
    password: string;
    name: string;
}

type LoginData = {
    email: string;
    password: string;
}

export const signup = async (data: SignupData) => {
    const response = await $host.post('api/user/signup', data)
    localStorage.setItem('token', response.data.token)
    return jwtDecode(response.data.token) as JwtPayload
}

export const login = async (data: LoginData) => {
    const response = await $host.post('api/user/login', data)
    localStorage.setItem('token', response.data.token)
    return jwtDecode(response.data.token) as JwtPayload
}

export const auth = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token) as JwtPayload
}

export const getUsers = async ({page, limit, search}: {page: number, limit: number, search: string}) => {
    const {data} = await $authHost.get(`api/user/?limit=${limit}&page=${page}&search=${search}`)
    return data
}

export const blockUsers = async (users: string[]) => {
    return await $authHost.post('api/user/change', {
        users,
        status: 'Blocked'
    })
}

export const activateUsers = async (users: string[]) => {
    return await $authHost.post('api/user/change', {
        users,
        status: 'Active'
    })
}


export const deleteUsers = async (users: string[]) => {
    return await $authHost.delete('api/user/delete', {data: {users}})
}
