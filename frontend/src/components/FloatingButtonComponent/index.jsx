import React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const FloatingButtonComponent = (props) => {
  return (
    <div style={{ marginTop: "5px", marginRight: "5px" }}>
      <label>
        <Fab color="primary" aria-label="add" onClick={props.onClickEvent}>
          <AddIcon />
        </Fab>
      </label>
    </div>
  );
};

export default FloatingButtonComponent;
