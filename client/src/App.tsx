import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthPage from "./pages/AuthPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import {useUserStore} from "./store.ts";
import {useEffect} from "react";
import {Navigate} from "react-router";
import {auth} from "./http/userAPI.ts";


function App() {

    const isAuth = useUserStore((store) => store.isAuth)
    const setUser = useUserStore((store) => store.setUser )
    const logOut = useUserStore((store) => store.logOut )

    useEffect(() => {
        if(localStorage.getItem("token") !== null){
            auth()
                .then(res => {
                    setUser(res.email)
                })
                .catch(()=> {
                    logOut()
                })
        }
    }, [])



    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthPage/>} path={'/login'}/>
                <Route element={<AuthPage/>} path={'/signup'}/>
                {
                    isAuth &&
                    <Route element={<MainPage/>} path={'/'}/>
                }
                <Route path="*" element={<Navigate replace to={'/login'} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
