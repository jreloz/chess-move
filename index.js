// OPPONENT
//const opponent = 'white-move';
//const opponent = 'black-move';
let opponent = '';
const cheater = document.querySelectorAll("#board-layout-player-bottom");
cheater.forEach((player) => {
    const pieces = player.querySelectorAll("wc-captured-pieces");
    pieces.forEach((piece) => {
        const playerColor = piece.getAttribute("player-color");
        if (playerColor == 1) {
            opponent = "black-move";
        }else{
            opponent = 'white-move';
        }
    })
})


//==> PLAYING WITH COMPUTER
//const targetNode = document.querySelector('.play-controller-moveList');
//==> PLAYING ONLINE
const targetNode = document.querySelector('.move-list-wrapper-component.move-list.chessboard-pkg-move-list-component');

const config = { childList: true, subtree: true };
const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const addedNodes = mutation.addedNodes;
            addedNodes.forEach(node => {
                if (node.classList && node.classList.contains(opponent)) {
                    getMoveList();
                }
            });
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);



const getMoveList = () => {
    let combinedArrays = [];
    let moveList = document.querySelectorAll('.main-line-row.move-list-row ');
    moveList.forEach((moves) => {
        let list = moves.querySelectorAll('.main-line-ply');
        list.forEach((move) => {
            let tmpMove = move.innerText.trim();
            let divWithFigurine = move.querySelector("span[data-figurine]");
            let dataFigure = "";
            if (divWithFigurine) {
                dataFigure = divWithFigurine.dataset.figurine;
            }
            combinedArrays.push(dataFigure + tmpMove)
        })
    });
    getNextMove(combinedArrays);
}



const getNextMove = (combinedArrays) => {
    let baseUrl = 'http://localhost:5000/api/record-move';

    let queryParams = combinedArrays.map(move => 'moves[]=' + encodeURIComponent(move)).join('&');
    let url = `${baseUrl}?${queryParams}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data.best_move);
            createPopup(data.best_move);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



const createPopup = (message) => {
    var existingPopup = document.querySelector('.popup');
        
    if (existingPopup) {
        existingPopup.querySelector('.popup-text').textContent = message;
    } else {
        var popup = document.createElement('div');
        popup.classList.add('popup');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.right = '0';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        popup.style.margin = '10px'
        popup.style.zIndex = '9999';

        var text = document.createElement('span');
        text.classList.add('popup-text');
        text.textContent = message;

        var closeButton = document.createElement('span');
        closeButton.textContent = ' X';
        closeButton.style.marginLeft = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'red';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };

        popup.appendChild(text);
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    }
}