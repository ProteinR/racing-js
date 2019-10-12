let gameWindow = document.querySelector('.game-window');
let oldRoad = document.querySelector('.road-block');
let gameWindowHeigt = parseInt(gameWindow.clientHeight);

// инициализируем экран блоками дороги
function initialGenerateRoad() {
    for (let i = 0; i < 2; i++) {
        let nextRoadBlock = gameWindow.lastElementChild.cloneNode(true);
        nextRoadBlock.style.top = parseInt(gameWindow.lastElementChild.style.top) + 200 + 'px';
        gameWindow.insertBefore(nextRoadBlock, gameWindow.lastElementChild.nextSibling);
    }
}

// передвигаем дорогу и генерируем новую
function roadMove() {
    // передвижение дороги вниз 
    let roadBlocks = gameWindow.getElementsByClassName('road-block');
    for (let i = 0; i < roadBlocks.length; i++) {
        roadBlocks[i].style.top = parseInt(roadBlocks[i].style.top) + 3 + 'px';
    }

    //генерация нового блока дороги
    let firstRoadBlock = gameWindow.firstElementChild;
    if (parseInt(firstRoadBlock.style.top) > gameWindow.clientTop) {
        let newRoad = firstRoadBlock.cloneNode(true); //скопировали верхний блок дороги
        newRoad.style.top = parseInt(firstRoadBlock.style.top) - 200 + 'px'; //задали ему координаты выше верхнего блока
        gameWindow.insertBefore(newRoad, firstRoadBlock); //разместили
    }


    //удаление старых блоков
    let lastRoadBlock = gameWindow.lastElementChild;
    let lastRoadBlockY = parseInt(lastRoadBlock.style.top);

    if (lastRoadBlockY > gameWindowHeigt) {
        lastRoadBlock.remove();
    }
}


initialGenerateRoad();
roadMove();
setInterval(roadMove, 15);
