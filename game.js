document.getElementById("babyParkerBlink").style.opacity = 0;
document.getElementById("babyParkerWink").style.opacity = 0;

// Game Stats
var totalParkers = 0;
var alltimeParkers = 0;
var parkersPerClick = 1;
var parkersPerSecond = 0;
var totalClicks = 0;

// Options
var muted = false;

// Game Items
class Building {
    constructor(name, basecost, parkerRate) {
        this.basecost = basecost;
        this.owned = 0;
        this.name = name;
        this.parkerRate = parkerRate;
    }

    getCurrentCost() {
        return Math.ceil(this.basecost * Math.pow(1.15, this.owned));
    }
}
const buildings = [10];
buildings[0] = new Building("Baby Trevor", 15, 0.2);
buildings[1] = new Building("Baby Daniel", 100, 1);
buildings[2] = new Building("Baby Ian", 1100, 8);
buildings[3] = new Building("Baby Joey", 12000, 47);
buildings[4] = new Building("Baby Nic", 130000, 260);
buildings[5] = new Building("Park-a-Stan", 1400000, 1400);
buildings[6] = new Building("Place Japan", 20000000, 7800);
buildings[7] = new Building("Dubai Portal", 330000000, 44000);
buildings[8] = new Building("smu2mu2", 5100000000, 260000);
buildings[9] = new Building("Vtuber Stream", 75000000000, 1600000);

document.getElementById("building0").addEventListener("click", () => {
    buyBuilding(0);
});
document.getElementById("building1").addEventListener("click", () => {
    buyBuilding(1);
});
document.getElementById("building2").addEventListener("click", () => {
    buyBuilding(2);
});
document.getElementById("building3").addEventListener("click", () => {
    buyBuilding(3);
});
document.getElementById("building4").addEventListener("click", () => {
    buyBuilding(4);
});
document.getElementById("building5").addEventListener("click", () => {
    buyBuilding(5);
});
document.getElementById("building6").addEventListener("click", () => {
    buyBuilding(6);
});
document.getElementById("building7").addEventListener("click", () => {
    buyBuilding(7);
});
document.getElementById("building8").addEventListener("click", () => {
    buyBuilding(8);
});
document.getElementById("building9").addEventListener("click", () => {
    buyBuilding(9);
});

// Sounds
const bruhSound = new Audio("sounds/bruh.mp3");
const winkSound = new Audio("sounds/gameboy.mp3");

// Animation variables
var blinkCounter = 0;
var blinkType = getRandomInt(1, 3);
const randomMin = 2000;
const randomMax = 3000;
var randomInterval = getRandomInt(randomMin, randomMax);

document.getElementById("canvas").width = window.innerWidth;
document.getElementById("canvas").height = window.innerHeight;
var ctx = document.getElementById("canvas").getContext("2d");

var ticker = false;

var renderList = [];

class ScreenText {
    constructor(text, xPos, yPos) {
        this.text = text;
        this.creationTime = Date.now();
        if (ticker) {
            this.xPos = xPos + 5;
            ticker = !ticker;
        } else {
            this.xPos = xPos - 5
            ticker = !ticker;
        }
        this.yPos = yPos;
        this.opacity = 1;
    }

    render() {
        ctx.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";
        ctx.font = "40px Merriweather"
        ctx.fillText(this.text, this.xPos, this.yPos);
    }

    tick() {
        this.yPos -= 1;
        this.opacity -= 0.005;
        if (this.opacity <= 0) {
            delete this;
        }
    }
}

// Game loop
var currentTime = Date.now();
var lastTime = currentTime;

// Event listeners
document.getElementById("babyParker").addEventListener("click", parkerClicked);
document.getElementById("babyParker").addEventListener("mouseover", animate);
document.getElementById("babyParker").addEventListener("mouseout", animate);

document.getElementById("options").addEventListener("click", options);
document.getElementById("stats").addEventListener("click", stats);
document.getElementById("info").addEventListener("click", info);
document.getElementById("surpriseButton").addEventListener("click", surprise);

document.getElementById("muteButton").addEventListener("click", muteToggle);

window.addEventListener('resize', resizeCanvas);

updateCosts();
updateBuildingCounts();
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    tick();
    render();
    window.requestAnimationFrame(gameLoop);
}

function tick() {
    currentTime = Date.now();
    addBuildingsRates();
    checkCosts();
    updateCount();
    blink();
    updateStats();
    for (let i = 0; i < renderList.length; i++) {
        renderList[i].tick();
    }
    lastTime = currentTime;
}

function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < renderList.length; i++) {
        if (renderList[i].opacity <= 0) {
            renderList.shift();
            continue;
        }
        renderList[i].render();
    }
}

function parkerClicked(event) {
    totalParkers += parkersPerClick;
    alltimeParkers += parkersPerClick;
    totalClicks++;
    checkCosts();
    updateCount();
    animate();
    createScreenText(event);
}

function addBuildingsRates() {
    for (let i = 0; i < buildings.length; i++) {
        totalParkers += buildings[i].owned * buildings[i].parkerRate * ((currentTime - lastTime) / 1000);
        alltimeParkers += buildings[i].owned * buildings[i].parkerRate * ((currentTime - lastTime) / 1000);
    }
}

function animate() {
    if (document.getElementById('babyParker').classList.contains("bounce")) {
        document.getElementById('babyParker').classList.add("bounce2");
        document.getElementById('babyParker').classList.remove("bounce");
    } else {
        document.getElementById('babyParker').classList.add("bounce");
        document.getElementById('babyParker').classList.remove("bounce2");
    }
    if (document.getElementById('babyParkerBlink').classList.contains("bounce")) {
        document.getElementById('babyParkerBlink').classList.add("bounce2");
        document.getElementById('babyParkerBlink').classList.remove("bounce");
    } else {
        document.getElementById('babyParkerBlink').classList.add("bounce");
        document.getElementById('babyParkerBlink').classList.remove("bounce2");
    }
    if (document.getElementById('babyParkerWink').classList.contains("bounce")) {
        document.getElementById('babyParkerWink').classList.add("bounce2");
        document.getElementById('babyParkerWink').classList.remove("bounce");
    } else {
        document.getElementById('babyParkerWink').classList.add("bounce");
        document.getElementById('babyParkerWink').classList.remove("bounce2");
    }
}

function updateCount() {
    document.getElementById("parkersBaked").textContent = shortenNumString(Math.floor(totalParkers), 3);
    if (totalParkers > 999999) {
        document.getElementById("parkersBakedUnit").style.display = "block";
    } else {
        document.getElementById("parkersBakedUnit").style.display = "inline";
    }
}

function buyBuilding(buildingNo) {
    if (totalParkers >= buildings[buildingNo].getCurrentCost()) {
        totalParkers -= buildings[buildingNo].getCurrentCost();
        buildings[buildingNo].owned++;
        parkersPerSecond += buildings[buildingNo].parkerRate;
        parkersPerClick += buildings[buildingNo].parkerRate * 0.1;
        document.getElementById("parkerPerSecond").textContent = shortenNumString(parkersPerSecond, 3);
        updateCosts();
        updateBuildingCounts();
        console.log("Buy success, parkerRate: " + parkersPerSecond);
    } else {
        console.log("Insufficient funds, cost: " + buildings[buildingNo].getCurrentCost());
    }
}

function checkCosts() {
    for (let i = 0; i < buildings.length; i++) {
        if (totalParkers >= buildings[i].getCurrentCost()) {
            document.getElementById("building" + i).classList.remove("notAfford");
        } else {
            document.getElementById("building" + i).classList.add("notAfford");
        }
    }
}

function updateCosts() {
    for (let i = 0; i < buildings.length; i++) {
        document.getElementById("itemCost" + i).textContent = shortenNumString(buildings[i].getCurrentCost(), 3);
    }
}

function updateBuildingCounts() {
    for (let i = 0; i < buildings.length; i++) {
        document.getElementById("itemNum" + i).textContent = buildings[i].owned;
    }
}

function blink() {
    blinkCounter++;

    switch (blinkType) {
        case 1:
            if (blinkCounter == randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 1.0;
            } else if (blinkCounter == 10 + randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 0;
            } else if (blinkCounter == 20 + randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 1.0;
            } else if (blinkCounter == 30 + randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 0;
                blinkCounter = 0;
                randomInterval = getRandomInt(randomMin, randomMax);
                blinkType = getRandomInt(1, 4);
            }
            break;
        case 2:
            if (blinkCounter == randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 1.0;
            } else if (blinkCounter == 10 + randomInterval) {
                document.getElementById("babyParkerBlink").style.opacity = 0;
                blinkCounter = 0;
                randomInterval = getRandomInt(randomMin, randomMax);
                blinkType = getRandomInt(1, 4);
            }
            break;
        case 3:
            if (blinkCounter == randomInterval) {
                if (getRandomInt(1, 100) > 20) {
                    blinkCounter = 0;
                    randomInterval = getRandomInt(randomMin / 10, randomMax / 10);
                    blinkType = getRandomInt(1, 4);
                    break;
                }
                document.getElementById("babyParkerWink").style.opacity = 1.0;
                if (!muted) {
                    let wink = winkSound.cloneNode();
                    wink.play();
                }
            } else if (blinkCounter == 80 + randomInterval) {
                document.getElementById("babyParkerWink").style.opacity = 0;
                blinkCounter = 0;
                randomInterval = getRandomInt(randomMin, randomMax);
                blinkType = getRandomInt(1, 4);
            }
    }
}

function shortenNumString(number, decimalPoints) {
    if (number < 10) {
        return parseFloat(number.toFixed(decimalPoints));
    }

    if (number >= 1000000000000000) {
        number /= 1000000000000000;
        return parseFloat(number.toFixed(decimalPoints)) + " quadrillion";
    } else if (number >= 1000000000000) {
        number /= 1000000000000;
        return parseFloat(number.toFixed(decimalPoints)) + " trillion";
    } else if (number >= 1000000000) {
        number /= 1000000000;
        return parseFloat(number.toFixed(decimalPoints)) + " billion";
    } else if (number >= 1000000) {
        number /= 1000000;
        return parseFloat(number.toFixed(decimalPoints)) + " million";
    } else if (number >= 100000) {
        return number.toFixed(0).slice(0, 3) + "," + number.toFixed(0).slice(3);
    } else if (number >= 10000) {
        return number.toFixed(0).slice(0, 2) + "," + number.toFixed(0).slice(2);
    } else {
        return number.toFixed(0);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function surprise() {
    if (!muted) {
        let bruh = bruhSound.cloneNode();
        bruh.play();
    }
}

function options() {
    if (document.getElementById("optionsScreen").style.display == "block") {
        document.getElementById("optionsScreen").style.display = "none";
        document.getElementById("mainGame").style.display = "block";
    } else {
        hideAllDisplays();
        document.getElementById("optionsScreen").style.display = "block";
    }
}

function stats() {
    if (document.getElementById("statsScreen").style.display == "block") {
        document.getElementById("statsScreen").style.display = "none";
        document.getElementById("mainGame").style.display = "block";
    } else {
        hideAllDisplays();
        document.getElementById("statsScreen").style.display = "block";
    }
}

function info() {
    if (document.getElementById("updateLog").style.display == "block") {
        document.getElementById("updateLog").style.display = "none";
        document.getElementById("mainGame").style.display = "block";
    } else {
        hideAllDisplays();
        document.getElementById("updateLog").style.display = "block";
    }
}

function hideAllDisplays() {
    document.getElementById("updateLog").style.display = "none";
    document.getElementById("statsScreen").style.display = "none";
    document.getElementById("optionsScreen").style.display = "none";
}

function resizeCanvas() {
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;
}

function createScreenText(event) {
    renderList.push(new ScreenText("+" + shortenNumString(parkersPerClick, 3), event.clientX - 25, event.clientY + 25));
}

function updateStats() {
    document.getElementById("allTimeParker").textContent = shortenNumString(Math.floor(alltimeParkers), 3);
    document.getElementById("totalClicks").textContent = shortenNumString(Math.floor(totalClicks), 0);
}

function muteToggle() {
    if (document.getElementById("muteButton").classList.contains("toggled")) {
        document.getElementById("muteButton").classList.remove("toggled");
        document.getElementById("muteButtonText").textContent = "Mute: Off";
        muted = false;
    } else {
        document.getElementById("muteButton").classList.add("toggled");
        document.getElementById("muteButtonText").textContent = "Mute: On";
        muted = true;
    }
}