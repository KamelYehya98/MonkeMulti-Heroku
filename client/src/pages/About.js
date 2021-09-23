import React from 'react';
import './css/About.css';
import illustration from '../img/TeamIllustration.svg';

const About = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="container about-container row">
                <div className="col-12 col-md-5">
                    <h1>The Team</h1>
                    <p className="name">Imad Abou Hatab</p>
                    <p className="role">Front End</p>
                    <p className="name">Kamel Yehya</p>
                    <p className="role">Front and Back End</p>
                    <p className="name">Mostafa Harb</p>
                    <p className="role">Back End</p>
                </div>
                <div className="col-12 col-md-7">
                    <img src={illustration} alt="team illustration"/>
                </div>
            </div>
        </div>
    );
}

export default About;
