let gameWindow = document.querySelector('.game-window');
let road = document.querySelector('.road');
let oldRoad = document.querySelector('.road-block');
let gameWindowHeigt = parseInt(gameWindow.clientHeight);
let botCars = document.querySelectorAll('.bot-car');
let botCarsOnScreen = []; //all cars on screen

// инициализируем экран блоками дороги
function initialGenerateRoad() {
    for (let i = 0; i < 2; i++) {
        let nextRoadBlock = road.lastElementChild.cloneNode(true);
        nextRoadBlock.style.top = parseInt(road.lastElementChild.style.top) + 200 + 'px';
        road.insertBefore(nextRoadBlock, road.lastElementChild.nextSibling);
    }
}

function move() {
    let roadBlocks = gameWindow.getElementsByClassName('road-block');
    for (let i = 0; i < roadBlocks.length; i++) {
        roadBlocks[i].style.top = parseInt(roadBlocks[i].style.top) + 3 + 'px';
    }
    for (let i = 0; i < botCarsOnScreen.length; i++) {
        botCarsOnScreen[i].style.top = parseInt(botCarsOnScreen[i].style.top) + 3 + 'px';
    }
} // передвижение дороги вниз 
function newRoadBlockGenerate() {
    //генерация нового блока дороги
    let firstRoadBlock = road.firstElementChild;
    let trafficMap;

    if (parseInt(firstRoadBlock.style.top) > gameWindow.clientTop) {
        let newRoad = oldRoad.cloneNode(true); //скопировали верхний блок дороги
        newRoad.style.top = parseInt(firstRoadBlock.style.top) - 200 + 'px'; //задали ему координаты выше верхнего блока
        // newRoad.style.zindex = 95;
        road.insertBefore(newRoad, firstRoadBlock); //разместили
        trafficMap = generateTrafficMap();
        console.log('trafficMap = ' + trafficMap);
        drawNewCars(trafficMap, newRoad);
    }
}

function removeOldRoadBlock() {
    let allRoadBlocks = [];
    allRoadBlocks = Array.prototype.slice.call(document.querySelectorAll('.road-block'));

    if (allRoadBlocks.length > 4) {
        allRoadBlocks[allRoadBlocks.length-1].remove();
        removeOldCar();
    }
    // while(allRoadBlocks.length > 4) allRoadBlocks[length].remove(); 

} //удаление старых блоков

function removeOldCar() {
    // console.log('CAAR height moore . Remove '+car.style.top)
    for (let i = 0; i < botCarsOnScreen.length; i++) {
        if (parseInt(botCarsOnScreen[i].style.top) > gameWindowHeigt) {
            // console.log('CAAR height moore . Remove '+botCarsOnScreen[i])
            botCarsOnScreen[i].remove();
        }
    }
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

    //    console.log('traffic = ' + traffic);

    if (traffic) {
        function fillTraffic() {
            for (let i = 0; i < 4; i++) {
                trafficMap[i] = randomInteger(0, 2);
            }
            //            console.log('trafficMap = ' + trafficMap);
            //            console.log('arrSumm = ' + arraySum(trafficMap));
        }
        while (arraySum(trafficMap) != trafficCount) {
            fillTraffic();
        }
    }
    //    console.log('trafficMap = ' + trafficMap);
    //    console.log('trafficCount = ' + trafficCount);

    return trafficMap;
}

function drawNewCars(trafficMap, newRoad) {
    for (let i = 0; i < trafficMap.length; i++) {
        if (trafficMap[i] != 0) {
            let newBotCar = botCars[i].cloneNode(true);
            newBotCar.style.display = 'block';
            // newBotCar.style.zindex = 99;
            let randTopCoord = randomInteger(150, 280);
            let randLeftCoord = randomInteger(-20, 20);
            // newBotCar.style.top = parseInt(newBotCar.style.top) - randTopCoord + 'px';
            newBotCar.style.left = parseInt(newBotCar.style.left) + randLeftCoord + 'px';
            botCarsOnScreen.push(newBotCar);
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



initialGenerateRoad();
roadMove();
setInterval(roadMove, 20);