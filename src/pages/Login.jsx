import React, { useEffect, useState } from "react";
import '../assets/css/login.css'
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BASE_URL from "../hooks/baseURL";
import Spinner from "../components/Spinner";

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState('');

    const auth = localStorage.getItem("token");
    const navigate = useNavigate();

    if(auth){
        useEffect(() => {
          navigate("/"); // Navigate to the home route
        }, [navigate]);
    }

    const login = (e) =>{
        e.preventDefault();
        setLoading(true);
        const loginData = {
            phone: phone,
            password: password
        };
        // console.log(loginData);
        
        fetch(BASE_URL + '/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        })
          .then(async response => {
            if (!response.ok) {
              setLoading(false);
              let errorData;
              try {
                errorData = await response.json();
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
        
              if (response.status === 422) {
                setErrMsg("");
                setError(errorData.errors);
                // console.error(`Login failed with status ${response.status}:`, errorData);
              }else if (response.status === 401) {
                // console.error(`Login failed with status ${response.status}:`, errorData);
                setError("");
                setErrMsg(errorData.message)
                setTimeout(() => {
                    setErrMsg("")
                }, 1000)
              }else{
              }
        
              throw new Error('Login Failed');
            }
        
            return response.json();
          })
          .then(data => {
            setData(data);
            setLoading(false);
            // console.log(data);
            if(data.data.is_changed_password === 0){
              localStorage.setItem("auth", data.data.id)
              navigate('/new-player-change-password');
            }else{
              if (data.data.token) {
                localStorage.setItem('token', data.data.token);
                navigate('/');
              } else {
                throw new Error('Token not found in response');
              }
            }
          })
          .catch(error => {
          });
        }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center mb-5">

                <div style={{ background: '#00393A', color: '#d0c7dd', borderRadius: '50px', border: '1px solid #fff' }} className="py-5 px-3 logins">

                    <div className="text-center mt-sm-3 mb-3">
                        <h5 className="gradient-text py-sm-3">Login</h5>
                        <h3 className="text-light gradient-text d-block">Welcome Back!</h3>
                        <span className="gradient-text" style={{ fontSize: '12px' }}>welcome back we missed you</span>
                    </div>
                    {errMsg && (
                        <div className="alert alert-danger text-white">
                          *{errMsg}
                        </div>
                    )}
                    <Form className="mx-2" style={{ color: '#7d64a0' }} onSubmit={login}>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{ fontSize: '14px' }}>Phone</Form.Label>
                            <Form.Control 
                            type="text" 
                            className="inputs" 
                            placeholder="09xxxx" 
                            onChange={(e)=>setPhone(e.target.value)}
                            value={phone}
                            />
                            {error.phone && (
                                <div className="text-danger">*{error.phone}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label style={{ fontSize: '14px' }}>Password</Form.Label>
                            <Form.Control 
                            type="password" 
                            className="inputs" 
                            placeholder="Password" 
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            />
                            {error.password && (
                                <span className="text-danger">*{error.password}</span>
                            )}
                        </Form.Group>
                        <div>
                            <Button type="submit" className="w-100 d-flex justify-content-center shadow btn-light" style={{ background: "#fff !important" }}>
                                {loading && 
                                    <div className="me-2">
                                        <Spinner />
                                    </div>
                                }
                                <span className="d-block">Login</span>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login