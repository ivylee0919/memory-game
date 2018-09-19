/*
 * 创建一个包含所有卡片的数组
 */

const cards = document.querySelector('.deck')
const cardlist = cards.querySelectorAll('.fa'); //这里获取的是一个 NodeList

// 将 NodeList 转换为一个由类名组成的数组
let cardArray = [];
for (let item of cardlist) {
    cardArray.push(item.className);
}

// 定义一些变量名
let clickCount = 0;
let matchCount = 0;
let score = 0;
let startingTime = performance.now();

// 创建 open 数组
let open = [];

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function addNewDeck(array) {
    // 使用 docfrag 创建一个 4X4 的卡牌区域 HTML
    let myDocFrag = document.createDocumentFragment();

    // 调用函数获取洗牌后的 NodeList
    let newArray = shuffle(array);

    // 为新的 HTML 添加洗牌后的 NodeList
    for (let i = 0; i < 16; i++) {
        let newLi = document.createElement('li');
        newLi.classList.add('card');
        let newI = document.createElement('i');
        newLi.appendChild(newI);
        newI.className = newArray[i];
        myDocFrag.appendChild(newLi);
    }
    // 删除原来 deck 类中的所有子节点
    // while (cards.firstChild) {
    //     cards.removeChild(cards.firstChild);
    // }
    cards.innerHTML = "";
    // 添加洗牌后的 HTML
    cards.appendChild(myDocFrag);
}

// 计时器
let sec = -1;

function pad(val) { return val > 9 ? val : "0" + val; }
setInterval(function() {
    document.querySelector(".timer").innerHTML = pad(++sec);
}, 1000);



// 刷新页面的函数
function initPage() {
    addNewDeck(cardArray);
    startingTime = performance.now();
    clickCount = 0;
    document.querySelector('.moves').textContent = 0;
    matchCount = 0;
    open = [];
    score = 0;
    sec = -1;
    for (const star of document.querySelector(".stars").children) {
        star.classList.remove('noshow');
    }
}
// 首次打开页面重排所有牌面
initPage();


/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */



// 将卡片显示符号的函数
function showSign(card) {
    card.classList.add('show', 'open', 'animated');
    if (card.classList.contains('rubberBand')) {
        card.classList.replace('rubberBand', 'flipInY');
    } else if (card.classList.contains('wobble')) {
        card.classList.replace('wobble', 'flipInY');
    } else {
        card.classList.add('flipInY');
    }
}

// 添加卡片到 open 数组的函数
function addOpen(card) {
    if (open.length <= 1) {
        return open.push(card);
    }
}

// 将卡片锁定为 open 状态的函数
function lockOpen(card) {
    card.classList.replace('open', 'match');
    card.classList.replace('flipInY', 'rubberBand');
    card.classList.remove('show');
}

// 隐藏卡片符号
function removeSign(card) {
    card.classList.replace('open', 'wrong');
    card.classList.replace('flipInY', 'wobble');
    setTimeout(() => {
        card.classList.remove('show', 'wrong');
    }, 1000);
}


// 如果 open 数组中有两个元素，检查是否匹配
function checkOpen(open) {
    let newMatch = 0;
    if (open[0].firstChild.className === open[1].firstChild.className) {
        lockOpen(open[0]);
        lockOpen(open[1]);
        open.pop();
        open.pop();
        newMatch = 2;
    } else {
        setTimeout(() => {
            // 将两张翻开的卡片都翻回去
            removeSign(open[0]);
            removeSign(open[1]);
            // 清空 open 数组
            open.pop();
            open.pop();
        }, 200);
    }
    return newMatch;
}

// 匹配完成后的提示，用户点击确认则刷新页面
function showSuccess(finalScore) {
    const usingTime = ((performance.now() - startingTime) / 1000).toFixed(2);
    window.setTimeout(function() {
        const userChoice = confirm(`恭喜你获胜啦！\n本次最终得分是：${finalScore}！\n游戏用时： ${usingTime} 秒~\n是否再来一次？`);
        if (userChoice) {
            initPage();
        }
    }, 500);
}


// 计算得分控制星星显示
function calScore(clickCount) {
    if (clickCount < 20) {
        return 100;
    } else if (clickCount < 40) {
        const lastStar = document.querySelector(".stars").children[2];
        lastStar.classList.add('noshow');
        return 90;
    } else if (clickCount < 80) {
        const midStar = document.querySelector(".stars").children[1];
        midStar.classList.add('noshow');
        return 70;
    } else {
        const firstStar = document.querySelector(".stars").children[0];
        firstStar.classList.add('noshow');
        return 60;
    }
}



// 事件监听器
document.querySelector('.deck').addEventListener('click', function(evt) {
    if (evt.target.classList.contains('card')) {
        if (evt.target.classList.contains('open') | evt.target.classList.contains('match') | evt.target.classList.contains('wrong')) {
            return;
        }
        clickCount += 1;
        if (clickCount % 2 === 0) {
            document.querySelector('.moves').textContent = clickCount / 2;
        }
        score = calScore(clickCount);
        showSign(evt.target);
        const openNum = addOpen(evt.target);
        if (openNum === 2) {
            matchCount += checkOpen(open);
        }
        // 全部匹配完毕
        if (matchCount === 16) {
            showSuccess(score);
        }
    }
});



// 刷新页面的按钮点击事件
document.querySelector('.restart').addEventListener('click', initPage);