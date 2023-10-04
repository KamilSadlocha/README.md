import './Contact.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import  { API_URL }  from '../../env.js';

const contactData = [
  {
    img: './map.png',
    name: 'Our address',
    details: 'ul. Kota Filemona 1 11-111 Kotowo',
  },
  {
    img: './phone.png',
    name: 'Phone number',
    details: '123-456-789',
  },
  {
    img: './email.png',
    name: 'E-mail',
    details: 'readme@readme.com',
  },
];

const Contact = () => {
  const MySwal = withReactContent(Swal);

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function sendEmail() {
    try {
      const response = await fetch(`${API_URL}send-email`, {
        method: 'POST',
        body: JSON.stringify(inputs),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      console.log('Email sent successfully - frontend log');
      MySwal.fire({
        position: 'center',
        icon: 'success',
        title: 'Email sent successfully ',
        showConfirmButton: false,
        timer: 1500,
      });
      setInputs('');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  return (
    <div className="contact-container">
      {contactData.map((contact, index) => (
        <div className="contact-box" key={index}>
          <img src={contact.img} alt={contact.img} />
          <div className="contact-name">{contact.name}</div>
          <div className="contacr-details">{contact.details}</div>
        </div>
      ))}
      <div className="contact-form">
        <p>Contact Us</p>
        <div className="enter-name-container">
          <input
            type="text"
            className="enter-name"
            placeholder="Type your name..."
            name="username"
            value={inputs.username || ''}
            onChange={handleChange}
          />
        </div>
        <div className="enter-mail-container">
          <input
            type="text"
            className="enter-email"
            placeholder="Type your email..."
            name="mail"
            value={inputs.mail || ''}
            onChange={handleChange}
          />
        </div>
        <div className="enter-message-container">
          <textarea
            type="text"
            className="enter-message"
            placeholder="Type your message..."
            name="message"
            value={inputs.message || ''}
            onChange={handleChange}
          />
        </div>
        <button className="submit" onClick={sendEmail}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Contact;
