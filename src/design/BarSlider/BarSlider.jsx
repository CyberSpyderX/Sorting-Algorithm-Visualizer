import React from 'react';
import './BarSlider.css';

const BarSlider = ({ min, max, value, onChange, background, disabled }) => {
  return (
    <div className='num-bars-speed'>
        <div className='num-bars-speed-label'>
            <label className='num-bars'>Number of Bars</label>
        </div>
        <div className='num-bars-speed-slider'>
            <div className="slider-container">
                <input
                    className="slider"
                    type="range"
                    min={min}
                    max={max}
                    step="2"
                    value={value}
                    onChange={onChange}
                    style={{ background }}
                    disabled={disabled}
                />
            </div>
        </div>
    </div>
  );
};

export default BarSlider;