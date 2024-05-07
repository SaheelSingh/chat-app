import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {TextField , Alert , Snackbar , CircularProgress } from '@mui/material';
// import Alert from '@mui/material/Alert';
// import Snackbar from '@mui/material/Snackbar';
// import CircularProgress from '@mui/material/CircularProgress';
import { UserContext } from '../UserContextProvider';

function Login({ setIsLoginorSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [UsernameRequired, setUsernameRequired] = useState('');
    const [PasswordRequired, setPasswordRequired] = useState('');
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);

    async function LoginUser(ev) {
        setLoading(true);
        ev.preventDefault();
        !username || !username.length ? setUsernameRequired("Username is required") : setUsernameRequired("");
        !password || !password.length ? setPasswordRequired("Password is required") : setPasswordRequired("");
        try {
            const { data } = await axios.post('http://localhost:4000/api/user/login', { username, password })
                .catch(err => setError(err.response.data))
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate('/chat');
            setLoading(true);
        } catch (error) {
            setLoading(false);
            console.log(error);
            setOpen(true);
        }
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <form className='w-6/12 mx-auto' onSubmit={LoginUser}>
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                color="primary"
                margin="normal"
                error={UsernameRequired.length ? true : false}
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
                error={PasswordRequired.length ? true : false}
                helperText={PasswordRequired}
                value={password}
                onChange={(e) => setPassword(e.target.value)} />

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
                        <Alert variant="outlined" severity="error">
                            {error}
                        </Alert>
                    </>
                )
            } */}
            {/* <span className='text-red-400'>{error}</span> */}
            <button className='block w-full bg-blue-500 mt-10 h-11 text-white rounded-sm capitalize'>
                {
                    loading === false && (
                        "Login"
                    )
                }
                {
                    loading === true && (
                        <CircularProgress color='inherit' size={20} />
                    )
                }
            </button>

            <div className='text-center mt-2'>
                Don't have an account?
                <button onClick={() => setIsLoginorSignup('signup')} className='m-2 text-blue-500'>SignUp</button>
            </div>
        </form>
    )
}

export default Login
