// import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/Login.css';
const API_BASE_URL = 'http://localhost:5000/api/auth'; // update this if port is different

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();  // For page navigation

   useEffect(() => {
    /* Initialize Google Identity Services */
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,  // Replace this!
      callback: handleGoogleLoginSuccess,
    });

    /* Render the Google Sign-In button */
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    );

    /* Optional: prompt user automatically */
    // window.google.accounts.id.prompt();
  }, []);
  
// Handle Google Sign-In success
  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential; // THIS is the ID token JWT

    if (!token) {
      console.error('No credential token found in Google login response!');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/google-login`, { token });
      console.log('Backend response:', res.data);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        navigate('/Dashboard');
      } else {
        console.error('Google login failed:', res.data.message);
      }
    } catch (error) {
      console.error('Google login failed:', error.response?.data?.message || error.message);
    }
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = () => {
    console.error('Google login failed');
  };

  // Handle manual login and OTP verification
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!isOtpSent) {
      try {
        // Step 1: Authenticate the user with email & password
        const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
        console.log(res.data.message);
  
        // Step 2: Send OTP to the authenticated user's email
        await axios.post(`${API_BASE_URL}/send-otp`, { email }); // Assuming this route sends OTP
        console.log('OTP sent to user email');
  
        setIsOtpSent(true); // Now show OTP input field
      } catch (err) {
        console.error(err.response?.data?.message || 'Login failed or OTP not sent');
      }
    } else {
      try {
        // Step 3: Verify the OTP
        const res = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
        console.log('OTP Verified:', res.data.message);

        // Save the token
        localStorage.setItem('token', res.data.token);

        
        // Step 4: Redirect to Dashboard after successful OTP verification
        navigate('/Dashboard'); // Redirect to dashboard
      } catch (err) {
        console.error(err.response?.data?.message || 'OTP verification failed');
      }
    }
  };

   // ✅ Navigate to admin login
   const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="pageBackground">
    <div className="login-container">
      <h2>Login</h2>

      {/* Google Login */}
    <div id="google-signin-btn"></div>


      {/* ✅ Admin Login Button */}
      <button className="admin-login-button" onClick={handleAdminLogin}>
        Admin Login
      </button>

      {/* Manual Login & OTP */}
      <form onSubmit={handleLogin}>
        {!isOtpSent && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        <button type="submit">{isOtpSent ? 'Verify OTP' : 'Login'}</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  </div>
  );
};

export default Login;