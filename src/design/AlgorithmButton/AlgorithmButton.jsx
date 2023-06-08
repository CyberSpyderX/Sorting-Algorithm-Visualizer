import React from 'react';
import './AlgorithmButton.css'
import PropTypes from 'prop-types';

const AlgorithmButton = ({ algorithmName, algorithmOption, handleAlgorithmOptionClick, buttonText, buttonColor}) => {
  return (
    <div 
        className={`algo-button ${algorithmOption === algorithmName ? 'active' : ''}`}
        onClick={handleAlgorithmOptionClick}
        style={{'--clr': buttonColor}}>
            <span>
                {buttonText}
            </span>
            <i></i>
    </div>
  );
};

AlgorithmButton.propTypes = {
  algorithmOption: PropTypes.string.isRequired,
  handleAlgorithmOptionClick: PropTypes.func.isRequired,
};

export default AlgorithmButton;
