const container = document.querySelector(".container");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("search");
const addBoard = document.getElementById('newBoard');
const boardContainer = document.getElementById('addBoard');
let count = 0;
let activeBoard = null;
const boards = [];

// Event Delegation for Card Actions
container.addEventListener("click", (event) => {
  const target = event.target;

  // Change Card Color
  if (target.classList.contains("color")) {
    changeCardColor(target);
  }

  // Delete Card
  if (target.classList.contains("deleteBtn")) {
    deleteCard(target);
  }

  // Edit Card
  if (target.closest(".editBtn")) {
    editCard(target.closest(".editBtn"));
  }
});

// Function to Change Card Color
function changeCardColor(colorElement) {
  const selectedColor = colorElement.getAttribute("data-color");
  const card = colorElement.closest(".card");
  card.style.backgroundColor = selectedColor;
  card.style.borderColor = selectedColor;
  card.style.boxShadow = `0 0 10px ${selectedColor}`;
}

// Function to Delete Card
function deleteCard(deleteButton) {
  const cardToDelete = deleteButton.closest(".card");
  const board = boards.find(b => b.id === activeBoard);
  if (board) {
    // Remove the card from the board's cards array before deleting it
    const cardIndex = board.cards.indexOf(cardToDelete);
    console.log(cardToDelete);
    
    if (cardIndex !== -1) {
      board.cards.splice(cardIndex, 1);
    }
  }
  if (cardToDelete) {
    cardToDelete.remove();
  }
}

// Function to Edit Card
function editCard(editButton) {
  const card = editButton.closest(".card");
  const textContent = card.querySelector(".text-content");

  const textarea = document.createElement("textarea");
  textarea.value = textContent.textContent.trim();
  textarea.classList.add("textArea");
  card.replaceChild(textarea, textContent);

  const saveButton = createSaveButton();
  card.appendChild(saveButton);

  saveButton.addEventListener("click", () => {
    saveEditedContent(card, textarea, textContent, saveButton);
  });
}

// Function to Create Save Button
function createSaveButton() {
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("saveBtn");
  return saveButton;
}

// Function to Save Edited Content
function saveEditedContent(card, textarea, textContent, saveButton) {
  textContent.textContent = textarea.value.trim();
  card.replaceChild(textContent, textarea);
  card.removeChild(saveButton);
}

// Function to Print Date on Card
function printDate(cardElement) {
  const date = new Date().toLocaleString();
  const dateElement = document.createElement("p");
  dateElement.classList.add("date");
  dateElement.textContent = `Date added: ${date}`;
  cardElement.appendChild(dateElement);
}

// Add date to all cards
document.querySelectorAll(".card").forEach((card) => {
  printDate(card);
});

//Adding the Button for cards
addBtn.addEventListener("click", () => {
  if (!activeBoard) {
    alert("Please select a board first.");
    return;
  }

  const newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.innerHTML = `
    <p class="text-content">
      This is a new card. You can edit or style this text.
    </p>
    <ul class="colors">
      <li class="color red" data-color="red"></li>
      <li class="color green" data-color="green"></li>
      <li class="color yellow" data-color="yellow"></li>
      <li class="color blue" data-color="blue"></li>
      <li class="color orangered" data-color="orangered"></li>
      <li>
        <button class="editBtn ">
          <span class="text">Edit</span>
        </button>
      </li>
      <li>
        <button class="deleteBtn ">
          <span class="textD">Delete</span>
        </button>
      </li>
    </ul>
  `;
  newCard.classList.add("newCard");
  // newCard.style.left='100px';
  const activeBoardObj = boards.find(board => board.id === activeBoard);
  activeBoardObj.cards.push(newCard);
  

  printDate(newCard);
  container.appendChild(newCard);
});
searchInput.addEventListener("input", (event) => {
  const term = event.target.value.toLowerCase(); // Get the search term
  const cards = document.querySelectorAll(".card"); // Select all cards
  cards.forEach((card) => {
    const cardText = card
      .querySelector(".text-content")
      .textContent.toLowerCase();
    if (cardText.includes(term)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});

addBoard.addEventListener('click',()=>{
  count++;
  const boardId = `board-${count}`;
  activeBoard = boardId;
  const newBoard = {
    id: boardId,
    active: false,
    cards: [] 
  };
  boards.push(newBoard);

  let content = document.createElement('li');
  content.className = "BoardList";
  // content.id= `board-${count}`;

  let span = document.createElement('span');
  // span.className = 'BoardList';
  span.id = boardId;
  span.textContent = `Board ${count}`;
  content.appendChild(span);

  content.addEventListener('click', (e) => {
    // content.classList.add('active');
    e.preventDefault();
    switchBoard(boardId);
  });

  boardContainer.appendChild(content);
  switchBoard(boardId);

});

const switchBoard = (boardId) => {
  const board = boards.find(b => b.id === boardId);

  if (board) {
    board.active = true;
    container.innerHTML = '';  
    // console.log(board);
    // console.log(boards);
    
    
    board.cards.forEach(card => {
      container.appendChild(card);
    });
    boards.forEach(b => {
      if (b.id !== boardId) {
        b.active = false;
        let newId = document.getElementById(`${b.id}`)
        newId.classList.remove('active');
      }
      
    });
    const boardIds = document.getElementById(`${boardId}`)
    // console.log(boardIds);
    
    boardIds.classList.add('active');
    // boardIds.style.backgroundColor = 'red' ;
    // console.log(`Switched to board: ${boardId}`);
  }
};