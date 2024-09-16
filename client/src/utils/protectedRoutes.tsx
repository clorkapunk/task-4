import {Navigate, Outlet} from "react-router";
import {useUserStore} from "../store.ts";

const ProtectedRoutes = () => {
    const isAuth = useUserStore((store) => store.isAuth)
    return isAuth ? <Outlet/> : <Navigate to={'/login'}/>
}

export default ProtectedRoutes;
