import React from 'react';
import './landing.css';
import landing from './landing.jpeg';

const Landing = () => {
  return (
    <div class="image-container">
      <img src={landing} class="background-image" />
    <div class="text-container">
    <h1>Welcome To MedShare</h1>
    <p>Medicine On The Go!</p>
    </div>
    </div>
  );
}

export default Landing;

