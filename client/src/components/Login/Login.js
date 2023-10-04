import React, { useEffect, useState } from 'react';
import MySwal from 'sweetalert2';
import './Login.css';
let loggedUser = JSON.parse(localStorage.getItem('user'));

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) =>
    !email ? 'Email cannot be empty' : !/\S+@\S+\.\S+/.test(email) ? 'Invalid email format' : '';

  const validatePassword = (password) => (!password ? 'Password cannot be empty' : '');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFormData((prevData) => ({
        ...prevData,
        emailError,
        passwordError,
      }));
    } else {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data));
          window.location.reload();
        } else {
          setErrorMessage('Invalid email or password');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Something went wrong');
      }
      setFormData({
        email: '',
        password: '',
        emailError: '',
        passwordError: '',
      });
    }
  };

  const { email, password, emailError, passwordError } = formData;

  return (
    <form className="login-form" onSubmit={handleLoginSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {emailError && <span className="error-message">{emailError}</span>}
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {passwordError && <span className="error-message">{passwordError}</span>}
      </label>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="submit-button" type="submit">
        Log In
      </button>
    </form>
  );
}

function RegisterForm({ setShowLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    emailError: '',
    passwordError: '',
    nameError: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/users`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers().catch((error) => console.error(error));
  }, []);

  const validateEmail = (email) =>
    !email ? 'Email cannot be empty' : !/\S+@\S+\.\S+/.test(email) ? 'Invalid email format' : '';

  const validatePassword = (password) =>
    !password
      ? 'Password cannot be empty'
      : !/^(?=.*[A-Za-z]{4,})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/.test(password)
      ? 'Password must contain at least 4 letters, one number, and one special character'
      : '';

  const validateName = (name) =>
    !name
      ? 'Name cannot be empty'
      : !/^[a-zA-Z\s]*$/.test(name)
      ? 'Name must contain only letters and spaces'
      : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, name } = formData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = validateName(name);

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setFormData((prevData) => ({
        ...prevData,
        emailError: 'This email is already registered',
      }));
      return;
    }

    if (emailError || passwordError || nameError) {
      setFormData((prevData) => ({
        ...prevData,
        emailError,
        passwordError,
        nameError,
      }));
    } else {
      const newUser = { name, email, password, favBooks: [], borrowBooks: [] };
      fetch('http://localhost:3000/register', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => {
          MySwal.fire('THANK YOU !', `Registration successful. You can now log in :-)`, 'success');
          setShowLogin(true);
        })
        .catch((error) => {
          console.log(error);
        });
      setFormData({
        email: '',
        password: '',
        name: '',
        emailError: '',
        passwordError: '',
        nameError: '',
      });
    }
  };

  const { email, password, name, emailError, passwordError, nameError } = formData;

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {nameError && <span className="error-message">{nameError}</span>}
        </label>
        <button className="submit-button" type="submit">
          Register
        </button>
      </form>
    </>
  );
}

function Login() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {loggedUser ? (
        <>
          <h1>Welcome {loggedUser.name}!</h1>
          <button
            className="submit-button"
            onClick={() => {
              localStorage.clear();
              loggedUser = '';
              window.location.reload();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <div className="login-container">
          <h1>{loggedUser}</h1>
          {showLogin ? (
            <>
              <h2 className="loginHeader">Sign in</h2>
              <LoginForm />
              <h5>New to README.md?</h5>
              <button className="login-change-button" onClick={() => setShowLogin(!showLogin)}>
                Register
              </button>
            </>
          ) : (
            <>
              <h2 className="loginHeader">Create account</h2>
              <RegisterForm setShowLogin={() => setShowLogin(true)} />
              <h5>Already have an account?</h5>
              <button className="login-change-button" onClick={() => setShowLogin(!showLogin)}>
                Sign in
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Login;
