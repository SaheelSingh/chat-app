import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

function SignUp({ setIsLoginorSignup }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState();
    const [EmailRequired, setEmailRequired] = useState('');
    const [UsernameRequired, setUsernameRequired] = useState('');
    const [PasswordRequired, setPasswordRequired] = useState('');
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function Signup(ev) {
        setLoading(true);
        ev.preventDefault();
        !email || !email.length ? setEmailRequired("Email is required") : setEmailRequired("");
        !username || !username.length ? setUsernameRequired("Username is required") : setUsernameRequired("");
        !password || !password.length ? setPasswordRequired("Password is required") : setPasswordRequired("");
        try {
            const { data } = await axios.post('http://localhost:4000/api/user', { username, email, password, pic })
                .catch(err => setError(err.response.data));
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('/chat');
            setLoading(true);
        } catch (error) {
            setLoading(false)
            console.log(error)
            setOpen(true)
        }
    }

    function postDetail(pics) {
        if (pics.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dyaueeugc");
            fetch("https://api.cloudinary.com/v1_1/dyaueeugc/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString())
                    console.log(data)
                })
        }
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <form className='w-6/12 mx-auto' onSubmit={Signup}>
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                color="primary"
                margin="normal"
                error={EmailRequired && EmailRequired.length ? true : false}
                helperText={EmailRequired}
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                color="primary"
                margin="normal"
                error={UsernameRequired && UsernameRequired.length ? true : false}
                helperText={UsernameRequired}
                value={username}
                onChange={(e) => setUsername(e.target.value)} />

            <TextField
                fullWidth
                label="Password"
                type='password'
                variant="outlined"
                color="primary"
                margin="normal"
                error={PasswordRequired && PasswordRequired.length ? true : false}
                helperText={PasswordRequired}
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

            <input
                type='file'
                accept='image/*'
                onChange={(e) => postDetail(e.target.files[0])}
            />

            {
                open && (
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )
            }

            {/* {
                error && (
                    <>
                        <Alert variant="outlined" severity="error" className='mt-1'>
                            {error}
                        </Alert>
                    </>
                )
            } */}

            <button className='block w-full bg-blue-500 mt-10 h-11 text-white rounded-sm capitalize'>
                {
                    loading === false && (
                        "Sign up"
                    )
                }
                {
                    loading === true && (
                        <CircularProgress color='inherit' size={20} />
                    )
                }
            </button>

            <div className='text-center mt-2'>
                Already a member?
                <button onClick={() => { setIsLoginorSignup('login') }} className='m-2 text-blue-500'>Login</button>
            </div>
        </form>
    )
}

export default SignUp
