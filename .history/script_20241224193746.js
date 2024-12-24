const container = document.querySelector(".container");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("search");
const addBoard = document.getElementById("newBoard");
const boardContainer = document.getElementById("addBoard");
let count = JSON.parse(localStorage.getItem("count")) || 0;
let activeBoard = null;
const boards = [];
const modal = document.querySelector(".model");
const overlay = document.querySelector(".overLay");
const okButton = document.querySelector(".agreement");
const archiveBtn = document.querySelector(".Archived");
const archive = JSON.parse(localStorage.getItem("archive")) || [];

// Overlay
window.addEventListener("load", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}
okButton.addEventListener("click", closeModal);

container.addEventListener("click", (event) => {
  const target = event.target;

  // Card color change.
  if (target.classList.contains("color")) {
    changeCardColor(target);
  }

  // ..Delete Card
  if (target.classList.contains("deleteBtn")) {
    archiveCard(target);
    deleteCard(target);
  }

  // ..Edit Card
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
  const board = boards.find((b) => b.id === activeBoard);
  if (board) {
    const cardIndex = board.cards.findIndex((card) => card === cardToDelete);
    if (cardIndex !== -1) {
      board.cards.splice(cardIndex, 1);
    }
  }
  cardToDelete.remove();
  saveToLocalStorage();
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
    saveToLocalStorage();
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

// To Make Cards Draggable (for existing cards)
function makeCardDraggable(card) {
  let startX = 0,
    startY = 0,
    offsetX = 0,
    offsetY = 0;

  card.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;

    const mouseMoveHandler = (e) => {
      offsetX = e.clientX - startX;
      offsetY = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      card.style.position = "absolute";
      card.style.top = `${card.offsetTop + offsetY}px`;
      card.style.left = `${card.offsetLeft + offsetX}px`;
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    saveToLocalStorage();
  });
}

// Add date to all cards
document.querySelectorAll(".card").forEach((card) => {
  printDate(card);
  makeCardDraggable(card); // Make existing cards draggable ..
});

// Adding the Button for cards
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
  const nav = document.querySelector(".nav"); //create random locations for cards under nav
  const navHeight = nav ? nav.offsetHeight : 0;

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const cardWidth = 300;
  const cardHeight = 200;

  const randomLeft = Math.random() * (containerWidth - cardWidth);
  const randomTop =
    Math.random() * (containerHeight - navHeight - cardHeight + 240);

  newCard.style.position = "absolute";
  newCard.style.left = `${randomLeft}px`;
  newCard.style.top = `${randomTop}px`;

  const activeBoardObj = boards.find((board) => board.id === activeBoard);
  activeBoardObj.cards.push(newCard);

  printDate(newCard);
  makeCardDraggable(newCard);
  // Make the new card draggable ..
  container.appendChild(newCard);
  saveToLocalStorage();
});

// Search functionality
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

// Listener for Add Board Button
addBoard.addEventListener("click", () => {
  count++;
  localStorage.setItem("count", JSON.stringify(count));
  const boardId = `board ${count}`;
  activeBoard = boardId;
  const newBoard = {
    id: boardId,
    active: false,
    cards: [],
  };
  boards.push(newBoard);

  const boardElement = document.createElement("li");
  boardElement.classList.add("BoardList");
  boardElement.innerHTML = `<span>${boardId}</span>`;
  boardElement.addEventListener("click", () => {
    setActiveBoard(boardId, boardElement);
  });

  boardContainer.appendChild(boardElement);

  // If it's a new board, set it as active
  setActiveBoard(boardId, boardElement);
  saveToLocalStorage();
});

function setActiveBoard(boardId, boardElement) {
  activeBoard = boardId;

  // Remove the active class from all boards
  document.querySelectorAll(".BoardList span").forEach((span) => {
    span.classList.remove("active");
  });

  // Highlight the active board
  boardElement.querySelector("span").classList.add("active");
  // Clear the container and add cards for the selected board
  container.innerHTML = "";
  const activeBoardObj = boards.find((board) => board.id === boardId);
  if (activeBoardObj) {
    activeBoardObj.cards.forEach((card) => {
      container.appendChild(card);
    });
  }
  saveToLocalStorage();
}

//this function save the state of the program to local storage
const saveToLocalStorage = () => {
  const boardsData = boards.map((board) => ({
    id: board.id,
    active: board.id === activeBoard,
    cards: board.cards.map((card) => ({
      content: card.querySelector(".text-content")
        ? card.querySelector(".text-content").textContent.trim()
        : "",
      color: card.style.backgroundColor,
      position: { left: card.style.left, top: card.style.top },
      dateAdded: card.querySelector(".date").textContent,
    })),
  }));
  localStorage.setItem("boards", JSON.stringify(boardsData));
};

//this function is to load the program from local storage
const loadFromLocalStorage = () => {
  const storedBoards = JSON.parse(localStorage.getItem("boards"));
  if (storedBoards) {
    storedBoards.forEach((storedBoard) => {
      const board = {
        id: storedBoard.id,
        active: storedBoard.active,
        cards: [],
      };
      boards.push(board);

      const boardElement = createBoardElement(storedBoard);
      boardContainer.appendChild(boardElement);

      if (storedBoard.active) {
        setActiveBoard(storedBoard.id, boardElement);
      }

      storedBoard.cards.forEach((cardData) => {
        const card = createCardElement(cardData);
        board.cards.push(card);
        // container.appendChild(card);
        makeCardDraggable(card);
      });
    });
  }
  container.innerHTML = "";
  const activeBoardObj = boards.find((board) => board.id === activeBoard);
  if (activeBoardObj) {
    activeBoardObj.cards.forEach((card) => {
      container.appendChild(card);
    });
  }
};
// to create the board instead of using this above
function createBoardElement(board) {
  const boardElement = document.createElement("li");
  boardElement.classList.add("BoardList");
  boardElement.innerHTML = `<span>${board.id}</span>`;
  boardElement.addEventListener("click", () => {
    setActiveBoard(board.id, boardElement);
  });
  return boardElement;
}

// and this create the card when loadign from local storage
function createCardElement(cardData) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.style.position = "absolute";
  card.style.left = cardData.position.left;
  card.style.top = cardData.position.top;
  card.style.backgroundColor = cardData.color;

  card.innerHTML = `
    <p class="text-content">${cardData.content}</p>
    <ul class="colors">
      <li class="color red" data-color="#FBCEB1"></li>
      <li class="color green" data-color="#ACE1AF"></li>
      <li class="color yellow" data-color="#c5c800"></li>
      <li class="color blue" data-color="#7CB9E8"></li>
      <li class="color orangered" data-color="#FFB000"></li>
    </ul>
    <div class="edBtns">
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </div>
  `;

  const dateElement = document.createElement("p");
  dateElement.classList.add("date");
  dateElement.textContent =
    cardData.dateAdded || `Date added: ${new Date().toLocaleString()}`;
  card.appendChild(dateElement);

  return card;
}

//this when loading the page to load it from local storage
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});

archiveBtn.addEventListener("click", () => {
  displayArchivedCards();
});

// Archive Card Function
const  archiveCard = (deleteButton) =>{
  const cardToDelete = deleteButton.closest(".card");
  if (!cardToDelete) {
    alert("Card not found for deletion");
    return;
  }
  const cardData = {
    content: cardToDelete.querySelector(".text-content").textContent.trim(),
    color: cardToDelete.style.backgroundColor,
    position: {
      left: cardToDelete.style.left,
      top: cardToDelete.style.top,
    },
    dateAdded: cardToDelete.querySelector(".date").textContent,
  };

  // Add the card data to the archive array
  archive.push(cardData);

  // Save the archive array to local storage
  localStorage.setItem("archive", JSON.stringify(archive));

  saveToLocalStorage();
}


function displayArchivedCards() {
  container.innerHTML = ""; 
  const storedArchive = JSON.parse(localStorage.getItem("archive")) || [];
  storedArchive.forEach((cardData) => {
    const card = createCardElement(cardData); // Reuse the createCardElement function
    card.style.opacity = "0.9"; 
    card.style.background='#FFF59D';
    container.appendChild(card);
    makeCardDraggable(card); // Make it draggable
  });
}

// Event Listener for Archive Button
archiveBtn.addEventListener("click", () => {
  console.log("clicked");
  archiveBtn.classList.remove('archiveBtn');
  archiveBtn.classList.add('activeArchieved');
  displayArchivedCards();
  activeBoard = null;
  document.querySelectorAll(".BoardList span").forEach((span) => {
    span.classList.remove("active");
  });
});