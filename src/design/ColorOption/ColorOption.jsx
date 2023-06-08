import React from 'react';
import PropTypes from 'prop-types';

const ColorOption = ({ colorKey, label, backgroundColor, handleColorOptionClick }) => {
  return (
    <div className='algo-color'>
        <div className='algo-label'>{ label }</div>
        <div className="color-option"
            style={{ backgroundColor }}
            onClick={(event) => handleColorOptionClick(event, colorKey)} 
        />
    </div>
  );
};

ColorOption.propTypes = {
  handleColorOptionClick: PropTypes.func.isRequired,
};

export default ColorOption;