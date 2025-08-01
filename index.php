<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Визуализатор сортировки</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Сортировщик</h1>

<div>
    <label for="arrayInput">Введите массив чисел через запятую:</label>
    <input type="text" id="arrayInput" value="10,9,8,7,6,5,4,3,2,1">
</div>

<div id="buttonContainer">
    <button id="generateButton">Сгенерировать</button>
    <button id="startButton">Анимация</button>
    <button id="startStepButton">Пошаговый режим</button>
    <button id="stepButton">Следующий шаг</button>
    <button id="stopButton">Стоп</button>
</div>

<div>
    <label for="algorithmSelect" >Выберите алгоритм сортировки:</label>
    <select id="algorithmSelect" >
        <option value="bubbleSort">Пузырьковая сортировка</option>
        <option value="selectionSort">Сортировка выбором</option>
        <option value="insertionSort">Сортировка вставками</option>
        <option value="shakerSort">Шейкерная сортировка</option>
    </select>
</div>

<div>
    <label for="speedRange">Скорость сортировки (мс):</label>
    <input type="range" id="speedRange" min="1" max="1000" value="500">
    <span id="speedValue">500</span>
</div>

<div id="arrayVisualization" class="array-visualization"></div>

<div id="algorithmDescription"></div>

<div id="popupMessage"></div>

<script src="script.js"></script>
</body>
</html>
