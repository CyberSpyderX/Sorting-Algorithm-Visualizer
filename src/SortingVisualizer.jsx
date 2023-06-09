import React from 'react';
import './SortingVisualizer.css';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { MIN_BARS, MAX_BARS, MIN_WIDTH, MAX_WIDTH, MIN_SPEED, MAX_SPEED, defaultColorPicker} from './constants';
import { mergeSort, quickSort, bubbleSort } from './sortingAlgorithms';
import { lerpColor } from './utilityFunctions';
import BarSlider from './design/BarSlider/BarSlider';
import ColorOption from './design/ColorOption/ColorOption';
import AlgorithmButton from './design/AlgorithmButton/AlgorithmButton';

class SortingVisualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status: {
                showAlgorithmOptions: false,
                showColorOptions: false,
                isSorting: false,
            },
            arrayConfiguration: {
                array: [],
                numberOfBars: 10,
                barWidth: 20,
                delay: 30,
            },
            algorithmOption: '',
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
            otherColors: {
                glowBorderColor: '#61efff',
                algorithmLabelColor: 'white',
                sliderBackground: 'linear-gradient(to right, #00ffcc, #ff00ff)',
            },
        };

        this.handleSliderChange = this.handleSliderChange.bind(this);
    }
    
    componentDidMount() {
        this.resetArray(MIN_BARS);
    }

    handleSliderChange (event) {
        const { arrayConfiguration } = this.state;
        const value = event.target.value;
        this.setState({ arrayConfiguration: { ...arrayConfiguration, numberOfBars: value} }, () => {
            this.props.resetMetrics();
            this.resetArray(value);
        });
    };

    setArrayBarsBackgroundColor() {
        const { originalColor } = this.state.algorithmColors;
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = originalColor;
        }
    }

    resetArray(numberOfBars) {
        const array = [];
        for(let i = 0; i < numberOfBars; i++) {
            array.push(this.getRandomNumber(5, 500));
        }

        const barWidth = MAX_WIDTH - ((MAX_WIDTH - MIN_WIDTH) * (numberOfBars - MIN_BARS)) / (MAX_BARS - MIN_BARS);
        const delay = MAX_SPEED - ((MAX_SPEED - MIN_SPEED) * (MAX_BARS - numberOfBars)) / (MAX_BARS - MIN_BARS);
        this.setState({ arrayConfiguration: { array, barWidth, delay, numberOfBars }}, () => {
            this.setArrayBarsBackgroundColor();
        });
    }

    updateAccessesAndComparisons(metrics, length, delay) {
        console.log('Metrics: ', metrics);
        let accesses = 0;
        const accessesInterval = setInterval(() => {
            if (accesses < metrics[0]) {
                this.props.updateAccesses(1);
                accesses++;
            } else {
                clearInterval(accessesInterval);
            }
        }, (length * delay) / metrics[0]);
        
        let comparisons = 0;
        const comparisonsInterval = setInterval(() => {
            if (comparisons < metrics[1]) {
                this.props.updateComparisons(1);
                comparisons++;
            } else {
                clearInterval(comparisonsInterval);
            }
        }, (length * delay) / metrics[1]);
    }

    executeAnimations(animations, newArray, delayFactor) {
        const { algorithmColors, arrayConfiguration, status } = this.state;
        const { delay } = arrayConfiguration;

        const { comparisonColor, originalColor, finalColor } = algorithmColors;

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
                }, i * delay * delayFactor);

            } else if(type === 'S') {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.height = `${barTwoIdx}px`;
                }, i * delay * delayFactor);
            } else {
                setTimeout(() => {
                    const barOneStyle = arraybars[barOneIdx].style;
                    barOneStyle.backgroundColor = finalColor;
                }, i * delay * delayFactor);
            }
        }
        
        setTimeout(() => {
           this.setState({ arrayConfiguration: { ...arrayConfiguration, array: newArray}, status: { ...status, isSorting: false}});
           this.handleColorChanges('glowBorderColor', '#ff0000', '#61efff');
            setTimeout(() => {
                this.handleColorChanges('sliderBackground', '#808080', '#ff00ff', 'linear-gradient(to right, #404040, ', ')', 500)
                setTimeout(() => {
                    this.handleColorChanges('sliderBackground', '#404040', '#00ffcc', 'linear-gradient(to right, ', ', #ff00ff)', 500);
                }, 500);
            }, 1000);
        }, animations.length * delay * delayFactor);

    }

    handleColorChanges = (component, initialColor, finalColor, leftString='', rightString='', duration = 1000, changeLabelColor = false) => {
        const { otherColors } = this.state;
        console.log('Changing color for... ', component);
        const steps = 60;
        let stepCount = 0;

        const colorInterval = setInterval(() => {
            const progress = stepCount / steps;
            const newColor = leftString + `${lerpColor(initialColor, finalColor, progress)}` + rightString;
            let newColorObject = { [component]: newColor };

            if(component === 'glowBorderColor' && changeLabelColor) {
                if(initialColor === '#61efff')
                    newColorObject = { [component]: newColor, algorithmLabelColor: `${lerpColor('#ffffff', '#ff0000', progress)}` };
                else
                    newColorObject = { [component]: newColor, algorithmLabelColor: `${lerpColor('#ff0000', '#ffffff', progress)}` };
            }
            this.setState({ otherColors: { ...otherColors, ...newColorObject } });
            stepCount++;

            if(stepCount >= steps) { clearInterval(colorInterval) }
            
        }, duration / steps);
    }

    visualize() {
        const { algorithmOption, status } = this.state;
        const { array, delay } = this.state.arrayConfiguration;

        if(algorithmOption === '') {
            this.handleColorChanges('glowBorderColor', '#61efff', '#ff0000', '', '', 1000, true);
            this.setState({ status: { ...status, isSorting: true }});
            setTimeout(() => {
                this.handleColorChanges('glowBorderColor', '#ff0000', '#61efff', '', '', 1000, true);
                this.setState({ status: { ...status, isSorting: false }});
            }, 2000);
            return;
        }

        this.props.resetMetrics();
        this.setState({ status: { ...status, isSorting: true}});
        this.handleColorChanges('glowBorderColor', '#61efff', '#ff0000');
        setTimeout(() => {
            this.handleColorChanges('sliderBackground', '#ff00ff', '#808080', 'linear-gradient(to right, #00ffcc, ', ')', 500);
            setTimeout(() => {
                this.handleColorChanges('sliderBackground', '#00ffcc', '#404040', 'linear-gradient(to right, ', ', #808080)', 500);
            }, 500);
        }, 1000);

        let newArray = array.slice();
        let animations = [], metrics = [];

        if (algorithmOption === "mergeSort") {
            const { animations: mergeSortAnimations, metrics: mergeSortMetrics } = mergeSort(newArray);
            animations = mergeSortAnimations;
            metrics = mergeSortMetrics;
        } else if (algorithmOption === "quickSort") {
            const { animations: quickSortAnimations, metrics: quickSortMetrics } = quickSort(newArray);
            animations = quickSortAnimations;
            metrics = quickSortMetrics;
        } else if (algorithmOption === "bubbleSort") {
            const { animations: bubbleSortAnimations, metrics: bubbleSortMetrics } = bubbleSort(newArray);
            animations = bubbleSortAnimations;
            metrics = bubbleSortMetrics;
        }
        
        
        this.updateAccessesAndComparisons(metrics, animations.length, delay);
        this.executeAnimations(animations, newArray, 1);
    }
    
    handleColorOptionClick = (event, colorKey) => {
        if(this.state.status.isSorting)
            return;

        const { top, left, height } = event.target.getBoundingClientRect();
        
        const pickerTop = top + height + 5;
        const pickerLeft = left - 117.5;

        this.setState({ colorPicker: { isOpen: true, selectedColorKey: colorKey, selectedColor: this.state.algorithmColors[colorKey], style: {left: pickerLeft, top: pickerTop} }})
    }

    
    
    handleAlgorithmColorChange(color, colorKey) {
        const { algorithmColors, status } = this.state;
        this.setState({ algorithmColors: { ...algorithmColors, [colorKey]: color }, colorPicker: {...defaultColorPicker}, status: { ...status, showColorOptions: false }});
    }

    handleAlgorithmOptionClick(algorithmOption) {
        if(!this.state.status.isSorting) { this.setState({ algorithmOption }) }
    }

    render() {
        const { status, otherColors, algorithmOption, algorithmColors, colorPicker} = this.state;
        const { array, barWidth } = this.state.arrayConfiguration;
        const { accesses, comparisons } = this.props;
        return (
            <div className='container'>
                <div className='title'>
                    SORTING ALGORITHMS VISUALIZER
                </div>
                <div className='options-menu'>
                    <BarSlider
                        min={MIN_BARS}
                        max={MAX_BARS}
                        value={this.state.arrayConfiguration.numberOfBars}
                        onChange={this.handleSliderChange}
                        background={otherColors.sliderBackground}
                        disabled={status.isSorting}
                    />
                    <div className='algo-options'>
                        <div
                            className="algorithms"
                            style={{ flex: this.state.status.showColorOptions ? 0 : 1 }}
                            onMouseEnter={() => this.setState({ status: { ...status, showAlgorithmOptions: true }})}
                            onMouseLeave={() => this.setState({ status: { ...status, showAlgorithmOptions: false }})}
                            >
                            {!status.showAlgorithmOptions ? <div style={{ color: otherColors.algorithmLabelColor }}>ALGORITHMS</div> : 
                                <div className='algo-options'>
                                    <AlgorithmButton
                                        algorithmName={'mergeSort'}
                                        algorithmOption={algorithmOption}
                                        handleAlgorithmOptionClick={ () => this.handleAlgorithmOptionClick('mergeSort') }
                                        buttonText={'Merge Sort'}
                                        buttonColor={'#FF0000'} />
                                    <AlgorithmButton
                                        algorithmName={'quickSort'}
                                        algorithmOption={algorithmOption}
                                        handleAlgorithmOptionClick={ () => this.handleAlgorithmOptionClick('quickSort') }
                                        buttonText={'Quick Sort'}
                                        buttonColor={'#FFF01F'} />
                                    <AlgorithmButton
                                        algorithmName={'bubbleSort'}
                                        algorithmOption={algorithmOption}
                                        handleAlgorithmOptionClick={ () => this.handleAlgorithmOptionClick('bubbleSort') }
                                        buttonText={'Bubble Sort'}
                                        buttonColor={'#39FF14'} />
                                </div>
                            }
                            </div>
                            <div className='colors'
                              style={{ flex: status.showAlgorithmOptions ? 0 : 1 }}
                              onMouseEnter={() => this.setState({ status: { ...status, showColorOptions: true }})}
                              onMouseLeave={() => this.setState({ status: { ...status, showColorOptions: false }, colorPicker: { ...defaultColorPicker } })}>
                                {
                                    status.showColorOptions ? 
                                    (
                                        <div className='color-options'>
                                            <ColorOption
                                                colorKey={'comparisonColor'}
                                                label={'Comparison'}
                                                backgroundColor={algorithmColors.comparisonColor}
                                                handleColorOptionClick={this.handleColorOptionClick} />
                                            <ColorOption
                                                colorKey={'originalColor'}
                                                label={'Original'}
                                                backgroundColor={algorithmColors.originalColor}
                                                handleColorOptionClick={this.handleColorOptionClick} />
                                            <ColorOption
                                                colorKey={'finalColor'}
                                                label={'Final'}
                                                backgroundColor={algorithmColors.finalColor}
                                                handleColorOptionClick={this.handleColorOptionClick} />
                                             {
                                                colorPicker.isOpen ?
                                                <div className='color-picker' style={colorPicker.style}>
                                                    <CompactPicker
                                                        color={colorPicker.selectedColor}
                                                        onChange={(color) => this.handleAlgorithmColorChange(color.hex, colorPicker.selectedColorKey)}
                                                    />
                                                </div> : null
                                             }
                                        </div>
                                    ) : 'COLORS'
                                }
                                
                            </div>
                    </div>
                    <div className='visualize-button'>
                    <button className='glowing-btn' style={{ '--glow-color': this.state.otherColors.glowBorderColor}} onClick={() => this.visualize()} disabled={status.isSorting}>
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
                            <div className="array-bar" key={idx} style={{height: `${val}px`, width: `${barWidth}px`, backgroundColor: algorithmColors.originalColor}} />
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
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(SortingVisualizer);