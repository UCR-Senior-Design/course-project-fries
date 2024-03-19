import React from 'react';
import './landing.css';
import medshareLanding from './medshareLanding.jpeg';
import landingpage from './landingpage.jpeg';
import landingpt2 from './landingpt2.jpeg';

const Landing = () => {
  return (
    <div class="image-container">
      <img src={landingpt2} class="background-image" />
    <div class="text-container">
    <h1>Welcome To MedShare</h1>
    <p>Medicine On The Go!</p>
    </div>
    </div>
  );
}

export default Landing;

