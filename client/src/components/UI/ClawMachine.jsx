import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import backgroundImg from "../../assets/clawmachine.webp"; // Adjusted path
import clawImg from "../../assets/claw.png"; // Adjusted path

function ClawMachine() {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  // Hide the ClawMachine after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Set to false after 10 seconds
    }, 1); // 10000ms = 10 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw", // Full viewport width
        height: "100vh", // Full viewport height
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden", // Prevent scrolling
        zIndex: 9999, // Make sure it's on top of everything else
      }}
      initial={{ opacity: 1 }} // Initial opacity at 100%
      animate={{ opacity: isVisible ? 1 : 0 }} // Fade out after 10 seconds
      transition={{ duration: 1 }} // Duration of fade-out animation
    >
      {/* Moving Claw */}
      <motion.div
        style={{
          position: "absolute",
          top: "20%", // Adjust for better visual placement
          left: "50%",
          width: "150px", // Larger width for the swinging arm
          height: "15px", // Slightly larger height for the arm
          backgroundColor: "gray",
          transformOrigin: "left center",
        }}
        animate={{
          rotate: [-30, 30, -30], // Swinging motion with larger amplitude
          x: [-100, 100, -100], // Moves more to the left and right
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Claw Image */}
        <motion.img
          src={clawImg}
          alt="Claw"
          style={{
            position: "absolute",
            top: "25px", // Adjust vertical positioning
            left: "100%",
            transform: "translateX(-50%)",
            width: "100px", // Larger size for the claw relative to the screen
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default ClawMachine;
