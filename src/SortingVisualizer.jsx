import React from 'react';
import './SortingVisualizer.css';
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

export default class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            array: [],
            numberOfBars: 10,
            barWidth: 20,
            delay: 30,
        };

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
        console.log(this.state.numberOfBars, MAX_WIDTH, MAX_WIDTH);
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
        let animations = mergeSort(this.state.array);
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
      }

    quickSort() {
        let animations = quickSort(this.state.array);

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

    }

    bubbleSort() {
        let animations = bubbleSort(this.state.array);

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
                }, i * this.state.delay * 0.5);

            } else if(type === 'S') {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.height = `${barTwoIdx}px`;
                }, i * this.state.delay * 0.5);
            } else {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = FINAL_COLOR;
                }, i * this.state.delay * 0.5);
            }
        }
    }

    render() {
        const {array} = this.state;

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
                                        value={this.state.numberOfBars}
                                        onChange={this.handleSliderChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='algo-options'>
                        <div className='algorithms'>
                            ALGORITHMS
                        </div>
                        <div className='colors'>
                            COLORS
                        </div>
                    </div>
                    <div className='visualize-button'>
                    <button className='glowing-btn'>
                        <span className='glowing-txt'>V<span className='faulty-letter'>I</span>SU<span className='faulty-letter'>A</span>LIZ<span className='faulty-letter'>E</span></span>
                    </button>
                    </div>
                </div>
                <div className='array-container'>
                    <div className='array-bar-container'>
                        {
                            array.map((val, idx) => (
                                <div className="array-bar" key={idx} style={{height: `${val}px`, width: `${this.state.barWidth}px`, backgroundColor: 'white'}} />
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
