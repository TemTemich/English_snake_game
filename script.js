
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let elementSearchWord = document.getElementById("search_word");

let width = canvas.width;
let height = canvas.height;

let score = 1;
let keyPressed = 'w';
let grid = 15;

function randomLetters(listLetter){
    let words = [];
    for (let i=0; i < 3; i++) {
        let letter = listLetter[Math.floor(Math.random()*listLetter.length)];     
        while (words.indexOf(letter) != -1){
            let letter = listLetter[Math.floor(Math.random()*listLetter.length)];     
        }
        words.push(letter)  
    }
    return words;
}

function randomInteger(min, max){
    let rand = min - 0.5 + Math.random() * (max-min + 1);
    return Math.round(rand);
}

document.addEventListener('keydown', function(event){
    if (event.key == 'd'){
        keyPressed = 'd';
    } else if (event.key == 'a'){
        keyPressed = 'a';
    } else if (event.key == 'w'){
        keyPressed = 'w';
    } else if (event.key == 's'){
        keyPressed = 's';
    }
});

function makeApple(width, height, letter, color){
    return{
        x: randomInteger(1, 19) * 15,
        y: randomInteger(1, 9) * 15,
        w: width,
        h: height,
        word: letter,
        color: color
    }    
}

function startGame(){
    let letters = "abcdefghijklmnopqrstuvwxyz".split('')

    let dict = {
        "яблоко":"apple",
        "клиент":"client",
        "семья":"family",
        "кролик":"rabbit",
        "корова":"cow",
        "собака":"dog",
        
    }


    let listKeys = Object.keys(dict);
    let userWord = listKeys[Math.floor(Math.random()*listKeys.length)];
    let engWord = dict[userWord].split('');
    elementSearchWord.textContent += userWord;
    console.log("Слово на английском: ", engWord)
    console.log("Слово на русском: ", userWord)

    // Уберем совпадение слов двух список

    for (let i=0; i<dict[userWord].length; i++){
        if (letters.indexOf(engWord[i]) != -1){
            letters.splice(letters.indexOf(engWord[i]), 1)
        }
    }
    let greenApple = makeApple(14, 14, engWord[0], "green");
    return [letters, engWord, userWord, listKeys, greenApple];
}
class Snake{
    constructor(x, y, color, width, height, countWords, speed){
        this.width = width;
        this.height = height;
        this.countWords = countWords;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.score = 0;
        this.tale = [];
        this.taleCount = 3;

    }
    draw(){
        ctx.beginPath();
        this.tale.forEach(function(square, index){
            ctx.fillStyle = '#fff';
            ctx.fillRect(square.x, square.y, 15-1, 15-1);
        });
        ctx.closePath();
    }
    move(key){
        if (key=='w'){
            this.y -= this.speed;
            this.x += 0;
        } else if (key=='a'){
            this.y += 0;
            this.x -= this.speed; 
        } else if (key=='s'){
            this.y += this.speed;
            this.x += 0;
        } else if (key=='d'){
            this.y += 0;
            this.x += this.speed;
        }
    }
}


let playerX = randomInteger(1, 19) * 15;
let playerY = randomInteger(1, 9) * 15;

let snake1 = new Snake(playerX, playerX, '#fff', 15, 15, 0, grid);

// Создание начала игры 
let initVariable = startGame()
let letters = initVariable[0];
let engWord = initVariable[1];
let userWord = initVariable[2];
let listKeys = initVariable[3];
let greenApple = initVariable[4];



function game(){
    if (engWord.length === 0){
        document.getElementById("search_word").textContent = "Слово на русском: "
        document.getElementById("eng_word").textContent = "На английском: "
        initVariable = startGame()
        letters = initVariable[0];
        engWord = initVariable[1];
        userWord = initVariable[2];
        listKeys = initVariable[3];
        greenApple = initVariable[4];

    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle =  "green";
    ctx.fillRect(greenApple.x, greenApple.y, greenApple.w, greenApple.h);
    ctx.fillStyle = "white";
    ctx.fillText(greenApple.word, greenApple.x + 5, greenApple.y + 9)

    snake1.draw();

    snake1.move(keyPressed);

    snake1.tale.unshift({
        x: snake1.x,
        y: snake1.y
    });
    if (snake1.tale.length > snake1.taleCount){
        snake1.tale.pop();
    }
    snake1.tale.forEach(function(square, index){
        if (square.x == greenApple.x && square.y == greenApple.y){
            console.log(document.getElementById("eng_word").textContent);
            snake1.taleCount += 1;
            greenApple.x = randomInteger(1, 19) * 15;
            greenApple.y = randomInteger(1, 9) * 15;
            document.getElementById("eng_word").textContent += engWord[0];
            engWord.splice(engWord.indexOf(greenApple.word), 1)
            console.log(engWord)
            greenApple.word = engWord[0]
        }
    });

    // При столкновении с краем переносим голову змеи в другой конец
    // Для создания эффекта телепортации
    // По оси X
    if (snake1.x < 0){
        snake1.x = width;
    }else if(snake1.x >= width){
        snake1.x = -grid;
    }

    // Тоже самое для оси Y
    if (snake1.y < 0){
        snake1.y = height;
    } else if (snake1.y >= height){
        snake1.y = -grid;
    }
}

// Запуск игры
setInterval(game, 150)
