import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./CharacterSelect.css";

const characters = [
  {
    id: 1,
    name: "Beet",
    photo: "beet.png",
    description: "BEET your opponent into submission!",
    power:
      "Powerup: Beetdown - Stuns the opponent for 30 seconds, completely disabling their controls",
  },
  {
    id: 2,
    name: "Mushroom",
    photo: "mushroomy.png",
    description: "MUSH your opponent’s chances of winning!",
    power:
      "Powerup: Shroomed - Causes the opponent to hallucinate, guaranteeing they fail their next tests",
  },
  {
    id: 3,
    name: "Cauliflower",
    photo: "cauliflower.png",
    description: "Get ready to CAULIBRATE the chaos!",
    power:
      "Powerup: CauliFlip – Inverts your opponent's code for 30 seconds, flipping their world upside down",
  },
];

function CharacterSelect() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = () => {
    setSelectedCharacter(characters[currentIndex]);
  };

  const handleNavigate = () => {
    localStorage.setItem('character', selectedCharacter.name)
    navigate('/match')
  }

  return (
    <div className="carousel-container">
      <h2></h2>
      <div className="carousel">
        <button className="nav-button left" onClick={handlePrevious}>
          &lt;
        </button>

        <div className="character-display">
          {/* Previous Character (Background, Semi-Transparent) */}
          <motion.img
            key={
              characters[
                (currentIndex - 1 + characters.length) % characters.length
              ].id
            }
            src={
              characters[
                (currentIndex - 1 + characters.length) % characters.length
              ].photo
            }
            alt="Previous Character"
            className="character-image background left"
            initial={{ opacity: 0.3, scale: 0.8, x: -100 }}
            animate={{ opacity: 0.3, scale: 0.8, x: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.5 }}
          />

          {/* Current Character (Main Focus) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={characters[currentIndex].id}
              className="character-card"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={characters[currentIndex].photo}
                alt={characters[currentIndex].name}
                className="character-image"
              />

              <h3>
                {characters[currentIndex].name}
                <span
                  className="question-mark"
                  data-tooltip={characters[currentIndex].power}
                >
                  ?
                </span>
              </h3>
              <p>{characters[currentIndex].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Next Character (Background, Semi-Transparent) */}
          <motion.img
            key={characters[(currentIndex + 1) % characters.length].id}
            src={characters[(currentIndex + 1) % characters.length].photo}
            alt="Next Character"
            className="character-image background right"
            initial={{ opacity: 0.3, scale: 0.8, x: 100 }}
            animate={{ opacity: 0.3, scale: 0.8, x: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <button className="nav-button right" onClick={handleNext}>
          &gt;
        </button>
      </div>

      <button className="select-button" onClick={handleSelect}>
        Select Character
      </button>

      {selectedCharacter && 
      <button className="play-button" onClick={handleNavigate}> 
        Match
      </button>}

      {selectedCharacter && (
        <div className="selected-character">
          <h3>Selected: {selectedCharacter.name}</h3>
        </div>
      )}
    </div>
  );
}

export { CharacterSelect };
