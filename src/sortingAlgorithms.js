const METRIC_ACCESSES = 0;
const METRIC_COMPARISONS = 1;

export const mergeSort = array => {
    let animations = [];
    let metrics = [0, 0];
    if(array.length <= 1) return array;
    const auxilliaryArray = array.slice();
    mergeSortHelper(array, auxilliaryArray, 0, array.length - 1, animations, metrics);
    return { animations, metrics };
}

export const quickSort = array => {
    console.log(array);
    let animations = [];
    let metrics = [0, 0];
    if(array.length <= 1) return array;
    quickSortHelper(array, 0, array.length - 1, animations, metrics);
    return { animations, metrics };
}

export const bubbleSort = array => {
    let animations = [];
    let metrics = [0, 0];
    if(array.length <= 1) return array;
    bubbleSortHelper(array, animations, metrics);
    return { animations, metrics };
    
}

function bubbleSortHelper(array, animations, metrics) {
    let len = array.length;

    for ( let i = 0; i < len; i++) {
        for( let j = 0; j < len - i - 1; j++) {
            metrics[METRIC_ACCESSES] += 2;
            metrics[METRIC_COMPARISONS] += 1;
            animations.push(['C', j, j + 1]);
            animations.push(['R', j, j + 1]);

            if(array[j] > array[j + 1]) {
                metrics[METRIC_ACCESSES] += 4;
                animations.push(['S', j, array[j + 1]]);
                animations.push(['S', j + 1, array[j]]);
                swapElements(array, j, j + 1);
            }
        }
        animations.push(['F', len - i - 1, -1]);
    }
}

function quickSortHelper(array, startIdx, endIdx, animations, metrics) {
    if(startIdx < endIdx) {
        const pivotIdx = partition(array, startIdx, endIdx, animations, metrics);
        quickSortHelper(array, startIdx, pivotIdx - 1, animations, metrics);
        quickSortHelper(array, pivotIdx + 1, endIdx, animations, metrics);
    } else if(startIdx < array.length){
        animations.push(['F', startIdx, -1]);
    }
}
function partition(array, startIdx, endIdx, animations, metrics) {
    const pivot = array[endIdx];
    metrics[METRIC_ACCESSES]++;
    
    let i = (startIdx - 1);

    for(let j = startIdx; j < endIdx; j++) {
        animations.push(['C', i + 1, j]);
        animations.push(['R', i + 1, j]);
        
        metrics[METRIC_ACCESSES]++;
        metrics[METRIC_COMPARISONS]++;

        if(array[j] < pivot) {
            i++;
            animations.push(['S', i, array[j]]);
            animations.push(['S', j, array[i]]);
            metrics[METRIC_ACCESSES] += 4;
            swapElements(array, i, j);
        }
    }

    animations.push(['S', i + 1, array[endIdx]]);
    animations.push(['S', endIdx, array[i + 1]]);
    metrics[METRIC_ACCESSES] += 4;
    swapElements(array, i + 1, endIdx);

    animations.push(['F', i + 1, -1])
    return i + 1;
}

function swapElements(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}


function mergeSortHelper(array, auxilliaryArray, startIdx, endIdx, animations, metrics) {
    if(endIdx === startIdx) return;
    const midIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxilliaryArray, array, startIdx, midIdx, animations, metrics);
    mergeSortHelper(auxilliaryArray, array, midIdx + 1, endIdx, animations, metrics);
    doMerge(array, auxilliaryArray, startIdx, midIdx, endIdx, animations, metrics);
}

function doMerge(array, auxilliaryArray, startIdx, midIdx, endIdx, animations, metrics) {
    let  k = startIdx,
        i = startIdx,
        j = midIdx + 1;
    

    while(i <= midIdx && j <= endIdx) {
        metrics[METRIC_COMPARISONS]++;
        animations.push([i, j]);
        animations.push([i, j]);
        if(auxilliaryArray[i] <= auxilliaryArray[j]) {
            animations.push([k, auxilliaryArray[i]]);
            array[k++] = auxilliaryArray[i++];
        } else {
            animations.push([k, auxilliaryArray[j]]);
            array[k++] = auxilliaryArray[j++];
        }
        metrics[METRIC_ACCESSES] += 4;
    }

    while(i <= midIdx) {
        animations.push([i, i]);
        animations.push([i, i]);
        animations.push([k, auxilliaryArray[i]]);
        array[k++] = auxilliaryArray[i++];
        metrics[METRIC_ACCESSES] += 2;
    }
    while(j <= endIdx) {
        animations.push([j, j]);
        animations.push([j, j]);
        animations.push([k, auxilliaryArray[j]]);
        array[k++] = auxilliaryArray[j++];
        metrics[METRIC_ACCESSES] += 2;
    }
}