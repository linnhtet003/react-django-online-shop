import 'boxicons/css/boxicons.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [ signOpen, setSignOpen ] = useState(false);

    const SignMove = () => {
        setSignOpen(!signOpen);
    }

    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const [register, setRegister] = useState({
        email: "",
        name: "",
        password: ""
    })

    const loginInput = (e) => {
        let loginData = {...userData}
        loginData[e.target.name] = e.target.value
        setUserData(loginData)
    }
    const registerInput = (e) => {
        let registerData = {...register}
        registerData[e.target.name] = e.target.value
        setRegister(registerData)
        console.log(register)
    }

    const loginBtn = () => {
        fetch(`http://127.0.0.1:8000/api/token/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })
        .then(resp => resp.json())
        .then(data => {
            if(data.access){
                localStorage.setItem('foode-token', data.access);
                // localStorage.setItem('foode-refresh', data.refresh);
                navigate('/');
            }else{
                alert("username or password is wrong!")
            }
        })
        .catch(err => alert(err))
    }

    const RegisterBtn = (e) => {
        e.preventDefault(); // prevent page reload
        fetch(`http://127.0.0.1:8000/api/register/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(register)
        })
        .then(resp => resp.json())
        .then(data => {
            if(data.access){
                alert("Account created successfully")
                localStorage.setItem('foode-token', data.access);
                navigate('/')
            }else{
                alert(data.error)
            }
        })
        .catch(err => alert(err))
    }


  return (
    <div className='w-[768px] max-w-full min-h-[480px] m-auto bg-[var(--bg-color)] mt-16 mb-20 rounded-[10px] relative overflow-hidden'
         style={{boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
                 fontFamily: '"Montserrat", sans-serif'
         }}>
        <div className={`${signOpen ? 'sign-up' : ''} sign-up-base absolute top-0 h-full transition-all duration-[600ms] ease-in-out`}>
            <form onSubmit={RegisterBtn} className='h-full bg-white flex items-center justify-center flex-col py-0 px-[50px] text-center'>
                <h1 className='font-bold m-0'>Create Account</h1>
                <div className='py-5 px-0'>
                    <a href='https://www.facebook.com/share/1FRvQw2rWs/' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-facebook" ></i>
                    </a>
                    <a href='https://x.com/LinnHtet97228' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-twitter"></i>
                    </a>
                    <a href='https://www.instagram.com/linnhtet003/' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-instagram"></i>
                    </a>
                </div>
                <input className='bg-[#eee] rounded-md border-none py-3 px-[15px] my-2 mx-0 w-full' onChange={registerInput} name='name' type='text' placeholder='Name' required/>
                <input className='bg-[#eee] rounded-md border-none py-3 px-[15px] my-2 mx-0 w-full' onChange={registerInput} name='email' type='email' placeholder='Email' required/>
                <input className='bg-[#eee] rounded-md border-none py-3 px-[15px] my-2 mx-0 w-full' onChange={registerInput} name='password' type='password' placeholder='Password' required/>
                <span onClick={SignMove} className='text-sm text-[gray] mt-3 cursor-pointer hover:text-[#00803c] transition-all duration-300 ease-in-out'>
                    You already has account?
                </span>
                <button type='submit' className='bg-[var(--btn-color)] mt-4 py-3 px-11 text-xs text-white font-bold uppercase tracking-[1px] rounded-[1.5rem] hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out'>
                    Sign Up
                </button>
            </form>
        </div>

        <div className={`${signOpen ? 'sign-in' : ''} sign-in-base absolute top-0 h-full transition-all duration-[600ms] ease-in-out`}>
            <form className='h-full bg-white flex items-center justify-center flex-col py-0 px-[50px] text-center'>
                <h1 className='font-bold m-0'>LogIn</h1>
                <div className='py-5 px-0'>
                    <a href='https://www.facebook.com/share/1FRvQw2rWs/' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-facebook" ></i>
                    </a>
                    <a href='https://x.com/LinnHtet97228' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-twitter"></i>
                    </a>
                    <a href='https://www.instagram.com/linnhtet003/' className='h-10 w-10 text-base inline-flex justify-center items-center border-[1px] border-[#ddd] rounded-full my-0 mx-[5px]'>
                        <i className="bx bxl-instagram"></i>
                    </a>
                </div>
                <input className='bg-[#eee] rounded-md border-none py-3 px-[15px] my-2 mx-0 w-full' name='email' onChange={loginInput} type='email' placeholder='Email' required/>
                <input className='bg-[#eee] rounded-md border-none py-3 px-[15px] my-2 mx-0 w-full' name='password' onChange={loginInput} type='password' placeholder='Password' required/>
                <span onClick={SignMove} className='text-sm text-[gray] mt-3 cursor-pointer hover:text-[#00803c] transition-all duration-300 ease-in-out'>
                    You didn't has account?
                </span>
                <button type='button' onClick={loginBtn} className='bg-[var(--btn-color)] mt-4 py-3 px-11 text-xs text-white font-bold uppercase tracking-[1px] rounded-[1.5rem] hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out'>
                    LogIn
                </button> {/* Use type="button" on buttons inside forms */}
            </form>
        </div>

        <div className={`${signOpen ? 'translate-x-[-100%]' : 'translate-x-0'} absolute top-0 left-[50%] w-[50%] h-full transform overflow-hidden transition-all duration-[600ms] ease-in-out z-[100]`}>
            <div className={`${signOpen ? 'overlay' : ''} text-white relative left-[-100%] h-full w-[200%] transition-all duration-[600ms] ease-in-out`}
                    style={{background: 'linear-gradient(to right, #FF4500, #f3c30e)',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: '0 0'
                    }}>
                <div className={` ${signOpen ? 'translate-x-0' : 'translate-x-[-20%]'} absolute transform tr flex items-center justify-center flex-col py-0 px-10 text-center top-0 h-full w-[50%] transition-all duration-[600ms] ease-in-out`}>
                    <h1 className='font-bold m-0'>Welcome Back!</h1>
                    <p className='text-sm font-thin tracking-[0.5px] mt-5 mb-[30px] px-0'>
                        To keep connected with us please login with your personal info
                    </p>
                    <button onClick={SignMove} className='bg-transparent border-white border-[1px] py-3 px-11 text-xs text-white font-bold uppercase tracking-[1px] rounded-[1.5rem] hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out'>
                        Login
                    </button>
                </div>
                <div className={`${signOpen ? 'translate-x-[20%]' : 'translate-x-0'} absolute flex items-center justify-center flex-col py-0 px-10 text-center top-0 right-0 h-full w-[50%] transform transition-all duration-[600ms] ease-in-out`}>
                    <h1 className='font-bold m-0'>Hello, Customber!</h1>
                    <p className='text-sm font-thin tracking-[0.5px] mt-5 mb-[30px] px-0'>
                        Enter your personal details and start shopping with us
                    </p>
                    <button onClick={SignMove} className='bg-transparent border-white border-[1px] py-3 px-11 text-xs text-white font-bold uppercase tracking-[1px] rounded-[1.5rem] hover:opacity-90 hover:scale-105 transition-all duration-300 ease-in-out'>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
