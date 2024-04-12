import React from "react";
import "./landing.css";
import landinggpt from "./landinggpt.jpeg";
// import Landing from '../components/Landing';

const Landing = () => {
  return (
    <div class="image-container">
      <img src={landinggpt} class="background-image" />
      <div class="text-container">
        <h1>Welcome To MedShare</h1>
        <p>Medicine On The Go!</p>
      </div>
    </div>
  );
};

export default Landing;
