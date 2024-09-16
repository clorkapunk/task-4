import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router";
import {ChangeEvent, FormEvent, useState} from "react";
import {signup} from "../http/userAPI.ts";
import toast from "react-hot-toast";


function SignupForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        name: '',
        password: '',
        passwordRepeat: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        name: '',
        password: '',
        passwordRepeat: '',
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
            name: '',
            password: '',
            passwordRepeat: '',
        }

        if(!data.email){
            errorsTemp.email = 'This field is required'
            isValid = false
        }

        if(!data.name){
            errorsTemp.name = 'This field is required'
            isValid = false
        }

        if(!data.password){
            errorsTemp.password = 'This field is required'
            isValid = false
        }

        if(data.password !== data.passwordRepeat){
            errorsTemp.passwordRepeat = "Passwords mismatch"
            isValid = false;
        }

        setErrors(errorsTemp)
        return isValid;
    }

    function onSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if(!validate()) return;

        signup({
            email: data.email,
            password: data.password,
            name: data.name
        }).then(res => {
            console.log(res)
            toast.success("Success")
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
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Your name"
                    isInvalid={ errors.name !== ""}
                    value={data.name}
                    name={'name'}
                    onChange={(e) => onChange(e)}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name}
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
            <Form.Group className="mb-3" >
                <Form.Label>Password (repeat)</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Repeat password"
                    isInvalid={ errors.passwordRepeat !== ""}
                    value={data.passwordRepeat}
                    name={'passwordRepeat'}
                    onChange={(e) => onChange(e)}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.passwordRepeat}
                </Form.Control.Feedback>
            </Form.Group>
            <div className='mt-3' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button variant="link" size="sm" onClick={() => navigate('/login')}>
                    Login
                </Button>
                <Button variant="success" size="sm" type={'submit'}>
                    Sign Up
                </Button>
            </div>
        </Form>
    );
}

export default SignupForm;
