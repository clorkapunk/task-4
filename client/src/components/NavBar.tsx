import {Button, Container, Navbar} from "react-bootstrap";
import {useUserStore} from "../store.ts";

function NavBar() {
    const email = useUserStore((store) => store.email)
    const logout = useUserStore((store) => store.logOut)

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Hello, <b>{email}</b>!
                    </Navbar.Text>
                    <Button variant={'link'} onClick={() => {
                        logout()
                    }}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
