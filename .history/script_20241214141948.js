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
const archiveButton = document.querySelector(".Archived");
const navList = document.querySelector(".UnOrderdBoardList");
let archiveTabCreated = false; // To ensure we don't create duplicate tabs

archiveButton.addEventListener("click", () => {
  if (!archiveTabCreated) {
    // Create the Archive Tab
    const archiveTab = document.createElement("li");
    archiveTab.classList.add("BoardList");
    archiveTab.innerHTML = `<a href="#archiveSection">Archive</a>`;
    navList.appendChild(archiveTab);

    // Create the Archive Section
    const archiveSection = document.createElement("div");
    archiveSection.id = "archiveSection";
    archiveSection.style.display = "none"; // Initially hidden
    archiveSection.innerHTML = `
      <h2>Archived Notes</h2>
      <div class="archived-cards"></div>
    `;
    document.body.appendChild(archiveSection);

    archiveTabCreated = true;

    // Add click event to show the archive section when the tab is clicked
    archiveTab.addEventListener("click", () => {
  // Only toggle visibility for sections you want to manage
  const sections = [document.querySelector(".container"), archiveSection];
  
  sections.forEach((section) => {
    if (section === archiveSection) {
      section.style.display = "block"; // Show the archive section
    } else {
      section.style.display = "none"; // Hide other sections 
    }
  });
});
  }
});


container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("deleteBtn") ||
    e.target.classList.contains("textD")
  ) {
    const cardToArchive = e.target.closest(".card");
    if (cardToArchive) {
      // Move the card to the archive section
      const archiveSection = document.querySelector(".archived-cards");
      archiveSection.appendChild(cardToArchive);

      // Optional: Disable interactions in the archived cards
      cardToArchive.style.opacity = "0.7";
      cardToArchive.style.pointerEvents = "none";

      // Show archive section if accessed through the tab
      archiveContainer.style.display = "block";
    }
  }
});
