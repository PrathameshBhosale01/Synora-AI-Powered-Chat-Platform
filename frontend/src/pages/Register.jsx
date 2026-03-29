import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing Login CSS for consistency

function Register() {
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert("Registration failed: " + data.msg);
        return;
      }
      
      alert("Registration Successful! Please Login.");
      navigate('/login');
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="login">
      <div className='login-container'>
        <p>Create Account</p>
        <form onSubmit={onSubmit}>
          <input 
            type="text" name='name' value={form.name} 
            onChange={handleChange} placeholder='Enter Name' required 
          />
          <input 
            type="email" name='email' value={form.email} 
            onChange={handleChange} placeholder='Enter Email' required 
          />
          <input 
            type="password" name='password' value={form.password} 
            onChange={handleChange} placeholder='Enter Password' required 
          />
          <button type="submit" className="login-btn">Register</button>
        </form>
        <p style={{marginTop: '15px', fontSize: '14px', color: '#b0b0b0'}}>
          Already have an account? <Link to="/login" style={{color: '#6366f1'}}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;