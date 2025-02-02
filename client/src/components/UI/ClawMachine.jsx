import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import backgroundImg from "../../assets/clawmachine.webp"; // Adjusted path
import ballImg from "../../assets/ball.png"; // Import the ball image
import ballImg2 from "../../assets/ball2.png"; // Import the ball image
import ballImg3 from "../../assets/ball3.png"; // Import the ball image
import knob from "../../assets/knob.png";
import copy from "../../assets/ball2copy.png";
import black from "../../assets/black.png";
import newImage from "../../assets/newImage.png"; // Import the new image to replace the ball
import './styles.css';

function ClawMachine() {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const [shouldRotateKnob, setShouldRotateKnob] = useState(false); // State to control knob rotation
  const [shouldRotateBack, setShouldRotateBack] = useState(false); // State to control knob rotating back
  const [shouldShake, setShouldShake] = useState(false); // State to control ball shaking
  const [shouldShrink, setShouldShrink] = useState(false); // State to control ball shrinking
  const [shouldOpacity, setShouldOpacity] = useState(false);
  const [shouldOpacity2, setShouldOpacity2] = useState(false);
  const [shouldExpand, setShouldExpand] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const [hasUserInteracted, setHasUserInteracted] = useState(false); 
  
  const knobSound = useRef(null);
  
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, [hasUserInteracted]);

  // Hide the ClawMachine after 10 seconds
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false); // Set to false after 10 seconds
    }, 100000000000);

    return () => clearTimeout(hideTimer); // Cleanup timer on unmount
  }, [hasUserInteracted]);

  // Rotate the knob 180 degrees after 1 second
  useEffect(() => {
    const rotateTimer = setTimeout(() => {
      setShouldRotateKnob(true); // Start rotating the knob after 1 second
      if(hasUserInteracted) knobSound.current.play();
    }, 1000); // 1000ms = 1 second

    return () => clearTimeout(rotateTimer); // Cleanup timer on unmount
  }, []);

  // Rotate the knob back 180 degrees after the first rotation finishes (1 second later)
  useEffect(() => {
    const rotateBackTimer = setTimeout(() => {
      setShouldRotateBack(true); // Start rotating back after 2 seconds (1 second for first rotation + 1 second delay)
    }, 2000); // 2000ms = 2 seconds

    return () => clearTimeout(rotateBackTimer); // Cleanup timer on unmount
  }, []);

  // Start shaking the balls after the knob finishes rotating back (1 second after rotating back starts)
  useEffect(() => {
    const shakeTimer = setTimeout(() => {
      setShouldShake(true); // Start shaking after 3 seconds (1 second for first rotation + 1 second for rotating back + 1 second delay)
    }, 2500); // 3000ms = 3 seconds

    return () => clearTimeout(shakeTimer); // Cleanup timer on unmount
  }, []);

  // Start shrinking ball2 after shaking finishes (3 seconds after shaking starts)
  useEffect(() => {
    const shrinkTimer = setTimeout(() => {
      setShouldShrink(true); // Start shrinking after 6 seconds (1 second for first rotation + 1 second for rotating back + 1 second delay + 3 seconds shaking)
    }, 5000); // 6000ms = 6 seconds

    return () => clearTimeout(shrinkTimer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    const opacityTimer = setTimeout(() => {
      setShouldOpacity(true); // Start rotating the knob after 1 second
    }, 6000); // 1000ms = 1 second

    return () => clearTimeout(opacityTimer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    const opacityTimer2 = setTimeout(() => {
      setShouldOpacity2(true); // Start rotating the knob after 1 second
    }, 7000); // 1000ms = 1 second

    return () => clearTimeout(opacityTimer2); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    const expandTimer = setTimeout(() => {
      setShouldExpand(true); // Start shrinking after 6 seconds (1 second for first rotation + 1 second for rotating back + 1 second delay + 3 seconds shaking)
    }, 7000); // 6000ms = 6 seconds

    return () => clearTimeout(expandTimer); // Cleanup timer on unmount
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
      <audio ref={knobSound} src="/assets/sounds/trim1.mp3" preload="auto" />

      {/* Ball Image 1 */}
      <motion.img
        src={ballImg}
        alt="Ball 1"
        style={{
          position: "absolute",
          top: "28%", // Center vertically
          left: "54%", // Center horizontally
          width: "180px", // Adjust size as needed
        }}
        animate={{
          x: shouldShake ? [0, -20, 20, -20, 20, 0] : 0, // Shake left and right
        }}
        transition={{
          duration: 0.5, // Duration of each shake
          repeat: shouldShake ? 3 : 0, // Repeat 3 times (for 3 seconds)
          ease: "easeInOut",
        }}
      />

      {/* Ball Image 2 */}
      <motion.img
        src={ballImg2}
        alt="Ball 2"
        style={{
          position: "absolute",
          top: "35%", // Position slightly above the center
          left: "45%", // Position to the left of the center
          transform: "translate(-50%, -50%)", // Center the image precisely
          width: "220px", // Adjust size as needed
          rotate: 45,
        }}
        animate={{
          x: shouldShake ? [0, -20, 20, -20, 20, 0] : 0, // Shake left and right
          scale: shouldShrink ? 0 : 1, // Shrink to 0 if shouldShrink is true
          top: shouldShrink ? "42%" : "35%", // Move to the middle of the screen
          left: shouldShrink ? "43%" : "45%", // Move to the middle of the screen
        }}
        transition={{
          duration: 0.5, // Duration of each shake
          repeat: shouldShake ? 3 : 0, // Repeat 3 times (for 3 seconds)
          ease: "easeInOut",
          scale: {
            duration: 1, // Duration of the shrink animation
            ease: "easeInOut",
          },
          top: {
            duration: 1, // Duration of the move animation
            ease: "easeInOut",
          },
          left: {
            duration: 1, // Duration of the move animation
            ease: "easeInOut",
          },
        }}
      />

      {/* Ball Image 3 */}
      <motion.img
        src={ballImg3}
        alt="Ball 3"
        style={{
          position: "absolute",
          top: "29%", // Position slightly below the center
          left: "35%", // Center horizontally
          width: "160px", // Adjust size as needed
        }}
        animate={{
          x: shouldShake ? [0, -20, 20, -20, 20, 0] : 0, // Shake left and right
        }}
        transition={{
          duration: 0.5, // Duration of each shake
          repeat: shouldShake ? 3 : 0, // Repeat 3 times (for 3 seconds)
          ease: "easeInOut",
        }}
      />

      {/* Ball copy */}
<a href="/login">
  <motion.img
    src={isHovered ? newImage : copy} // Toggle between the two images based on hover state
    alt="Ball 2 copy"
    style={{
      position: "absolute",
      top: "84%", // Position slightly below the center
      left: "32%", // Center horizontally
      width: "110px", // Adjust size as needed
      zIndex: 9999,
      cursor: "pointer", // Add a pointer cursor to indicate it's clickable
    }}
    animate={{
      opacity: shouldOpacity ? 100 : 0,
      scale: shouldExpand ? 3 : 1,
      top: shouldExpand ? "45%" : "84%", // Move to the middle of the screen
      left: shouldExpand ? "45%" : "32%", // Move to the middle of the screen
    }}
    onMouseEnter={() => setIsHovered(true)} // Set hover state to true
    onMouseLeave={() => setIsHovered(false)} // Set hover state to false
  />
</a>

<style>
  {`
    @font-face {
      font-family: 'Born2bSportyFS';
      src: url('/assets/Born2bSportyFS.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `}
</style>

      {/* Textbox beneath the newImage */}
      {(
        // <motion.div
        //   style={{
        //     position: "absolute",
        //     top: "68%", // Position beneath the expanded ball
        //     left: "50%",
        //     transform: "translateX(-50%)", // Center horizontally
        //     color: "#153A1c", // White text
        //     fontSize: "20px", // Adjust font size as needed
        //     fontWeight: "bold", // Bold text
        //     textAlign: "center", // Center the text
        //     padding: "10px 20px", // Add padding
        //     borderRadius: "10px", // Rounded corners
        //     zIndex: 10000, // Ensure it's above everything else
        //     fontFamily: "'Born2bSportyFS', sans-serif",
        //   }}
        //   initial={{ opacity: 0 }} // Start invisible
        //   animate={{ opacity: shouldOpacity2 ? 100 : 0, }} // Fade in
        //   transition={{ duration: 0.5 }} // Smooth fade-in
        // >
        <motion.div
  className="custom-font text-box" // Apply both classes
  initial={{ opacity: 0 }}
  animate={{ opacity: shouldOpacity2 ? 100 : 0 }}
  transition={{ duration: 0.5 }}
>
  Click me to log in!
</motion.div>
      )}

      {/* Knob */}
      <motion.img
        src={knob}
        alt="knob"
        style={{
          position: "absolute",
          top: "83%", // Position slightly below the center
          left: "58.5%", // Center horizontally
          width: "110px", // Adjust size as needed
          height: "110px",
        }}
        animate={{
          rotate: shouldRotateKnob ? (shouldRotateBack ? 0 : 180) : 0, // Rotate 180 degrees, then rotate back
        }}
        transition={{
          duration: 1, // Duration of the rotation animation
          ease: "easeInOut",
        }}
      />

      {/* black background */}
      <motion.img
        src={black}
        alt="black"
        style={{
          position: "absolute",
          width: "100vw", // Adjust size as needed
          height: "100vh",
          zIndex: 9990,
        }}
        animate={{
          opacity: shouldOpacity2 ? 100 : 0,
        }}
      />
    </motion.div>
  );
}

export default ClawMachine;