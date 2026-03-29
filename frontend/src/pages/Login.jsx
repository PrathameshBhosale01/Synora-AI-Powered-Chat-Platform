import { useNavigate,Link } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';


function Login() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        alert("Login failed: " + data.message);
        return;
      }
      navigate('/chat');

    }
    catch (err) {
      console.log(err);
    }
    
  }

  return (
    <div className="login">
      <div className='login-container'>
        <p>Login Page</p>
        <form onSubmit={onSubmit}>
          
          <input 
            type="text" 
            name='name' 
            value={form.name} 
            onChange={handleChange} 
            placeholder='Enter Name' 
          />
          
          
          <input 
            type="email" 
            name='email' 
            value={form.email} 
            onChange={handleChange} 
            placeholder='Enter Email' 
          />

          
          <input 
            type="password" 
            name='password' 
            value={form.password} 
            onChange={handleChange} 
            placeholder='Enter Password' 
          />

          <button type="submit" className="login-btn">Login</button>
        </form>
        <p style={{marginTop: '15px', fontSize: '14px', color: '#b0b0b0'}}>
          Don't have an account? <Link to="/register" style={{color: '#6366f1'}}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login;