import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { apiurl } from './api/config';


// Define the type for the decoded token
interface DecodedToken {
    role: string;
    // Add other fields from your JWT if necessary
}

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [msg, setMsg] = useState<string>('');
    const navigate = useNavigate();

    const Auth = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiurl}/login`, {
                email,
                password
            });

            const token: string = response.data.accessToken;

            // Decode the token to get the role
            const decoded: DecodedToken = jwtDecode(token);

            const role = decoded.role;

            // Redirect based on role or other conditions
            navigate("/home");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error response:', error.response);
                setMsg(error.response.data.msg);
            } else {
                console.error('Error message:', error.message);
                setMsg('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <section className="bg-gray-200 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="text-center mb-6">
                        <img src="controltower.png" alt="logo" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-red-500">{msg}</p>
                    </div>
                    <form onSubmit={Auth}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email or Username</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg mt-2"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                className="w-full p-3 border rounded-lg mt-2"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-6">
                            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">Login</button>
                        </div>
                        <p className='mt-6 text-gray-800 text-center'>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500 hover:underline">Create account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
