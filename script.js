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
/*Calc Space*/
document.querySelector(".disagree").addEventListener("mouseover", function () {
  const container = this.parentElement;
  const containerRect = container.getBoundingClientRect();
  const randomX = Math.random() * (containerRect.width - this.offsetWidth);
  const randomY = Math.random() * (containerRect.height - this.offsetHeight);
  this.style.left = `${randomX}px`;
  this.style.top = `${randomY}px`;
});

//MOUSE
container.addEventListener("mouseover", (event) => {
  const target = event.target;
  if (target.closest(".card")) {
    const card = target.closest(".card");
    showButtons(card);
    showColors(card);
  }
});

container.addEventListener("mouseout", (event) => {
  const target = event.target;
  if (target.closest(".card")) {
    const card = target.closest(".card");
    hideButtons(card);
    hideColors(card);
  }
});

//CLICK
container.addEventListener("click", (event) => {
  const target = event.target;

  // ..Color card.
  if (target.classList.contains("color")) {
    changeCardColor(target);
  }

  // ..Delete Card
  if (target.classList.contains("deleteBtn")) {
    archiveCard(target);
    deleteCard(target);
  }

  // ..Edit Card
  if (target.classList.contains("editBtn")) {
    editCard(target);
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
// Function to showButtons
function showButtons(card) {
  const buttons = card.querySelector(".edBtns");
  if (buttons) {
    buttons.style.display = "block";
  }
}

// Function to hide buttons
function hideButtons(card) {
  const buttons = card.querySelector(".edBtns");
  if (buttons) {
    buttons.style.display = "none";
  }
}

// Function to show colors
function showColors(card) {
  const colors = card.querySelector(".colors");
  if (colors) {
    colors.style.display = "flex";
  }
}

// Function to hide colors
function hideColors(card) {
  const colors = card.querySelector(".colors");
  if (colors) {
    colors.style.display = "none";
  }
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

document.querySelectorAll(".card").forEach((card) => {
  printDate(card);
  makeCardDraggable(card); 
});


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
  const nav = document.querySelector(".nav"); 

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
  
  container.appendChild(newCard);
  saveToLocalStorage();
});

// Search functionality
searchInput.addEventListener("input", (event) => {
  const term = event.target.value.toLowerCase(); 
  const cards = document.querySelectorAll(".card"); 
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
    archiveBtn.classList.add("archiveBtn");
    archiveBtn.classList.remove("activeArchieved");
    createBoardElement;
  });

  boardContainer.appendChild(boardElement);

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
    archiveBtn.classList.add("archiveBtn");
    archiveBtn.classList.remove("activeArchieved");
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
const archiveCard = (deleteButton) => {
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
};

function displayArchivedCards() {
  container.innerHTML = "";
  const storedArchive = JSON.parse(localStorage.getItem("archive")) || [];
  storedArchive.forEach((cardData) => {
    const card = createCardElement(cardData); 

    card.style.opacity = "0.9";
    card.style.background = "#FFF59D";

    container.appendChild(card);
    makeCardDraggable(card); 
  });
  remove();
}
const remove = () => {
  document.querySelectorAll(".edBtns").forEach((btn) => {
    btn.classList.remove("edBtns");
    btn.classList.add("edBtns1");
  });
};

// Event Listener for Archive Button
archiveBtn.addEventListener("click", () => {
  console.log("clicked");
  archiveBtn.classList.remove("archiveBtn");
  archiveBtn.classList.add("activeArchieved");
  displayArchivedCards();
  activeBoard = null;
  document.querySelectorAll(".BoardList span").forEach((span) => {
    span.classList.remove("active");
  });
});

console.log(container.offsetWidth);
console.log(container.offsetHeight);
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  console.log(nav.offsetHeight);
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const container = document.querySelector(".container");

  if (nav && container) {
    console.log(container.offsetHeight - nav.offsetHeight);
  } else {
    if (!nav) console.error("The .nav element is not found in the DOM.");
    if (!container) console.error("The .container element is not found in the DOM.");
  }
});
