let menu = document.querySelector(".menu");
let main = document.querySelector(".main");
let tip = document.querySelector(".tip")
let timeDisplay = document.querySelector('#time')
let testInterval;
let minutes, seconds;
let circlesDegreeArray = []
let lastClickedCircle;
let M = []
let N = []
let Q = []
let arr = []
let data = []
let minute = 1;
let uniqueDegree = [];
let uniqueClock = []
let tipDegreeSvg = []
let A = []
let P = []



let userInstance = (function () {
    var instance = new constructor;
    function constructor() {

        function handleOneMinutePast() {
            user[minute] = {}
            user[minute].wrongClicked = 0
            user[minute].wrongMouseButton = 0;
            user[minute].correctClicked = 0
            user[minute].lastClickedCircleIndex = []

        }
        return {
            data,
            handleOneMinutePast: function () {
                handleOneMinutePast();
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = constructor();
            }
            return instance;
        }
    }
})();

window.onload = () => {
    crossOutCircle()
    tipDegreeSvg = [createTipCircleSvg(uniqueDegree[0]), createTipCircleSvg(uniqueDegree[1])]
    div = document.createElement("div");
    textNode = document.createTextNode(`Вы должны последовательно слева направо просматривать строки бланка, 
    непропуская ни одной, и отмечать:`)
    div.appendChild(textNode)
    tip.appendChild(div)

    div = document.createElement("div");
    textNode = document.createTextNode(`Левым кликом мыши кольца c разрывом на ${uniqueClock[0]} часов. `)
    div.appendChild(textNode)
    tip.appendChild(div)
    tip.appendChild(tipDegreeSvg[0])

    div = document.createElement("div");
    textNode = document.createTextNode(`Правым кликом мыши кольца c разрывом на ${uniqueClock[1]} часов`)
    div.appendChild(textNode)
    tip.appendChild(div)
    tip.appendChild(tipDegreeSvg[1])

    gridGenerator()
}
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);

let user = userInstance.getInstance()
user.handleOneMinutePast()
user[1].lastClickedCircleIndex = [0]


function startTest() {
    tip.innerHTML = ""

    div = document.createElement("div")
    textNode = document.createTextNode("Л: ")
    div.appendChild(textNode)
    div.appendChild(tipDegreeSvg[0])
    tip.appendChild(div)

    div = document.createElement("div")
    textNode = document.createTextNode("П: ")
    div.appendChild(textNode)
    div.appendChild(tipDegreeSvg[1])
    tip.appendChild(div)


    startTimer(300, timeDisplay)
}
function endTest() {
    clearInterval(testInterval)
    tip.innerHTML = ""

    div = document.createElement("div")
    textNode = document.createTextNode("Правильно нажатые: ")
    div.appendChild(textNode)
    div.appendChild(createTipCircleSvg(0, true, 'green'))
    tip.appendChild(div)


    div = document.createElement("div")
    textNode = document.createTextNode("Неправильно нажатые: ")
    div.appendChild(textNode)
    div.appendChild(createTipCircleSvg(0, true, 'red'))
    tip.appendChild(div)


    div = document.createElement("div")
    textNode = document.createTextNode("Неправильно нажатые(перепутаны левая и правая кнопка): ")
    div.appendChild(textNode)
    div.appendChild(createTipCircleSvg(0, true, '#ec42f5'))
    tip.appendChild(div)


    div = document.createElement("div")
    textNode = document.createTextNode("Пропущенные : ")
    div.appendChild(textNode)
    div.appendChild(createTipCircleSvg(0, true, 'orange'))
    tip.appendChild(div)

}
function find_M_N_Q() {
    // рассчитав M N и Q для каждой минуты, сможем вычислить все формулы

    for (let i = 1; i <= 5; i++) {

        min = Math.min.apply(Math, user[i].lastClickedCircleIndex)
        max = Math.max.apply(Math, user[i].lastClickedCircleIndex)

        if (user[i].lastClickedCircleIndex.length == 1)
            min = Math.max.apply(Math, user[i - 1].lastClickedCircleIndex)


        let countOf_Q_inOneMinute = max - min
        let countOf_M_inOneMinute = 0;
        let countOf_N_inOneMinute = 0;

        for (let j = min; j <= max; j++) {
            if (circlesDegreeArray[j] == uniqueDegree[0] || circlesDegreeArray[j] == uniqueDegree[1]) {
                countOf_M_inOneMinute++;

            }
        }

        countOf_N_inOneMinute = (countOf_M_inOneMinute - user[i].correctClicked - user[i].wrongMouseButton) + user[i].wrongClicked;

        Q.push(countOf_Q_inOneMinute + 1)
        M.push(countOf_M_inOneMinute)
        N.push(countOf_N_inOneMinute);
    }

}
function crossOutCircle() {
    let degreeArray = [120, 180, 240, 270, 300, 0, 60, 90]
    let clockDirection = [13, 15, 17, 18, 19, 21, 23, 24]

    while (uniqueDegree.length < 2) {
        let r = Math.floor(Math.random() * (7 + 1));
        if (uniqueDegree.indexOf(degreeArray[r]) === -1) {
            uniqueClock.push(clockDirection[r])
            uniqueDegree.push(degreeArray[r]);
        }
    }
}
function formulas() {
    for (let i = 0; i < 5; i++) {
        A[i] = (M[i]).toFixed(2) - (N[i].toFixed(2)) / (M[i].toFixed(2))
        P[i] = (A[i].toFixed(2)) * (Q[i]).toFixed(2)
    }
    let Qt = Q.reduce((a, b) => Number(a) + Number(b), 0)
    let Nt = N.reduce((a, b) => Number(a) + Number(b), 0)
    let S = (0.54 * Qt - 2.8 * Nt) / 300
    let Pt = (P.reduce((a, b) => Number(a) + Number(b), 0)) / 5
    let Kp = ((((Number(P[0]) - Number(P[4])) / Pt) * 5) * 1)
    let At = (A.reduce((a, b) => Number(a) + Number(b), 0)) / 5
    let Ta = ((Number(A[0]) - Number(A[4])) / At) * 1
    const toFixed = (arr) => {
        let fixedArr = []
        arr.map(e => {
            fixedArr.push(e.toFixed(2))
        })
        return fixedArr
    }
    return toFixed([Qt, Nt, S, Pt, Kp, At, Ta])
}
function createTipCircleSvg(degree, forTestEnd, color) {
    var svgNS = "http://www.w3.org/2000/svg";
    // let div = document.createElement("div")
    //     div.addEventListener("click",circleClickHandler)
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("height", "25")
    svg.setAttribute("width", "25")
    let circle = document.createElementNS(svgNS, "circle")
    circle.setAttribute("cx", "13")
    circle.setAttribute("cy", "13")
    circle.setAttribute("r", "10")
    circle.setAttribute("stroke", `${color ? color : "black"}`)
    circle.setAttribute("stroke-width", "4")
    circle.setAttribute("fill", "none")
    circle.style.transform = `rotate(${degree}deg)`
    if (forTestEnd)
        circle.classList.add("tipCircle")
    else
        circle.classList.add("circle")
    svg.setAttribute("degree", degree)
    circle.setAttribute("degree", degree)
    svg.appendChild(circle)
    return svg
}
function createCircleSvg(i, degree) {

    var svgNS = "http://www.w3.org/2000/svg";
    // let div = document.createElement("div")
    //     div.addEventListener("click",circleClickHandler)
    let svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("height", "25")
    svg.setAttribute("width", "25")
    let circle = document.createElementNS(svgNS, "circle")
    circle.setAttribute("cx", "13")
    circle.setAttribute("cy", "13")
    circle.setAttribute("r", "10")
    circle.setAttribute("stroke", "black")
    circle.setAttribute("stroke-width", "4")
    circle.setAttribute("fill", "none")
    if (!degree) degree = getDegree()
    circle.style.transform = `rotate(${degree}deg)`
    circle.classList.add("circle")
    circle.addEventListener("mousedown", circleClickHandler)
    svg.addEventListener("mousedown", circleClickHandler)
    svg.classList.add("circleDiv")
    svg.setAttribute("degree", degree)
    circle.setAttribute("degree", degree)
    circle.setAttribute("status", "0")
    svg.setAttribute("index", i)
    circle.setAttribute("index", i)
    svg.appendChild(circle)

    // div.setAttribute("degree",degree)

    return svg
}
function getDegree() {
    let degreeArray = [0, 60, 90, 120, 180, 240, 270, 300]
    const degree = Math.floor(Math.random() * (7 + 1));
    circlesDegreeArray.push(degreeArray[degree])
    return degreeArray[degree]
}
function gridGenerator() {
    let main = document.querySelector(".main")
    let container = document.createElement("div")
    container.classList.add("container")


    for (let i = 0; i <= 34 * 24; i++) { // 34 24

        container.appendChild(createCircleSvg(i));
    }
    main.appendChild(container)
}
function circleClickHandler(e) {

    lastClickedCircle = e.target.attributes.index.value
    e.stopPropagation()
    if (e.target.children[0])
        e.target.children[0].setAttribute("stroke", "blue")
    e.target.setAttribute("stroke", "blue")

    for (let i = 0; i < Number(lastClickedCircle) + 1; i++) {
        main.childNodes[1].childNodes[i].childNodes[0].removeEventListener("mousedown", circleClickHandler)
        main.childNodes[1].childNodes[i].removeEventListener("mousedown", circleClickHandler)
        main.childNodes[1].childNodes[i].childNodes[0].style.opacity = "60%"
        main.childNodes[1].childNodes[i].childNodes[0].style.cursor = "auto"
        main.childNodes[1].childNodes[i].style.cursor = "auto"
        main.childNodes[1].childNodes[i].classList.remove("circleDiv")

    }

    !arr.includes(Number(e.target.attributes.index.value)) ? user[minute].lastClickedCircleIndex.push(Number(e.target.attributes.index.value)) : console.log("already exists")


    let clickedDegree = e.target.attributes.degree.value;
    if (e.button == 0 && clickedDegree == uniqueDegree[0]) {
        user[minute].correctClicked++


    }
    else if (e.button == 2 && clickedDegree == uniqueDegree[1]) {
        user[minute].correctClicked++

    }

    if (e.button == 0 && clickedDegree != uniqueDegree[0]) {
        user[minute].wrongClicked++

        if (clickedDegree == uniqueDegree[1]) {
            user[minute].wrongMouseButton++;


            if (e.target.children[0])
                e.target.children[0].setAttribute("status", "wrongBtn")
            e.target.setAttribute("status", "wrongBtn")
        }
    }
    else if (e.button == 2 && clickedDegree != uniqueDegree[1]) {
        user[minute].wrongClicked++


        if (clickedDegree == uniqueDegree[0]) {
            user[minute].wrongMouseButton++;

            if (e.target.children[0])
                e.target.children[0].setAttribute("status", "wrongBtn")
            e.target.setAttribute("status", "wrongBtn")

        }
    }
}
function startTimer(duration, display) {
    clearInterval(testInterval)
    let timer = duration;
    let oneMinute = 0;
    let fiveMinute = 0;
    testInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = `Тест завершится через: ${minutes}:${seconds}`;

        if (--timer < 0) {
            timer = duration;

        }
        if (oneMinute === 60) {
            minute++
            oneMinutePassedLine()
            user.handleOneMinutePast()
            oneMinute = 0;
        }
        if (fiveMinute == 301) {
            displayColoredTestResult()
            find_M_N_Q()
            excelDataPush()
            fiveMinutePast()
            endTest()
        }
        oneMinute++;
        fiveMinute++
    }, 1000);
}
function displayColoredTestResult() {
    for (let i = 0; i < lastClickedCircle; i++) {
        let circleDegree = main.childNodes[1].childNodes[i].childNodes[0].attributes.degree.value
        let circleStroke = main.childNodes[1].childNodes[i].childNodes[0].attributes.stroke.value
        let circleStatus = main.childNodes[1].childNodes[i].childNodes[0].attributes.status.value

        if (circleDegree == uniqueDegree[0] || circleDegree == uniqueDegree[1]) {
            if (circleStroke == "blue" && circleStatus == 0) {
                main.childNodes[1].childNodes[i].childNodes[0].setAttribute("stroke", "green")
            } else if (circleStroke == "blue" && circleStatus == "wrongBtn") {
                main.childNodes[1].childNodes[i].childNodes[0].setAttribute("stroke", "#ec42f5")
            }
            else if (circleStroke == "black") {
                main.childNodes[1].childNodes[i].childNodes[0].setAttribute("stroke", "orange")
            }
        }
        else if (circleDegree != uniqueDegree[0] && circleDegree != uniqueDegree[1]) {
            if (circleStroke == "blue") {
                main.childNodes[1].childNodes[i].childNodes[0].setAttribute("stroke", "red")
            }
        }
    }

}
function oneMinutePassedLine() {
    main.childNodes[1].childNodes[lastClickedCircle].style.backgroundColor = "skyblue"
}
function createButton(appendTo, classList, text, attr, attrVal) {
    let div = document.createElement("div")
    let elem = document.createElement("a");
    let aTextNode = document.createTextNode(text)
    elem.appendChild(aTextNode)
    elem.setAttribute(attr, attrVal)
    elem.classList.add(classList)
    div.appendChild(elem)
    appendTo.appendChild(div)
}
function fiveMinutePast() {
    createButton(menu, "button8", "Скачать Excel", 'onclick', 'save()')
}
function calcAVG(arr) {
    let arrAvg = arr.reduce((a, b) => Number(a) + Number(b), 0)
    return (arrAvg / arr.length).toFixed(2);
}
function excelDataPush() {

    let result = formulas();
    let resultInter = resultInterpretation(result)

    data.push([{ "text": `Min` }, { "text": `M` }, { "text": `N` }, { "text": `Q` }, { "text": `A` }, { "text": `P` }])
    for (let i = 0; i < 5; i++) {

        data.push([{ "text": `${i + 1}` }, { "text": `${M[i]}` }, { "text": `${N[i]}` }, { "text": `${Q[i]}` }, { "text": `${A[i]}` }, { "text": `${P[i]}` }])
    }
    data.push([],

        [{ "text": `Nt` }, { "text": `${result[1]}` }],
        [{ "text": `Qt` }, { "text": `${result[0]}` }],
        [{ "text": `At` }, { "text": `${result[5]}` }, { "text": `${resultInter[5]}` }],
        [{ "text": `Pt` }, { "text": `${result[3]}` }, { "text": `${resultInter[3]}` }],
        [],
        [{ "text": `S` }, { "text": `${result[2]}` }, { "text": `${resultInter[2]}` }],
        [{ "text": `Kp` }, { "text": `${result[4]}` }, { "text": `${resultInter[4]}` }],
        [{ "text": `Ta` }, { "text": `${result[6]}` }, { "text": `${resultInter[6]}` }])


    save()
}

function resultInterpretation(e) {
    let source = 'https://impsi.ru/testy/koltsa-landolta/'
    let source2 = 'https://prepod.nspu.ru/pluginfile.php/77584/mod_resource/content/0/Landolt_obrabotka.pdf'

    let [Qt, Nt, S, Pt, Kp, At, Ta, A, P] = e;
    let QtInter, NtInter, SInter, PtInter, KpInter, AtInter, TaInter, AInter, PInter;


    if (S <= 0.74) SInter = 'Низкая скорость переработки информации';
    if (S > 0.74 && S <= 1.19) SInter = 'Средняя скорость';
    if (S >= 1.20 && S <= 1.36) SInter = 'Выше среднего ';
    if (S > 1.36) SInter = 'Высокая скорость';


    if (Pt <= 150) PtInter = 'Низкий уровень продуктивности'
    if (Pt > 150 && Pt <= 250) PtInter = 'средний уровень продуктивности'
    if (Pt > 250 && Pt <= 330) PtInter = 'выше среднего'
    if (Pt > 330) PtInter = 'высокий уровень продуктивности'

    if (Kp <= 0) KpInter = 'Высокий уровень выносливости'
    if (Kp > 0 && Kp < 15) KpInter = 'средний уровень выносливости'
    if (Kp > 15) KpInter = 'низкий уровень выносливости'

    if (At <= 0.79) AtInter = 'Низкий уровень точности'
    if (At >= 0.80 && At <= 0.89) AtInter = 'Средний уровень выносливости'
    if (At >= 0.90 && At <= 0.94) AtInter = 'выше среднего '
    if (At >= 0.95) AtInter = 'Высокий уровень выносливости'

    if (Ta <= 0) TaInter = 'не учитываются'
    if (Ta > 0 && Ta < 15) TaInter = 'умеренный, допустимый уровень изменений'
    if (Ta >= 15) TaInter = 'значительные изменения, нарастание утомления.'



    return [QtInter, NtInter, SInter, PtInter, KpInter, AtInter, TaInter, AInter, PInter]

}








