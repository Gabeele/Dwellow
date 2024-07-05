// pages/auth.js

import { useState } from 'react';
import { app } from './firebaseConfig'; // Adjust the import path according to your file structure
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration

    const handleAuth = async (e) => {

        const auth = getAuth(app);

        e.preventDefault();
        if (isLogin) {
            // Handle login
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Logged in user:', userCredential.user);

            } catch (error) {
                console.error('Login error:', error.message);

            }
        } else {

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Registered user:', userCredential.user);

                // We would also have a verification email sent to the user here

                // API call to our backend to create a user in our database
                fetch('https://api.dwellow.ca/account', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        // Add any other user data you want to send to the backend
                        token: userCredential.user.accessToken
                    }),
                });

            } catch (error) {
                console.error('Registration error:', error.message);

            }
        }
    };

    return (
        <div>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleAuth}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </button>
        </div>
    );
};

export default App;
