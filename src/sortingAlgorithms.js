export const mergeSort = array => {
    let animations = []
    if(array.length <= 1) return array;
    const auxilliaryArray = array.slice();
    mergeSortHelper(array, auxilliaryArray, 0, array.length - 1, animations);
    return animations;
}

export const quickSort = array => {
    console.log(array);
    let animations = [];
    if(array.length <= 1) return array;
    quickSortHelper(array, 0, array.length - 1, animations);
    return animations;
}

export const bubbleSort = array => {
    let animations = [];
    if(array.length <= 1) return array;
    bubbleSortHelper(array, animations);
    return animations;
    
}

function bubbleSortHelper(array, animations) {
    let len = array.length;

    for ( let i = 0; i < len; i++) {
        for( let j = 0; j < len - i - 1; j++) {
            animations.push(['C', j, j + 1]);
            animations.push(['R', j, j + 1]);

            if(array[j] > array[j + 1]) {
                animations.push(['S', j, array[j + 1]]);
                animations.push(['S', j + 1, array[j]]);
                swapElements(array, j, j + 1);
            }
        }
        animations.push(['F', len - i - 1, -1]);
    }
}

function quickSortHelper(array, startIdx, endIdx, animations) {
    if(startIdx < endIdx) {
        const pivotIdx = partition(array, startIdx, endIdx, animations);
        quickSortHelper(array, startIdx, pivotIdx - 1, animations);
        quickSortHelper(array, pivotIdx + 1, endIdx, animations);
    } else if(startIdx < array.length){
        animations.push(['F', startIdx, -1]);
    }
}
function partition(array, startIdx, endIdx, animations) {
    const pivot = array[endIdx];

    let i = (startIdx - 1);

    for(let j = startIdx; j < endIdx; j++) {
        animations.push(['C', i + 1, j]);
        animations.push(['R', i + 1, j]);
        
        if(array[j] < pivot) {
            i++;
            animations.push(['S', i, array[j]]);
            animations.push(['S', j, array[i]]);
            swapElements(array, i, j);
        }
    }
    animations.push(['S', i + 1, array[endIdx]]);
    animations.push(['S', endIdx, array[i + 1]]);
    swapElements(array, i + 1, endIdx);

    animations.push(['F', i + 1, -1])
    return i + 1;
}

function swapElements(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}


function mergeSortHelper(array, auxilliaryArray, startIdx, endIdx, animations) {
    if(endIdx === startIdx) return;
    const midIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxilliaryArray, array, startIdx, midIdx, animations);
    mergeSortHelper(auxilliaryArray, array, midIdx + 1, endIdx, animations);
    doMerge(array, auxilliaryArray, startIdx, midIdx, endIdx, animations);
}

function doMerge(array, auxilliaryArray, startIdx, midIdx, endIdx, animations) {
    let  k = startIdx,
        i = startIdx,
        j = midIdx + 1;
    

    while(i <= midIdx && j <= endIdx) {
        animations.push([i, j]);
        animations.push([i, j]);
        if(auxilliaryArray[i] <= auxilliaryArray[j]) {
            animations.push([k, auxilliaryArray[i]]);
            array[k++] = auxilliaryArray[i++];
        } else {
            animations.push([k, auxilliaryArray[j]]);
            array[k++] = auxilliaryArray[j++];
        }
    }

    while(i <= midIdx) {
        animations.push([i, i]);
        animations.push([i, i]);
        animations.push([k, auxilliaryArray[i]]);
        array[k++] = auxilliaryArray[i++];
    }
    while(j <= endIdx) {
        animations.push([j, j]);
        animations.push([j, j]);
        animations.push([k, auxilliaryArray[j]]);
        array[k++] = auxilliaryArray[j++];
    }

}