import React from "react";
import teamLogo from '../assets/team-logo.png';

const Team = () => {
  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px" }} class="team-container">
      <button class="team-name">DEBRIS</button>
      <img src={teamLogo} alt="Team Logo" class="team-logo"></img>
      <div class="team-details">
        <p>Team ID: 2022ASI-043</p>
        <p>College Name: Ajay Kumar Garg Engineering College</p>
      </div>
      </div>
  );
};

export default Team;
