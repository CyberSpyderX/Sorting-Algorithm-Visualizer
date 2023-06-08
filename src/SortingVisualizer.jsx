import React from 'react';
import './SortingVisualizer.css';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';

import { mergeSort, quickSort, bubbleSort } from './sortingAlgorithms';

const MIN_BARS = 10;
const MAX_BARS = 200;
const MIN_WIDTH = 4;
const MAX_WIDTH = 20;
const MIN_SPEED = 30;
const MAX_SPEED = 5;

const SLIDER_ENABLED_COLOR_LEFT = '#00ffcc'
const SLIDER_ENABLED_COLOR_RIGHT = '#ff00ff'
const SLIDER_DISABLED_COLOR_LEFT = '#808080'
const SLIDER_DISABLED_COLOR_RIGHT = '#808080'

const defaultColorPicker = {
    isOpen: false,
    selectedColorKey: '',
    selectedColor: '',
    style: {}
};

class SortingVisualizer extends React.Component {

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
            algorithmColors: {
                comparisonColor: 'red',
                originalColor: 'white',
                finalColor: 'lightgreen',
            },
            colorPicker: {
                isOpen: false,
                selectedColorKey: '',
                selectedColor: '',
                style: {}
            },
            glowBorderColor: '#61efff',
            algorithmLabelColor: 'white',
        };

        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }
    
    handleSliderChange (event) {
        const value = event.target.value;
        this.setState({ numberOfBars: value }, () => {
            this.props.resetMetrics();
            this.setWidth();
            this.setDelay();
            this.setArrayBarsBackgroundColor();
            this.resetArray();
        });
    };

    setArrayBarsBackgroundColor() {
        const { originalColor } = this.state.algorithmColors;
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = originalColor;
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
        this.setState({ array });
    }

    mergeSort() {
        const { comparisonColor, originalColor } = this.state.algorithmColors;
        let newArray = this.state.array.slice();

        let { animations, metrics } = mergeSort(newArray);
        
        console.log('Merge sort: ', metrics);
        
        let accesses = 0;
        const accessesInterval = setInterval(() => {
            if (accesses < metrics[0]) {
                this.props.updateAccesses(1);
                accesses++;
            } else {
                clearInterval(accessesInterval);
            }
        }, (animations.length * this.state.delay) / metrics[0]);
        
        let comparisons = 0;
        const comparisonsInterval = setInterval(() => {
            if (comparisons < metrics[1]) {
                this.props.updateComparisons(1);
                comparisons++;
            } else {
                clearInterval(comparisonsInterval);
            }
        }, (animations.length * this.state.delay) / metrics[1]);

        const arrayBars = document.getElementsByClassName('array-bar');

        for (let i = 0; i < animations.length; i++) {
          const isColorChange = i % 3 !== 2;
          if (isColorChange) {
            const [barOneIdx, barTwoIdx] = animations[i];
            const barOneStyle = arrayBars[barOneIdx].style;
            const barTwoStyle = arrayBars[barTwoIdx].style;
            const color = i % 3 === 0 ? comparisonColor : originalColor;
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
            this.setState({ array: newArray });
        }, animations.length * this.state.delay);
      }

    quickSort() {
        
        const { comparisonColor, originalColor, finalColor } = this.state.algorithmColors;
        let newArray = this.state.array.slice();
        let { animations, metrics } = quickSort(newArray);

        console.log('Quick sort: ', metrics);
        
        let accesses = 0;
        const accessesInterval = setInterval(() => {
            if (accesses < metrics[0]) {
                this.props.updateAccesses(1);
                accesses++;
            } else {
                clearInterval(accessesInterval);
            }
        }, (animations.length * this.state.delay) / metrics[0]);
        
        let comparisons = 0;
        const comparisonsInterval = setInterval(() => {
            if (comparisons < metrics[1]) {
                this.props.updateComparisons(1);
                comparisons++;
            } else {
                clearInterval(comparisonsInterval);
            }
        }, (animations.length * this.state.delay) / metrics[1]);
        
        for (let i = 0; i < animations.length; i++) {
            const arraybars = document.getElementsByClassName('array-bar');
            const [type, barOneIdx, barTwoIdx] = animations[i];
            if(type === 'C' || type === 'R') {
                const barOneStyle = arraybars[barOneIdx].style;
                const barTwoStyle = arraybars[barTwoIdx].style;
                const color = type === 'C' ? comparisonColor : originalColor;

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
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = finalColor;
                }, i * this.state.delay);
            }


      }
      
      
        setTimeout(() => {
            this.setState({ isSorting: false });
            this.setState({ array: newArray });
            this.changeSliderBackground('#808080','#00ffcc', ' rgb(255, 0, 255)'); 
            clearInterval(accessesInterval);
            clearInterval(comparisonsInterval);
        }, animations.length * this.state.delay);
    }

    bubbleSort() {

        const { comparisonColor, originalColor, finalColor } = this.state.algorithmColors;
        let newArray = this.state.array.slice();
        let { animations, metrics } = bubbleSort(newArray);

        console.log('Bubble sort: ', metrics);
        
        let accesses = 0;
        const accessesInterval = setInterval(() => {
            if (accesses < metrics[0]) {
                this.props.updateAccesses(1);
                accesses++;
            } else {
                clearInterval(accessesInterval);
            }
        }, (animations.length * this.state.delay * 0.5) / metrics[0]);
        
        let comparisons = 0;
        const comparisonsInterval = setInterval(() => {
            if (comparisons < metrics[1]) {
                this.props.updateComparisons(1);
                comparisons++;
            } else {
                clearInterval(comparisonsInterval);
            }
        }, (animations.length * this.state.delay * 0.5) / metrics[1]);

        for (let i = 0; i < animations.length; i++) {
            const arraybars = document.getElementsByClassName('array-bar');
            const [type, barOneIdx, barTwoIdx] = animations[i];
            if(type === 'C' || type === 'R') {
                const barOneStyle = arraybars[barOneIdx].style;
                const barTwoStyle = arraybars[barTwoIdx].style;

                const color = type === 'C' ? comparisonColor : originalColor;

                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * this.state.delay * 0.5);

            } else if(type === 'S') {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.height = `${barTwoIdx}px`;
                }, i * this.state.delay * 0.5);
            } else {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = finalColor;
                }, i * this.state.delay * 0.5);
            }
        }
        
        setTimeout(() => {
           this.setState({ isSorting: false });
           this.changeSliderBackground('#808080','#00ffcc', ' rgb(255, 0, 255)'); 
           this.setState({ array: newArray });
        }, animations.length * this.state.delay * 0.5);
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
    
    handleColorChanges(component) {
        console.log('Changing color for... ', component);
        const steps = 60;

        let leftString = '';

        if(component === 'sliderBackground') {
            const duration = 1000;
            leftString = `linear-gradient(to right, #00ffcc, `; 
            let stepCount = 0;
            
            const rightColorInterval = setInterval(() => {
                const progress = stepCount / steps;
                const newColor = leftString + `${this.lerpColor('#ff00ff', '#808080', progress)})`;
                this.setState({ sliderBackground: newColor });
                stepCount++;
            
                if (stepCount >= steps) {
                  clearInterval(rightColorInterval);
                  
                  leftString = `linear-gradient(to right, ` ;
                  stepCount = 0;
                  const leftColorInterval = setInterval(() => {
                    const progress = stepCount / steps;
                    const newColor = leftString + `${this.lerpColor('#00ffcc', '#404040', progress)}, #808080)`;
                    this.setState({ sliderBackground: newColor });
                    stepCount++;
                
                    if (stepCount >= steps) {
                      clearInterval(leftColorInterval);
                    }
                  }, duration / steps);
                }
              }, duration / steps);

        } else if(component ==='glowColor') {
            console.log('Visualize color changing...');
            const duration = 1000;
            let visStepCount = 0;
            let algoStepCount = 0;
            const visualizeColorInterval = setInterval(() => {
                console.log('Orig: ', visStepCount);
                const progress = visStepCount / steps;
                const newColor = `${this.lerpColor('#61efff', '#ff0000', progress)}`;
                this.setState({ glowBorderColor: newColor });
                visStepCount++;
                console.log('New: ', visStepCount);
            
                if (visStepCount >= steps) {
                    clearInterval(visualizeColorInterval);
                    setTimeout(() => {
                        visStepCount = 0;
                        console.log('Visualize color changing back...');
                        const newVisualizeColorInterval = setInterval(() => {
                            const progress = visStepCount / steps;
                            const newColor = `${this.lerpColor('#ff0000', '#61efff', progress)}`;
                            this.setState({ glowBorderColor: newColor });
                            visStepCount++;
                        
                            if (visStepCount >= steps) {
                                clearInterval(newVisualizeColorInterval);
                            }
                        }, duration / steps);
                    }, 1000);
                }
            }, duration / steps);

            const algorithmLabelColorInterval = setInterval(() => {
                const progress = algoStepCount / steps;
                const newColor = `${this.lerpColor('#ffffff', '#ff0000', progress)}`;
                this.setState({ algorithmLabelColor: newColor });
                algoStepCount++;

                if (algoStepCount >= steps) {
                    clearInterval(algorithmLabelColorInterval);
                    setTimeout(() => {
                        algoStepCount = 0;
                        console.log('Visualize color changing back...');
                        const newAlgorithmLabelColorInterval = setInterval(() => {
                            const progress = algoStepCount / steps;
                            const newColor = `${this.lerpColor('#ff0000', '#ffffff', progress)}`;
                            this.setState({ algorithmLabelColor: newColor });
                            algoStepCount++;
                        
                            if (algoStepCount >= steps) {
                                clearInterval(newAlgorithmLabelColorInterval);
                            }
                        }, duration / steps);
                    }, 1000);
                }
            }, duration / steps);
        }
        
        
        

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
        
        const r = Math.round(this.lerp(color1Rgb[0], color2Rgb[0], progress));
        const g = Math.round(this.lerp(color1Rgb[1], color2Rgb[1], progress));
        const b = Math.round(this.lerp(color1Rgb[2], color2Rgb[2], progress));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
      
      
    lerp(value1, value2, progress) {
        return value1 + (value2 - value1) * progress;
    }

    visualize() {
        console.log('Starting to visualize...');

        if(this.state.algorithmOption === '') {
            this.handleColorChanges('glowColor');
            return;
        }

        this.props.resetMetrics();
        this.setState({ isSorting: true});
        this.handleColorChanges('sliderBackground');

        if (this.state.algorithmOption === "mergeSort") {
            this.mergeSort();
        } else if (this.state.algorithmOption === "quickSort") {
            this.quickSort();
        } else if(this.state.algorithmOption === "bubbleSort") {
            this.bubbleSort();
        }
    }
    
    handleColorOptionClick(event, colorKey) {
        const { top, left, height } = event.target.getBoundingClientRect();
        
        const pickerTop = top + height + 5;
        const pickerLeft = left - 117.5;

        this.setState({ colorPicker: { isOpen: true, selectedColorKey: colorKey, selectedColor: this.state.algorithmColors[colorKey], style: {left: pickerLeft, top: pickerTop} }})
    }

    
    
    handleAlgorithmColorChange(color, colorKey) {
        this.setState({ algorithmColors: { ...this.state.algorithmColors, [colorKey]: color }, colorPicker: {...defaultColorPicker}, showColorOptions: false});
    }

    render() {
        const {array} = this.state;
        const { accesses, comparisons } = this.props;
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
                            {!this.state.showAlgorithmOptions ? <div style={{ color: this.state.algorithmLabelColor }}>ALGORITHMS</div> : 
                                <div className='algo-options'>
                                    <div className={`algo-button ${this.state.algorithmOption === 'mergeSort' ? 'active' : ''}`}
                                        onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'mergeSort' }) } }
                                      style={{'--clr': '#FF0000'}}><span>Merge Sort</span><i></i></div>
                                    <div className={`algo-button ${this.state.algorithmOption === 'quickSort' ? 'active' : ''}`}
                                    onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'quickSort' }) } }
                                      style={{'--clr': '#FFF01F'}}><span>Quick Sort</span><i></i></div>
                                    <div className={`algo-button ${this.state.algorithmOption === 'bubbleSort' ? 'active' : ''}`}
                                    onClick={() =>  { if( !this.state.isSorting ) this.setState({ algorithmOption: 'bubbleSort' }) } }
                                     style={{'--clr': '#39FF14'}}><span>Bubble Sort</span><i></i></div>
                                </div>
                            }
                            </div>
                            <div className='colors'
                            onMouseEnter={() => this.setState({ showColorOptions: true })}
                            onMouseLeave={() => this.setState({ showColorOptions: false, colorPicker: { ...defaultColorPicker } })}>
                                {
                                    this.state.showColorOptions ? 
                                    (
                                        <div className='color-options'>
                                            <div className='algo-color'>
                                                <div className='algo-label'>Comparison</div>
                                                <div className="color-option"
                                                    style={{ backgroundColor: this.state.algorithmColors.comparisonColor }}
                                                    onClick={(event) => { if( !this.state.isSorting ) this.handleColorOptionClick(event, 'comparisonColor')} }
                                                />
                                            </div>
                                            <div className='algo-color'>
                                                <div className='algo-label'>Original</div>
                                                <div className="color-option"
                                                    style={{ backgroundColor: this.state.algorithmColors.originalColor }}
                                                    onClick={(event) => { if( !this.state.isSorting ) this.handleColorOptionClick(event, 'originalColor')} }
                                                />
                                            </div>
                                            <div className='algo-color'>
                                                <div className='algo-label'>Final</div>
                                                <div className="color-option"
                                                    style={{ backgroundColor: this.state.algorithmColors.finalColor }}
                                                    onClick={(event) => { if( !this.state.isSorting ) this.handleColorOptionClick(event, 'finalColor')} }
                                                />
                                            </div>
                                             {
                                                this.state.colorPicker.isOpen ?
                                                <div className='color-picker' style={this.state.colorPicker.style}>
                                                    <CompactPicker
                                                        color={this.state.colorPicker.selectedColor}
                                                        onChange={(color) => this.handleAlgorithmColorChange(color.hex, this.state.colorPicker.selectedColorKey)}
                                                    />
                                                </div> : null
                                             }
                                        </div>
                                    ) : 'COLORS'
                                }
                                
                            </div>
                    </div>
                    <div className='visualize-button'>
                    <button className='glowing-btn' style={{ '--glow-color': this.state.glowBorderColor}} onClick={() => this.visualize()} disabled={this.state.isSorting}>
                        <span className='glowing-txt'>V<span className='faulty-letter'>I</span>SU<span className='faulty-letter'>A</span>LIZ<span className='faulty-letter'>E</span></span>
                    </button>
                    </div>
                </div>
                <div className='array-container'>
                    <div style={{flex: 1, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        Array Accesses: {accesses}, Comparisons: {comparisons}
                    </div>
                    <div className='array-bar-container'>
                    {
                        array.map((val, idx) => (
                            <div className="array-bar" key={idx} style={{height: `${val}px`, width: `${this.state.barWidth}px`, backgroundColor: this.state.algorithmColors.originalColor}} />
                        ))
                    }
                    </div>
                </div>
            </div>
        )
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


const mapStateToProps = (state) => ({
    accesses: state.accesses,
    comparisons: state.comparisons,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    updateAccesses: (payload) => dispatch({ type: 'UPDATE_ARRAY_ACCESSES', payload }),
    updateComparisons: (payload) => dispatch({ type: 'UPDATE_ARRAY_COMPARISONS', payload }),
    resetMetrics: () => dispatch({ type: 'RESET' }),
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(SortingVisualizer);