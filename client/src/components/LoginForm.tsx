import {useNavigate} from "react-router";
import {Button, Form} from "react-bootstrap";
import {ChangeEvent, FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {login} from "../http/userAPI.ts";
import {useUserStore} from "../store.ts";

function LoginForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const setUser = useUserStore((store) => store.setUser)

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const onChange = (e: ChangeEvent) => {
        // @ts-ignore
        const {name, value} = e.target;

        setData(prevState => ({
            ...prevState,
            [name]: value,
        }))

    }

    function validate(){
        let isValid = true;

        const errorsTemp = {
            email: '',
            password: '',
        }

        if(!data.email){
            errorsTemp.email = 'This field is required'
            isValid = false
        }

        if(!data.password){
            errorsTemp.password = 'This field is required'
            isValid = false
        }

        setErrors(errorsTemp)
        return isValid;
    }

    function onSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(!validate()) return;

        login({
            email: data.email,
            password: data.password,
        }).then(res => {
            setUser(res.email)
            navigate('/')
        }).catch(e => {
            console.log(e)
            toast.error(e.response.data.message)
        })
    }



    return (
        <Form style={{minWidth: '400px'}} onSubmit={onSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="example@example.com"
                    isInvalid={ errors.email !== ""}
                    value={data.email}
                    name={'email'}
                    onChange={(e) => onChange(e)}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Any password"
                    isInvalid={ errors.password !== ""}
                    value={data.password}
                    name={'password'}
                    onChange={(e) => onChange(e)}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>

            <div className='mt-3' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button variant="link" size="sm" onClick={() => navigate('/signup')}>
                    Sign Up
                </Button>
                <Button variant="success" size="sm" type={'submit'}>
                    Login
                </Button>
            </div>
        </Form>
    );
}

export default LoginForm;
