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
    console.log(target);
    
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
  if (!cardToDelete) {
    alert("Card not found for deletion");
    return;
  }
  const board = boards.find(b => b.id === activeBoard);
  if (board) {
    const cardIndex = board.cards.findIndex(card => card === cardToDelete);
    console.log(cardToDelete);
    
    if (cardIndex !== -1) {
      board.cards.splice(cardIndex, 1);
    
    }
  }
  cardToDelete.remove();
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
          This is a sample card. You can edit or style this text.
        </p>
        <ul class="colors">
          <li class="color red" data-color="#FBCEB1     "></li>
          <li class="color green" data-color="#ACE1AF        "></li>
          <li class="color yellow" data-color="#c5c800          "></li>
          <li class="color blue" data-color="#7CB9E8         "></li>
          <li class="color orangered" data-color="#FFB000"></li>
        </ul>
        <div class="edBtns">
          <button class="editBtn">Edit</button>
          <button class="deleteBtn">Delete</button>
        </div>
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

//the listener for add board button

addBoard.addEventListener('click',()=>{
  count++;
  const boardId = `board ${count}`;
  activeBoard = boardId;
  const newBoard = {
    id: boardId,
    active: false,
    cards: [] 
  };
  boards.push(newBoard);

  const boardElement = document.createElement("li");
  boardElement.classList.add("BoardList");
  boardElement.innerHTML = `<span>${boardId}</span>`;
  boardElement.addEventListener('click', () => {
    setActiveBoard(boardId, boardElement);
  });

  boardContainer.appendChild(boardElement);

  // if it new board set it as active board
  setActiveBoard(boardId, boardElement);
});

function setActiveBoard(boardId, boardElement) {
  activeBoard = boardId;

  // To remove the active class from all the board
  document.querySelectorAll('.BoardList span').forEach(span => {
    span.classList.remove('active');
  });

  // to change the background color of the active board 
  boardElement.querySelector('span').classList.add('active');

  //this clear the container and then add the card for the selected board  
  container.innerHTML = '';
  const activeBoardObj = boards.find(board => board.id === boardId);
  if (activeBoardObj) {
    activeBoardObj.cards.forEach(card => {
      container.appendChild(card);
    });
  }
}
// Initialize Archive Button and Navigation List
const archiveButton = document.querySelector(".Archived");
const navList = document.querySelector(".UnOrderdBoardList");

let archiveTabCreated = false;

// Create Archive Tab and Section
archiveButton.addEventListener("click", () => {
  if (!archiveTabCreated) {
    createArchiveTab();
    archiveTabCreated = true;
  }
});

function createArchiveTab() {
  // Create Archive Tab in Navigation
  const archiveTab = document.createElement("li");
  archiveTab.classList.add("BoardList");
  archiveTab.innerHTML = `<a href="#archiveSection">Archive</a>`;
  navList.appendChild(archiveTab);

  // Create Archive Section
  const archiveSection = document.createElement("div");
  archiveSection.id = "archiveSection";
  archiveSection.style.display = "none";
  archiveSection.innerHTML = `
    <h2>Archived Notes</h2>
    <div class="archived-cards"></div>
  `;
  document.body.appendChild(archiveSection);

  // Add click event for Archive Tab
  archiveTab.addEventListener("click", () => {
    toggleSections(archiveSection);
  });
}

function toggleSections(activeSection) {
  // Toggle visibility between sections
  const sections = [container, document.querySelector("#archiveSection")];

  sections.forEach((section) => {
    section.style.display = section === activeSection ? "block" : "none";
  });
}

// Handle Card Archiving
container.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn") || e.target.classList.contains("textD")) {
    const cardToArchive = e.target.closest(".card");
    if (cardToArchive) {
      moveCardToArchive(cardToArchive);
    }
  }
});

function moveCardToArchive(card) {
  // Find and move the card to Archive Section
  const archiveSection = document.querySelector(".archived-cards");
  archiveSection.appendChild(card);

  // Mark the card as archived
  card.style.opacity = "0.7";
  card.style.pointerEvents = "none";

  saveArchiveState();
}

function moveCardToBoard(card) {
  // Move the card back to the main board
  container.appendChild(card);

  // Restore interactivity
  card.style.opacity = "1";
  card.style.pointerEvents = "auto";

  saveArchiveState();
}

// Save and Restore Archive State
function saveArchiveState() {
  const archivedCards = Array.from(document.querySelectorAll(".archived-cards .card"))
    .map((card) => card.outerHTML);
  localStorage.setItem("archivedCards", JSON.stringify(archivedCards));

  const boardCards = Array.from(document.querySelectorAll(".container .card"))
    .map((card) => card.outerHTML);
  localStorage.setItem("boardCards", JSON.stringify(boardCards));
}

function restoreState() {
  const archivedCards = JSON.parse(localStorage.getItem("archivedCards")) || [];
  const archiveSection = document.querySelector(".archived-cards");

  archivedCards.forEach((cardHTML) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;
    const card = tempDiv.firstChild;
    archiveSection.appendChild(card);
  });

  const boardCards = JSON.parse(localStorage.getItem("boardCards")) || [];

  boardCards.forEach((cardHTML) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;
    const card = tempDiv.firstChild;
    container.appendChild(card);
  });
}

// Restore State on Page Load
restoreState();

// Add Event Listener to Archive Section for Moving Cards Back
const archiveSection = document.querySelector(".archived-cards");
archiveSection.addEventListener("click", (e) => {
  if (e.target.classList.contains("restoreBtn")) {
    const cardToRestore = e.target.closest(".card");
    if (cardToRestore) {
      moveCardToBoard(cardToRestore);
    }
  }
});

// Add Restore Button to Archived Cards
function addRestoreButton(card) {
  const restoreButton = document.createElement("button");
  restoreButton.textContent = "Restore";
  restoreButton.classList.add("restoreBtn");
  card.appendChild(restoreButton);
}
