let templates = document.querySelector('.templates');
let gameWindow = document.querySelector('.game-window');
let road = document.querySelector('.road');
let oldRoad = document.querySelector('.road-block').cloneNode(true);
let gameWindowHeigt = parseInt(gameWindow.clientHeight);
let botCars = templates.querySelectorAll('.bot-car');
let userCar = document.querySelector('.user-car');
let throughtTime = 0; //cars will spawn each third road block. Each new road block generate - it increment value
let userCarSpeed = 0;
let timerForDirection;
let timerForIncSpeed;
let dtp = false;
let playGame; //timer
let scoreTimer;
let gameScore = 0;
let userName = '';
let speedInKm = 0;

// инициализируем экран блоками дороги
function initialGenerateRoad() {
    let firstInitRoadBlock = templates.querySelector('.road-block').cloneNode(true);
    firstInitRoadBlock.style.display = "block";
    road.append(firstInitRoadBlock);
    for (let i = 0; i < 2; i++) {
        newRoadBLock = templates.querySelector('.road-block').cloneNode(true);
        newRoadBLock.style.display = "block";
        newRoadBLock.style.top = parseInt(road.lastChild.style.top) + 200 + 'px';
        road.append(newRoadBLock);
    }
}

function move() {
    let roadBlocks = gameWindow.getElementsByClassName('road-block');
    let botCarsOnScreen = road.getElementsByClassName('bot-car');

    for (let i = 0; i < roadBlocks.length; i++) {
        roadBlocks[i].style.top = parseInt(roadBlocks[i].style.top) + 2 + Math.floor(userCarSpeed) + 'px';
    }
    for (let i = 0; i < botCarsOnScreen.length; i++) {
        botCarsOnScreen[i].style.top = parseInt(botCarsOnScreen[i].style.top) + 1 + Math.floor(userCarSpeed) + 'px';
        checkForDpt(userCar, botCarsOnScreen[i]);
    }
} // передвижение дороги вниз 

function newRoadBlockGenerate() {
    //генерация нового блока дороги
    let firstRoadBlock = road.firstElementChild;
    let trafficMap;

    if (parseInt(firstRoadBlock.style.top) > -150) {
        let newRoad = oldRoad.cloneNode(true); //скопировали верхний блок дороги
        newRoad.style.display = 'block';
        newRoad.style.top = parseInt(firstRoadBlock.style.top) - 200 + 'px'; //задали ему координаты выше верхнего блока
        road.insertBefore(newRoad, firstRoadBlock); //разместили

        trafficMap = generateTrafficMap();
        drawNewCars(trafficMap, newRoad);
        throughtTime++;
    }
}

function removeOldRoadBlock() {
    let lastRoadBlock = road.querySelectorAll('.road-block')[road.querySelectorAll('.road-block').length - 1];
    if (parseInt(lastRoadBlock.style.top) > parseInt(gameWindow.getBoundingClientRect().bottom)) {
        lastRoadBlock.remove();
        removeOldCar();
    }
} //удаление старых блоков

function removeOldCar() {
    botCarsOnScreen = road.getElementsByClassName('bot-car');
    for (let i = 0; i < botCarsOnScreen.length; i++) {
        if (parseInt(botCarsOnScreen[i].style.top) > gameWindowHeigt) {
            // console.log('CAAR height moore . Remove '+botCarsOnScreen[i])
            botCarsOnScreen[i].remove();
        }
    }
}

function checkForDpt(obj1, obj2) {
    if (obj1.offsetLeft <= obj2.offsetLeft + obj2.offsetWidth &&
        obj1.offsetLeft + obj1.offsetWidth >= obj2.offsetLeft &&
        obj1.offsetTop + obj1.offsetHeight >= obj2.offsetTop &&
        obj1.offsetTop <= obj2.offsetTop + obj2.offsetHeight) {
        dtp = true;
        addScoreToHistory();
        result = confirm('Try again?');
        clearInterval(playGame);
        clearInterval(scoreTimer);
        if (result) location.href = location.href;
    }
}

function addScoreToHistory() {
    let uniqueId = Math.round(new Date() / 1000); // текущая дата в секундах
    let oldResult = JSON.parse(localStorage.gameScores || "{}");
    let newResults = {
        name: userName,
        score: gameScore
    }
    oldResult[uniqueId] = newResults;
    let newResultSting = JSON.stringify(oldResult);
    localStorage.setItem('gameScores', newResultSting);
}

function startNewGame() {
    while (road.firstChild) {
        road.removeChild(road.firstChild);
    }
    testFuncStartGame();
}


function randomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function arraySum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

// генерация расположения машин в новом блоке, возвращает массив с расположением
function generateTrafficMap() {
    let traffic = randomInteger(0, 2);
    let trafficCount = randomInteger(1, 4);
    let trafficMap = [0, 0, 0, 0] //расположение машин в блоке
    let sum = 0;

    if (throughtTime % 3 != 0) return trafficMap;

    function fillTraffic() {
        for (let i = 0; i < 4; i++) {
            trafficMap[i] = randomInteger(0, 2);
        }
    }

    // if (botCarsOnScreen.count > 6) return trafficMap;
    while (arraySum(trafficMap) != trafficCount) {
        fillTraffic();
    }

    return trafficMap;
}

function drawNewCars(trafficMap, newRoad) {
    for (let i = 0; i < trafficMap.length; i++) {
        if (trafficMap[i] != 0) {
            let newBotCar = botCars[i].cloneNode(true);
            newBotCar.style.display = 'block';
            let randTopCoord = randomInteger(170, 230);
            let randLeftCoord = randomInteger(-18, 28);
            newBotCar.style.top = parseInt(newBotCar.style.top) - randTopCoord + 'px';
            newBotCar.style.left = parseInt(newBotCar.style.left) + randLeftCoord + 'px';
            road.append(newBotCar);
        }
    }
}

// передвигаем дорогу и генерируем новую
function roadMove() {
    move();
    newRoadBlockGenerate();
    removeOldRoadBlock();
}

function userCarTurn(direction, speed) {
    let n = 2; //positive - right direction, negative - left direction

    if (direction == 'left') {
        n *= -1;
        userCar.style.transform = 'rotate(' + -20 / (speed + 1) + 'deg)';
    } else {
        userCar.style.transform = 'rotate(' + 20 / (speed + 1) + 'deg)';
    }

    timerForDirection = setInterval(() => {
        if (direction == 'left') {
            if (userCar.getBoundingClientRect().left < gameWindow.getBoundingClientRect().x + 3) return;
        } else {
            if (userCar.getBoundingClientRect().right + 3 > gameWindow.getBoundingClientRect().right) return;
        }
        if (speed != 0) speed = (speed + 1) / 2;
        if (speed == 0) speed++;
        userCar.style.left = parseInt(userCar.style.left) + n * speed + 'px';
    }, 5);
}

function increaseUserCarSpeed() {
    timerForIncSpeed = setInterval(() => {
        if (speedInKm < 235) {
            userCarSpeed += 0.5;
        }
    }, 300);
}

function decreaseUserCarSpeed() {
    timerForIncSpeed = setInterval(() => {
        if (userCarSpeed > 0.2) {
            userCarSpeed -= 0.1;
        }
    }, 10);
}

document.addEventListener('keydown', function (event) {
    if (event.code == 'ArrowLeft' || event.code == 'KeyA') {
        if (!event.repeat) {
            userCarTurn('left', userCarSpeed);
        }
    }
    if (event.code == 'ArrowRight' || event.code == 'KeyD') {
        if (!event.repeat) userCarTurn('right', userCarSpeed);
    }
    if (event.code == 'ArrowDown'  || event.code == 'KeyS') {
        if (!event.repeat) {
            decreaseUserCarSpeed();
        }
        speedInKm = ((userCarSpeed * 10) + 60) * 1.25;
        range_change_event(speedInKm * 100 / 240);
    }
    if (event.code == 'ArrowUp' || event.code == 'KeyW') {
        if (!event.repeat) {
            increaseUserCarSpeed();
        }
        speedInKm = ((userCarSpeed * 10) + 60) * 1.25;
        range_change_event(speedInKm * 100 / 240);
    }
});

document.addEventListener('keyup', function (event) {
    userCar.style.transform = 'rotate(0deg)';

    clearInterval(timerForDirection);
    clearInterval(timerForIncSpeed);

    if (event.code == 'ArrowLeft') {}
    if (event.code == 'ArrowRight') {}
});

// function testFuncStartGame() {
//     initialGenerateRoad();
// }

function increseScore() {
    gameScore = gameScore + 1 + userCarSpeed;
    document.querySelector("p.current-score").innerText = parseInt(gameScore);
}

function getTopScores() {
    let oldResult = JSON.parse(localStorage.gameScores || "{}");
    sorterByScoreResults = Object.values(oldResult).sort((a, b) => a.score > b.score ? 1 : -1);
    console.log(sorterByScoreResults.slice(-3).reverse());

    return sorterByScoreResults.slice(-3).reverse();
}

function fillTopTable(topScores) {
    let table = document.querySelector('table');

    for (let row = 1; row < topScores.length + 1; row++) {
        table.rows[row].cells[1].innerText = topScores[row - 1].name;
        table.rows[row].cells[2].innerText = parseInt(topScores[row - 1].score);
    }
}

function mainGameFunction() {
    let top3 = getTopScores();
    fillTopTable(top3);
    range_change_event(30)
    initialGenerateRoad();
    roadMove();
    playGame = setInterval(roadMove, 15);
    scoreTimer = setInterval(increseScore, 1000);
}

userName = prompt("Введите ваше имя:", 'user')
userName = userName == '' || userName == null ? 'noname' : userName;
mainGameFunction();