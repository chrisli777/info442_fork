import React from 'react';
import supabase from '../supabaseclient'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleLogin = async (e) => {  
        e.preventDefault();
        setError(null); 
        setLoading(true);
      
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email, 
          password
        });
      
        if (error || !data || !data.user) {
          setError(error?.message || 'Login failed. Please check your credentials.');
          setLoading(false);
          console.error('Error logging in:', error?.message);
          return;
        }
      
        const userId = data.user.id;
      
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
      
        if (profileError || !profile) {
          setError(profileError?.message || 'Failed to fetch user profile.');
          setLoading(false);
          return;
        }
      
        const role = profile.role;
        if (role === 'caregiver') navigate('/caregiver');
        else if (role === 'family') navigate('/family');
        else if (role === 'elder') navigate('/elder');
        else {
          setError('Invalid role');
          setLoading(false);
        }
      }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-wrapper">
          <img
            src="/logo.jpg"
            alt="Elder using tablet"
            className="image-container"
          />
          <h2 className="bold-text">Dedicated to enhancing <br />home care connections.</h2>
        </div>
      </div>

      <div className="login-right">
        <div className="logo-text">CareCircle</div>

        <form className="login-box" onSubmit={handleLogin}>
            <h2 className="login-text">Log in</h2>
            <p className="login-header">Personalized Care</p>

            <input
                type="text"
                className="input-field"
                placeholder="Enter Account Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="login-button" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </button>

            {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
