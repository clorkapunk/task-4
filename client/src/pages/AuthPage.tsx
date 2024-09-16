import {useUserStore} from "../store.ts";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";
import LoginForm from "../components/LoginForm.tsx";
import SignupForm from "../components/SignupForm.tsx";
import {Container} from "react-bootstrap";
import {Toaster} from "react-hot-toast"



function AuthPage() {
    const isAuth = useUserStore((store) => store.isAuth )
    const navigate = useNavigate();
    const isLogin = useLocation().pathname === "/login"

    console.log(`isAuth: ${isAuth}`)

    useEffect(() => {
        if(isAuth) navigate('/')
    }, [isAuth]);



    return (
        <>
            <Container style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {
                    isLogin ?
                        <LoginForm/>
                        :
                        <SignupForm/>
                }
            </Container>
            <Toaster />
        </>

    );
}

export default AuthPage;
