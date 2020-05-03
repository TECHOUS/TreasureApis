let modeButton = document.getElementById('modeButton');
let modeFlag = false;
const PINK = "#f89494";
const YELLOW = "#ecd501";
const lightBlack = "rgb(41, 43, 44)";
const darkBlack = "rgb(18, 18, 18)";

modeButton.addEventListener('click', () => {
    if (modeFlag == false) {
        modeFlag = true;
        enableDarkMode();
    } else {
        modeFlag = false;
        enableLightMode();
    }
})

//Get the button
let navButton = document.getElementById("navButton");
navButton.addEventListener('click' , ()=>{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})

handleNavigationButton()

// When the user scrolls down 80px from the top of the document, show the button
window.onscroll = ()=> {
    handleNavigationButton();
};

function handleNavigationButton(){
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        navButton.style.display = "block";
    } else {
        navButton.style.display = "none";
    }
}

function enableDarkMode() {
    modeButton.style.color = YELLOW;
    let body = document.getElementsByTagName('body')[0];
    body.style.color = "white";
    body.style.backgroundColor = darkBlack;
    document.getElementById('meteorBack').style.backgroundColor = PINK;

    let endpointsDiv = document.getElementsByClassName('endpoint-div');
    for (let i = 0; i < endpointsDiv.length; i++) {
        endpointsDiv[i].style.backgroundColor = lightBlack;
    }

    let blues = document.getElementsByClassName('blue');
    for (let i = 0; i < blues.length; i++) {
        blues[i].style.color = "cyan";
    }

    let greens = document.getElementsByClassName('green');
    for (let i = 0; i < greens.length; i++) {
        greens[i].style.color = "lightgreen";
    }

    let projectionLink = document.getElementsByClassName('projectionLink');
    for (let i = 0; i < projectionLink.length; i++) {
        projectionLink[i].style.color = "cyan";
    }

    let footer = document.getElementsByTagName('footer')[0];
    footer.style.backgroundColor = lightBlack;

    navButton.style.backgroundColor = lightBlack;
}

function enableLightMode() {
    modeButton.style.color = PINK;
    let body = document.getElementsByTagName('body')[0];
    body.style.color = "black";
    body.style.backgroundColor = "white";
    document.getElementById('meteorBack').style.backgroundColor = YELLOW;

    let endpointsDiv = document.getElementsByClassName('endpoint-div');
    for (let i = 0; i < endpointsDiv.length; i++) {
        endpointsDiv[i].style.backgroundColor = "white";
    }

    let blues = document.getElementsByClassName('blue');
    for (let i = 0; i < blues.length; i++) {
        blues[i].style.color = "blue";
    }

    let greens = document.getElementsByClassName('green');
    for (let i = 0; i < greens.length; i++) {
        greens[i].style.color = "green";
    }

    let projectionLink = document.getElementsByClassName('projectionLink');
    for (let i = 0; i < projectionLink.length; i++) {
        projectionLink[i].style.color = "blue";
    }

    let footer = document.getElementsByTagName('footer')[0];
    footer.style.backgroundColor = PINK;

    navButton.style.backgroundColor = PINK;
}