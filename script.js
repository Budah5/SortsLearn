let timer;
let isSorting = false;
let currentArray = [];
let popupTimeout;

let stepMode = false;
let stepQueue = [];
let currentStepIndex = 0;

document.getElementById('generateButton').addEventListener('click', generateArray);
document.getElementById('startButton').addEventListener('click', startSorting);
document.getElementById('stopButton').addEventListener('click', stopSorting);
document.getElementById('stepButton').addEventListener('click', nextStep);
document.getElementById('startStepButton').addEventListener('click', startStepMode);
document.getElementById('speedRange').addEventListener('input', updateSpeedValue);
document.getElementById('algorithmSelect').addEventListener('change', updateAlgorithmDescription);


function generateArray() {
    const input = document.getElementById('arrayInput').value;
    currentArray = input.split(',').map(Number);
    visualizeArray(currentArray);
    isSorting = false;
    stepMode = false;
    stepQueue = [];
    currentStepIndex = 0;
}

function updateAlgorithmDescription() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const description = {
        bubbleSort: `
        <strong>Пузырьковая сортировка</strong><br>
        Многократное прохождение по массиву с попарным сравнением и обменом соседних элементов, если они идут в неправильном порядке.<br>
        Элементы «всплывают» к концу массива, как пузырьки.<br><br>
        <em>Сложность:</em> O(n²), лучшее — O(n) (если массив отсортирован).<br><br>
        <strong>Пример на JavaScript:</strong>
        <pre><code>function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}</code></pre>
    `,

        selectionSort: `
        <strong>Сортировка выбором</strong><br>
        На каждом шаге ищется минимальный элемент из неотсортированной части и перемещается в начало.<br>
        Требует меньше перестановок, но делает много сравнений.<br><br>
        <em>Сложность:</em> O(n²) всегда.<br><br>
        <strong>Пример на JavaScript:</strong>
        <pre><code>function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}</code></pre>
    `,

        insertionSort: `
        <strong>Сортировка вставками</strong><br>
        Строит отсортированную часть массива, вставляя в неё каждый следующий элемент на нужное место.<br>
        Хорошо работает на почти отсортированных массивах.<br><br>
        <em>Сложность:</em> O(n²), лучшее — O(n).<br><br>
        <strong>Пример на JavaScript:</strong>
        <pre><code>function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}</code></pre>
    `,

        shakerSort: `
        <strong>Шейкерная сортировка</strong><br>
        Двунаправленный аналог пузырьковой сортировки: сначала проходит слева направо, затем — обратно.<br>
        Это ускоряет вынос как больших, так и маленьких элементов на нужные позиции.<br><br>
        <em>Сложность:</em> O(n²), лучшее — O(n).<br><br>
        <strong>Пример на JavaScript:</strong>
        <pre><code>function shakerSort(arr) {
    let left = 0;
    let right = arr.length - 1;
    let swapped = true;

    while (swapped) {
        swapped = false;
        for (let i = left; i < right; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        right--;
        for (let i = right; i > left; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }
        left++;
    }
    return arr;
}</code></pre>
    `
    };

    document.getElementById('algorithmDescription').innerHTML = description[algorithm] || '';
}

function updateSpeedValue() {
    document.getElementById('speedValue').textContent = document.getElementById('speedRange').value;
}

function stopSorting() {
    clearTimeout(timer);
    isSorting = false;
}

function showPopupMessage(message, speed = 500) {
    const popup = document.getElementById('popupMessage');
    popup.textContent = message;

    popup.style.display = 'block';
    popup.style.animation = 'none';
    void popup.offsetWidth;
    popup.style.animation = `fadeInOut ${Math.max(speed * 1.5, 500)}ms ease-in-out`;

    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => {
        popup.style.display = 'none';
    }, Math.max(speed * 1.5, 500));
}

function highlightBars(index1, index2) {
    const bars = document.querySelectorAll('.bar');
    bars[index1]?.classList.add('highlight');
    bars[index2]?.classList.add('highlight');
    setTimeout(() => {
        bars[index1]?.classList.remove('highlight');
        bars[index2]?.classList.remove('highlight');
    }, 300);
}

function updateBarHeight(index) {
    const bars = document.querySelectorAll('.bar');
    const values = document.querySelectorAll('.barValue');
    const containerHeight = 315;
    const maxValue = Math.max(...currentArray);
    const scalingFactor = containerHeight / maxValue;
    const minHeight = 2;

    let height = currentArray[index] * scalingFactor;
    height = Math.max(minHeight, height);

    bars[index].style.height = `${height}px`;
    values[index].textContent = currentArray[index];
}



function visualizeArray(array) {
    const container = document.getElementById('arrayVisualization');
    container.innerHTML = '';
    const maxValue = Math.max(...array);
    const containerHeight = 315;
    const scalingFactor = containerHeight / maxValue;

    array.forEach((value) => {
        const barWrapper = document.createElement('div');
        barWrapper.classList.add('barWrapper');

        const valueLabel = document.createElement('div');
        valueLabel.classList.add('barValue');
        valueLabel.textContent = value;

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * scalingFactor}px`;

        barWrapper.appendChild(valueLabel);
        barWrapper.appendChild(bar);
        container.appendChild(barWrapper);
    });
}


function bubbleSort(array, speed) {
    let i = 0, j = 0;
    function step() {
        if (i >= array.length) return isSorting = false;
        if (j < array.length - i - 1) {
            highlightBars(j, j + 1);
            showPopupMessage(`Сравниваем ${array[j]} и ${array[j + 1]}`, speed);
            setTimeout(() => {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    updateBarHeight(j);
                    updateBarHeight(j + 1);
                    highlightBars(j, j + 1);
                    showPopupMessage(`Меняем местами ${array[j]} и ${array[j + 1]}`, speed);
                }
                j++;
                timer = setTimeout(step, speed);
            }, speed);
        } else {
            j = 0;
            i++;
            timer = setTimeout(step, speed);
        }
    }
    step();
}

function selectionSort(array, speed) {
    let i = 0, j = 1, minIndex = 0;
    function innerLoop() {
        if (j < array.length) {
            highlightBars(j, minIndex);
            showPopupMessage(`Сравниваем ${array[j]} и ${array[minIndex]}`, speed);
            setTimeout(() => {
                if (array[j] < array[minIndex]) minIndex = j;
                j++;
                timer = setTimeout(innerLoop, speed);
            }, speed);
        } else {
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                updateBarHeight(i);
                updateBarHeight(minIndex);
                highlightBars(i, minIndex);
                showPopupMessage(`Меняем местами ${array[i]} и ${array[minIndex]}`, speed);
            }
            i++;
            if (i < array.length - 1) {
                minIndex = i;
                j = i + 1;
                timer = setTimeout(innerLoop, speed);
            } else {
                isSorting = false;
            }
        }
    }
    innerLoop();
}

function insertionSort(array, speed) {
    let i = 1;
    function outerStep() {
        if (i >= array.length) return isSorting = false;
        let key = array[i];
        let j = i - 1;
        function innerMove() {
            if (j >= 0) {
                highlightBars(j, j + 1);
                showPopupMessage(`Сравниваем ${array[j]} и ${key}`, speed);
                setTimeout(() => {
                    if (array[j] > key) {
                        array[j + 1] = array[j];
                        updateBarHeight(j + 1);
                        highlightBars(j, j + 1);
                        showPopupMessage(`Сдвигаем ${array[j]} вправо`, speed);
                        j--;
                        timer = setTimeout(innerMove, speed);
                    } else {
                        array[j + 1] = key;
                        updateBarHeight(j + 1);
                        i++;
                        timer = setTimeout(outerStep, speed);
                    }
                }, speed);
            } else {
                array[j + 1] = key;
                updateBarHeight(j + 1);
                i++;
                timer = setTimeout(outerStep, speed);
            }
        }
        innerMove();
    }
    outerStep();
}

function shakerSort(array, speed) {
    let left = 0, right = array.length - 1, i = 0, forward = true;
    function step() {
        if (left >= right) return isSorting = false;
        if (forward) {
            if (i < right) {
                highlightBars(i, i + 1);
                showPopupMessage(`Сравниваем ${array[i]} и ${array[i + 1]}`, speed);
                setTimeout(() => {
                    if (array[i] > array[i + 1]) {
                        [array[i], array[i + 1]] = [array[i + 1], array[i]];
                        updateBarHeight(i);
                        updateBarHeight(i + 1);
                        highlightBars(i, i + 1);
                        showPopupMessage(`Меняем местами ${array[i]} и ${array[i + 1]}`, speed);
                    }
                    i++;
                    timer = setTimeout(step, speed);
                }, speed);
            } else {
                right--;
                i = right;
                forward = false;
                timer = setTimeout(step, speed);
            }
        } else {
            if (i > left) {
                highlightBars(i, i - 1);
                showPopupMessage(`Сравниваем ${array[i]} и ${array[i - 1]}`, speed);
                setTimeout(() => {
                    if (array[i] < array[i - 1]) {
                        [array[i], array[i - 1]] = [array[i - 1], array[i]];
                        updateBarHeight(i);
                        updateBarHeight(i - 1);
                        highlightBars(i, i - 1);
                        showPopupMessage(`Меняем местами ${array[i]} и ${array[i - 1]}`, speed);
                    }
                    i--;
                    timer = setTimeout(step, speed);
                }, speed);
            } else {
                left++;
                i = left;
                forward = true;
                timer = setTimeout(step, speed);
            }
        }
    }
    i = left;
    step();
}
function startSorting() {
    if (isSorting || stepMode) return;
    isSorting = true;

    const speed = 1000 - document.getElementById('speedRange').value;
    const algorithm = document.getElementById('algorithmSelect').value;
    visualizeArray(currentArray);

    switch (algorithm) {
        case 'bubbleSort':
            bubbleSort(currentArray, speed);
            break;
        case 'selectionSort':
            selectionSort(currentArray, speed);
            break;
        case 'insertionSort':
            insertionSort(currentArray, speed);
            break;
        case 'shakerSort':
            shakerSort(currentArray, speed);
            break;
    }
}


function generateSteps(algorithm) {
    const arr = currentArray.slice();
    const steps = [];
    if (algorithm === 'bubbleSort') {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                steps.push({ type: 'compare', i: j, j: j + 1 });
                if (arr[j] > arr[j + 1]) {
                    steps.push({ type: 'swap', i: j, j: j + 1 });
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    } else if (algorithm === 'selectionSort') {
        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                steps.push({ type: 'compare', i: j, j: minIndex });
                if (arr[j] < arr[minIndex]) minIndex = j;
            }
            if (minIndex !== i) {
                steps.push({ type: 'swap', i: i, j: minIndex });
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            }
        }
    } else if (algorithm === 'insertionSort') {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                steps.push({ type: 'compare', i: j, j: j + 1 });
                steps.push({ type: 'move', from: j, to: j + 1 });
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    } else if (algorithm === 'shakerSort') {
        let left = 0, right = arr.length - 1;
        while (left < right) {
            for (let i = left; i < right; i++) {
                steps.push({ type: 'compare', i: i, j: i + 1 });
                if (arr[i] > arr[i + 1]) {
                    steps.push({ type: 'swap', i: i, j: i + 1 });
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                }
            }
            right--;
            for (let i = right; i > left; i--) {
                steps.push({ type: 'compare', i: i, j: i - 1 });
                if (arr[i] < arr[i - 1]) {
                    steps.push({ type: 'swap', i: i, j: i - 1 });
                    [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                }
            }
            left++;
        }
    }
    return steps;
}

function startStepMode() {
    if (isSorting) return;
    stepMode = true;
    isSorting = false;
    stepQueue = generateSteps(document.getElementById('algorithmSelect').value);
    currentStepIndex = 0;
    visualizeArray(currentArray);
}


function nextStep() {
    if (!stepMode || currentStepIndex >= stepQueue.length) return;
    const step = stepQueue[currentStepIndex];
    const speed = 1000 - document.getElementById('speedRange').value;

    if (step.type === 'compare') {
        highlightBars(step.i, step.j);
        showPopupMessage(`Сравниваем ${currentArray[step.i]} и ${currentArray[step.j]}`, speed);
    } else if (step.type === 'swap') {
        [currentArray[step.i], currentArray[step.j]] = [currentArray[step.j], currentArray[step.i]];
        updateBarHeight(step.i);
        updateBarHeight(step.j);
        highlightBars(step.i, step.j);
        showPopupMessage(`Меняем местами ${currentArray[step.i]} и ${currentArray[step.j]}`, speed);
    } else if (step.type === 'move') {
        currentArray[step.to] = currentArray[step.from];
        updateBarHeight(step.to);
        highlightBars(step.from, step.to);
        showPopupMessage(`Сдвигаем ${currentArray[step.from]} вправо`, speed);
    }

    currentStepIndex++;
}
window.onload = () => {
    updateAlgorithmDescription();
};