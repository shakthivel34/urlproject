import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { auth } from './firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import './style/login.css';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
//import imrt_logo from './imarticusmoblogo.png';

const Login = () => {
  const [phone, setPhone] = useState('+91');
  const [hasFilled, setHasFilled] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate=useNavigate();
   const handleClick=()=>navigate('/home')

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      }
    }, auth);
  }

  const handleSend = () => {
    if (phone.trim().length !== 13) {
      alert('Please enter a valid phone number');
      return;
    }

    setHasFilled(true);
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
      }).catch((error) => {
        // Error; SMS not sent
        console.log(error);
      });
  }

  const verifyOtp = (event) => {
    let otp = event.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        let user = result.user;
        console.log(user);
        alert('User signed in successfully');
      }).catch((error) => {
        alert('User couldn\'t sign in (bad verification code?)');
      });
    }
  }
  const handleVerify = () => {
    let confirmationResult = window.confirmationResult;
    confirmationResult.confirm(otp).then((result) => {
      let user = result.user;
      console.log(user);
      alert('User signed in successfully');
    }).catch((error) => {
      alert('User couldn\'t sign in (bad verification code?)');
    });
  }

  const handlecombineClick=()=>{
    handleVerify();
    handleClick();
  }
  return (
    <div className='ap'>
      <div id='logo'>
        {/* <img src={imrt_logo} alt="imarticus_logo" /> */}
      </div>

      

      {hasFilled ? (
        <>
        <div id='sign_in'>
        <h2 className='Enterotp' >Enter the OTP</h2>
      </div>
        

<TextField
          sx={{
            width: '240px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // Border color
              },
            },
            '& label.Mui-focused': {
              color: 'white', // Label color when focused
            },
            '& label': {
              color: 'white', // Default label color
            },
          }}
          variant='outlined'
          label='OTP'
          value={otp}
         onChange={verifyOtp}
         inputProps={{
          style: {
            color: 'white', // Change to the color you want for the text
          },
        }}
        />
        <button className='verify'
            onClick={handlecombineClick}
            variant='contained'
            sx={{ width: '240px', marginTop: '20px' }}
          >
            {'Verify OTP'}
          </button>
        </>
        
      ) : (
        <>
         <div id='sign_in'>
        <h2 className='welcome'>Welcome to URL Shortner</h2>
      </div>
          
          <div className='icon'><PhoneIcon /></div>
          <TextField 
             sx={{
              width: '240px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', 
                },
              },
            }}
            variant='outlined'
            autoComplete='off'
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputProps={{ style: { color: 'white' } }}
            
            />
          <button className='otp'
            onClick={handleSend}
            variant='contained'
            sx={{ width: '240px', marginTop: '20px' }}
          >
            {'Get OTP'}
          </button>
        </>
      )}

      <div id="recaptcha"></div>
      
    </div>
  );
}

export default Login;

 