"use strict";

(function() {
    let seconds;
    let timer;

window.addEventListener("load", init);

function init() {
    // Assign event listeners in init.
    let start_button = id("start-btn");
    start_button.addEventListener("click", start);
    let back_btn = id("back-btn");
    back_btn.addEventListener("click", back)
    let refresh_btn = id("refresh-btn")
    refresh_btn.addEventListener("click",refresh)
    

    seconds = document.getElementsByTagName("select")[0].value;
}

// This is an event listener.
function start() {
    let easy = document.getElementsByTagName("input")[0].checked;
    seconds = document.getElementsByTagName("select")[0].value;
    id("game-view").style.display = "flex";
    id("menu-view").style.display = "none";
    timer = window.setInterval(tick, 1000);
    id("time").textContent = `0${Math.floor(seconds/60)}:00`;
    let game = id("board");
    let cards = [];
    while(cards.length<12){
        let card = generateUniqueCard(easy);
        let dupe = false;
        for (let j = 0; j < cards.length; j++) {
            if(card.firstChild.alt == cards[j].firstChild.alt){
                dupe = true
            }
        }
        if(!dupe){
            game.appendChild(card);
            cards.push(card);   
        }
    }
}

function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
  }

function back() {
    id("set-count").innerText = 0;
    id("menu-view").style.display = "block";
    id("game-view").style.display = "none";
    window.clearInterval(timer);
    id("board").innerHTML="";

}

function refresh() {
    if(seconds>0){
        id("board").innerHTML="";
        let easy = document.getElementsByTagName("input")[0].checked;
        let game = id("board");
        let cards = [];
        while(cards.length<12){
            let card = generateUniqueCard(easy);
            let dupe = false;
            for (let j = 0; j < cards.length; j++) {
                if(card.firstChild.alt == cards[j].firstChild.alt){
                    dupe = true
                }
            }
            if(!dupe){
                game.appendChild(card);
                cards.push(card);   
            }
        }
    }

}

function cardSelected() {
    if(seconds>0){
        this.classList.toggle("selected")

        console.log(document.getElementsByClassName("selected").length)

        if(document.getElementsByClassName("selected").length == 3){
            let selected = document.getElementsByClassName("selected");
            let set = isASet(selected);
            let list = [];
            //console.log(selected);
            for (let index = selected.length-1; index >= 0; index--) {
                list.push(selected[index])
                selected[index].classList.remove("selected");
            }
            
            if(set){
                id("set-count").innerText=parseInt(id("set-count").innerText)+1
                for (let index = 0; index < list.length; index++) {
                    list[index].classList.add("hide-imgs")
                    let p = document.createElement("p");
                    p.innerText = "Set!"
                    list[index].appendChild(p);
                }

                setTimeout(() => {
                    let newCards = [];
                    while(newCards.length<3){
                        let card = generateUniqueCard(document.getElementsByTagName("input")[0].checked)
                        let cards = document.getElementsByClassName("card");
                        let cardSet = [];
                        let dupe = false;
                        for (let j = 0; j < cards.length; j++) {
                            cardSet.push(cards[j])
                        }
                        for (let index = 0; index < cardSet.length; index++) {
                            if(card.firstChild.alt == cardSet[index].firstChild.alt){
                                dupe = true
                            }
                        }
                        if(!dupe){
                            cardSet.push(card)
                            newCards.push(card);
                        }
                    }
                    for (let index = 0; index < list.length; index++) {
                        list[index].replaceWith(newCards[index])
                    }
                }, 1000);

            } else {
                for (let index = 0; index < list.length; index++) {
                    list[index].classList.add("hide-imgs")
                    let p = document.createElement("p");
                    p.innerText = "Not a Set"
                    list[index].appendChild(p);
                }
                if(seconds<=15){
                    seconds = 0
                } else {
                    seconds = seconds -15
                }

                setTimeout(() => {
                    for (let index = 0; index < list.length; index++) {
                        list[index].removeChild(list[index].lastChild)
                        list[index].classList.remove("hide-imgs")
                    }
                }, 1000);

            }
        }
    }
}

function generateRandomAttributes(isEasy){
    let colors = ["green", "purple", "red"];
    let fill = ["outline", "solid", "striped"]
    let shape = ["diamond", "oval", "squiggle"]
    let count = ["1", "2", "3"]
    if(isEasy){
        return [
            colors[Math.floor(Math.random() * 3)],
            fill[1],
            shape[Math.floor(Math.random() * 3)],
            count[Math.floor(Math.random() * 3)] 
        ]
    } else {
        return [
            colors[Math.floor(Math.random() * 3)],
            fill[Math.floor(Math.random() * 3)],
            shape[Math.floor(Math.random() * 3)],
            count[Math.floor(Math.random() * 3)] 
        ]
    }
}

function generateUniqueCard(isEasy){
    let card = document.createElement("div");
    card.classList.add('card');
    let attr = generateRandomAttributes(isEasy);
    for (let index = 0; index < parseInt(attr[3]); index++) {
        let elem = document.createElement("img");
        elem.setAttribute("src", `img/${attr[0]}-${attr[1]}-${attr[2]}.png`);  
        elem.setAttribute("alt", `img/${attr[0]}-${attr[1]}-${attr[2]}-${attr[3]}.png`);
        card.appendChild(elem);
        
    }
    card.id = `img/${attr[0]}-${attr[1]}-${attr[2]}-${attr[3]}`
    card.addEventListener("click", cardSelected);
    return card;
}

function tick() {
    // console.log("tick");
    seconds--;
    if(Math.floor(seconds%60)>=10){
        id("time").textContent = `0${Math.floor(seconds/60)}:${Math.floor(seconds%60)}`;
    } else {
        id("time").textContent = `0${Math.floor(seconds/60)}:0${Math.floor(seconds%60)}`;
    }
    if (seconds == 0) {
        window.clearInterval(timer);
        let selected = document.getElementsByClassName("selected");
        for (let index = selected.length-1; index >= 0; index--) {
            selected[index].classList.remove("selected");
        }
    }
}

/////////////////////////////////////////////////////////////////////
// Helper functions
function id(id) {
    return document.getElementById(id);
}
  
function qs(selector) {
    return document.querySelector(selector);
}
  
function qsa(selector) {
    return document.querySelectorAll(selector);
}
})();