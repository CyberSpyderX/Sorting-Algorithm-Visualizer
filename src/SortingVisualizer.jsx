import React from 'react';
import './SortingVisualizer.css';
import { CompactPicker } from 'react-color';

import { mergeSort, quickSort, bubbleSort } from './sortingAlgorithms';

const MIN_BARS = 10;
const MAX_BARS = 200;
const MIN_WIDTH = 4;
const MAX_WIDTH = 20;
const MIN_SPEED = 30;
const MAX_SPEED = 5;
const COMPARISON_COLOR = 'red';
const ORIGINAL_COLOR = 'white';
const FINAL_COLOR = 'lightgreen';

const SLIDER_ENABLED_COLOR_LEFT = '#00ffcc'
const SLIDER_ENABLED_COLOR_RIGHT = '#ff00ff'
const SLIDER_DISABLED_COLOR_LEFT = '#808080'
const SLIDER_DISABLED_COLOR_RIGHT = '#808080'

export default class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            array: [],
            numberOfBars: 10,
            barWidth: 20,
            delay: 30,
            showAlgorithmOptions: false,
            showColorOptions: false,
            algorithmOption: '',
            sliderBackground: 'linear-gradient(to right, #00ffcc, #ff00ff)',
            isSorting: false,
            comparisonColor: 'red',
            originalColor: 'white',
            finalColor: 'lightgreen',
            colorPicker: {
                isOpen: false,
                selectedColorKey: '',
                style: {}
            },
        };

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    
    handleSliderChange (event) {
        const value = event.target.value;
        this.setState({ numberOfBars: value }, () => {
            this.setWidth();
            this.setDelay();
            this.setArrayBarsBackgroundColor();
            this.resetArray();
        });
    };

    setArrayBarsBackgroundColor() {
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = ORIGINAL_COLOR;
        }
    }
    

    componentDidMount() {
        this.resetArray();
    }
      
    setWidth() {
        const barWidth = MAX_WIDTH - ((MAX_WIDTH - MIN_WIDTH) * (this.state.numberOfBars - MIN_BARS)) / (MAX_BARS - MIN_BARS);
        this.setState({ barWidth });
    }

    setDelay() {
        const { numberOfBars } = this.state;
        const delay = MAX_SPEED - 
          ((MAX_SPEED - MIN_SPEED) * (MAX_BARS - numberOfBars)) /
            (MAX_BARS - MIN_BARS);
        this.setState({ delay });
      }

    resetArray() {
        const array = [];
        for(let i = 0; i < this.state.numberOfBars; i++) {
            array.push(this.getRandomNumber(5, 500));
        }
        this.setState({array});
    }

    mergeSort() {

        let animations = mergeSort(this.state.array.slice());
        const arrayBars = document.getElementsByClassName('array-bar');

        console.log(this.state.array);
        for (let i = 0; i < animations.length; i++) {
          const isColorChange = i % 3 !== 2;
          if (isColorChange) {
            const [barOneIdx, barTwoIdx] = animations[i];
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;
            const color = i % 3 === 0 ? COMPARISON_COLOR : ORIGINAL_COLOR;
            setTimeout(() => {
              barOneStyle.backgroundColor = color;
              barTwoStyle.backgroundColor = color;
            }, i * this.state.delay);
          } else {
            setTimeout(() => {
              const [barOneIdx, newHeight] = animations[i];
              const barOneStyle = arrayBars[barOneIdx].style;
              barOneStyle.height = `${newHeight}px`;
            }, i * this.state.delay);
          }
        }
        setTimeout(() => {
            this.setState({ isSorting: false });
           this.changeSliderBackground('#808080','#00ffcc', ' rgb(255, 0, 255)'); 
        }, animations.length * this.state.delay);
      }

    quickSort() {
        
        let animations = quickSort(this.state.array.slice());

        for (let i = 0; i < animations.length; i++) {
            const arraybars = document.getElementsByClassName('array-bar');
            const [type, barOneIdx, barTwoIdx] = animations[i];
            if(type === 'C' || type === 'R') {
                const barOneStyle = arraybars[barOneIdx].style;
                const barTwoStyle = arraybars[barTwoIdx].style;

                const color = type === 'C' ? COMPARISON_COLOR : ORIGINAL_COLOR;

                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * this.state.delay);

            } else if(type === 'S') {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.height = `${barTwoIdx}px`;
                }, i * this.state.delay);
            } else {
                setTimeout(() => {
                    console.log(barOneIdx, barTwoIdx);
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = FINAL_COLOR;
                }, i * this.state.delay);
        }
      }
      
      
        setTimeout(() => {
            this.setState({ isSorting: false });
        this.changeSliderBackground('#808080','#00ffcc', ' rgb(255, 0, 255)'); 
        }, animations.length * this.state.delay);
    }

    bubbleSort() {

        this.setState({ algorithmOption: 'bubbleSort'});
        
        let animations = bubbleSort(this.state.array.slice());

        for (let i = 0; i < animations.length; i++) {
            const arraybars = document.getElementsByClassName('array-bar');
            const [type, barOneIdx, barTwoIdx] = animations[i];
            if(type === 'C' || type === 'R') {
                const barOneStyle = arraybars[barOneIdx].style;
                const barTwoStyle = arraybars[barTwoIdx].style;

                const color = type === 'C' ? COMPARISON_COLOR : ORIGINAL_COLOR;

                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * this.state.delay * 2);

            } else if(type === 'S') {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.height = `${barTwoIdx}px`;
                }, i * this.state.delay * 2);
            } else {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = FINAL_COLOR;
                }, i * this.state.delay * 2);
            }
        }
        
        setTimeout(() => {
            this.setState({ isSorting: false });
           this.changeSliderBackground('#808080','#00ffcc', ' rgb(255, 0, 255)'); 
        }, animations.length * this.state.delay * 2);
    }

    changeSliderBackground(initialColor, finalColor, rightColor) {
        const duration = 1000; // Duration in milliseconds
        const steps = 60; // Number of steps for the gradual change
        
        let stepCount = 0;
        const colorInterval = setInterval(() => {
          const progress = stepCount / steps;
          const newColor = `linear-gradient(to right, ${this.lerpColor(initialColor, finalColor, progress)},${rightColor})`;
          this.setState({ sliderBackground: newColor });
          stepCount++;
      
          if (stepCount >= steps) {
            clearInterval(colorInterval);
          }
        }, duration / steps);
    }
    
      lerpColor(color1, color2, progress) {

        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
          };
        
          const rgbToHex = (rgb) => {
            const componentToHex = (c) => {
              const hex = c.toString(16);
              return hex.length === 1 ? '0' + hex : hex;
            };
            return '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
          };

        const color1Rgb = hexToRgb(color1);
        const color2Rgb = hexToRgb(color2);
        // const color1Rgb = color1.match(/\d+/g).map(Number);
        // const color2Rgb = color2.match(/\d+/g).map(Number);
        console.log(color1Rgb, color2Rgb);
      
        const r = Math.round(this.lerp(color1Rgb[0], color2Rgb[0], progress));
        const g = Math.round(this.lerp(color1Rgb[1], color2Rgb[1], progress));
        const b = Math.round(this.lerp(color1Rgb[2], color2Rgb[2], progress));
      
        return `rgb(${r}, ${g}, ${b})`;
      }
      
      // Helper function to linearly interpolate between two values
    lerp(value1, value2, progress) {
        return value1 + (value2 - value1) * progress;
    }

    visualize() {
        console.log('Starting to visualize...');

        this.setState({ isSorting: true});

        this.changeSliderBackground('#00ffcc', '#808080', ' rgb(80, 80, 80)');

        if (this.state.algorithmOption === "mergeSort") {
            this.mergeSort();
        } else if (this.state.algorithmOption === "quickSort") {
            this.quickSort();
        } else if(this.state.algorithmOption === "bubbleSort") {
            this.bubbleSort();
        }
    }

    comparisonColor = '#FF0000';
    originalColor = '#00FF00';
    finalColor = '#0000FF';

    
    handleColorOptionClick(event, colorKey) {
        const { top, left, height } = event.target.getBoundingClientRect();
        
        const pickerTop = top + height + 5;
        const pickerLeft = left - 117.5;

        this.setState({ colorPicker: { isOpen: true, selectedColorKey: colorKey, style: {left: pickerLeft, top: pickerTop} }})
    }

    render() {
        const {array} = this.state;
        console.log('Rendering...');
        return (
            <div className='container'>
                <div className='title'>
                    SORTING ALGORITHMS VISUALIZER
                </div>
                <div className='options-menu'>
                    <div className='num-bars-speed'>
                        <div className='num-bars-speed-label'>
                            <label className='num-bars'>Number of Bars</label>
                        </div>
                        <div className='num-bars-speed-slider'>
                            <div className="slider-container">
                                <input
                                        className="slider"
                                        type="range"
                                        min={`${MIN_BARS}`}
                                        max={`${MAX_BARS}`}
                                        step="2"
                                        value={ this.state.numberOfBars }
                                        onChange={this.handleSliderChange}
                                        style={{ background: this.state.sliderBackground }}
                                        disabled={ this.state.isSorting }
                                />
                            </div>
                        </div>
                    </div>
                    <div className='algo-options'>
                        <div
                            className="algorithms"
                            onMouseEnter={() => this.setState({ showAlgorithmOptions: true })}
                            onMouseLeave={() => this.setState({ showAlgorithmOptions: false })}
                            >
                            {!this.state.showAlgorithmOptions ? "ALGORITHMS" : 
                                <div className='algo-options'>
                                    <div
                                        className={`algorithm-option ${this.state.algorithmOption === 'mergeSort' ? 'active' : ''}`}
                                        onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'mergeSort' }) } }
                                    >
                                        Merge Sort
                                    </div>
                                    <div
                                        className={`algorithm-option ${this.state.algorithmOption === 'quickSort' ? 'active' : ''}`}
                                        onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'quickSort' }) } }
                                    >
                                        Quick Sort
                                    </div>
                                    <div
                                        className={`algorithm-option ${this.state.algorithmOption === 'bubbleSort' ? 'active' : ''}`}
                                        onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'bubbleSort' }) } }
                                    >
                                        Bubble Sort
                                    </div>
                                </div>
                            }
                            </div>
                            <div className='colors'
                            onMouseEnter={() => this.setState({ showColorOptions: true })}
                            onMouseLeave={() => this.setState({ showColorOptions: false })}>
                                {
                                    this.state.showColorOptions ? 
                                    (
                                        <div className='color-options'>
                                            <div className="color-option"
                                                style={{ backgroundColor: this.state.comparisonColor }}
                                                onClick={(event) => this.handleColorOptionClick(event, 'comparisonColor')}
                                            />
                                            <div className="color-option"
                                                style={{ backgroundColor: this.state.originalColor }}
                                                onClick={() => this.showColorPicker('originalColor')}
                                            />
                                            <div className="color-option"
                                                style={{ backgroundColor: this.state.finalColor }}
                                                onClick={() => this.showColorPicker('finalColor')}
                                            />
                                             {
                                                this.state.colorPicker.isOpen ?
                                                <div className='color-picker' style={this.state.colorPicker.style}>
                                                    <CompactPicker
                                                        color={'red'}
                                                        onChange={(color) => this.handleColorChange(color, 'originalColor')}
                                                    />
                                                </div> : null
                                             }
                                        </div>
                                    ) : 'COLORS'

                                }
                                
                            </div>
                    </div>
                    <div className='visualize-button'>
                    <button className='glowing-btn' onClick={() => this.visualize()} disabled={this.state.isSorting}>
                        <span className='glowing-txt'>V<span className='faulty-letter'>I</span>SU<span className='faulty-letter'>A</span>LIZ<span className='faulty-letter'>E</span></span>
                    </button>
                    </div>
                </div>
                <div className='array-container'>
                    {
                        array.map((val, idx) => (
                            <div className="array-bar" key={idx} style={{height: `${val}px`, width: `${this.state.barWidth}px`, backgroundColor: 'white'}} />
                        ))
                    }
                </div>
            </div>
        )
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
