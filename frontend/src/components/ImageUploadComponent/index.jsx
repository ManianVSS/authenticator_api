import React, { useState } from "react";

// Define a functional component named UploadAndDisplayImage
const ImageUploadComponent = (props) => {
  // Define a state variable to store the selected image
  // const [selectedImage, setSelectedImage] = useState(null);
  // Return the JSX for rendering
  return (
    <div>
      {/* Conditionally render the selected image if it exists */}
      {props.image && (
        <div>
          {/* Display the selected image */}
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(props.image)}
          />
          <br /> <br />
          {/* Button to remove the selected image */}
          <button onClick={() => props.imgSetFunc(null)}>Remove</button>
        </div>
      )}

      <br />

      {/* Input element to select an image file */}
      <input
        type="file"
        name="myImage"
        // Event handler to capture file selection and update the state
        onChange={(event) => {
          // console.log(event.target.files[0]);
          props.imgSetFunc(event.target.files[0]); // Update the state with the selected file
        }}
      />
    </div>
  );
};

// Export the UploadAndDisplayImage component as default
export default ImageUploadComponent;
