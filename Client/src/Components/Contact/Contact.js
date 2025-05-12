import React from "react";
import developerPng from "./images/cutedog.png";

const Contact = () => {
  return (
    <div className="contactUs-main-container">
      <div className="contactUs-left-para">
        <h3>Let's get in touch</h3>
        <i className="fa fa-envelope"></i>
        <a className="mail-links" href="home4paws2025@gmail.com">
        home4paws2025@gmail.com
        </a>

        <i className="fa fa-instagram"></i>
        <a className="mail-links" href="https://www.instagram.com/home4paws2025/">
          @Home4Paws
        </a>

        <i className="fa fa-phone"></i>
        <a className="mail-links" href="tel:+91 8639556295">
          +91 8639556295
        </a>
      </div>
      <div className="contactUs-pic">
        <img src={developerPng} alt="Profile"/>
      </div>
    </div>
  );
};

export default Contact;
