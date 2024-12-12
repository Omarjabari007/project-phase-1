const editButtons = document.querySelectorAll(".editBtn");
const textContent = document.querySelector(".text-content");
const card = document.querySelector(".card");
const colorBtn = document.querySelector(".colors");
const dateAdd = document.querySelectorAll(".date");
const container = document.querySelector(".container");
const addBtn = document.getElementById("addBtn");
const textedit = document.querySelector('text-content');
// Changing Card Colors diligation
colorBtn.addEventListener("click", (e) => {
  if (e.target.classList.contains("color")) {
    const selectedColor = e.target.getAttribute("data-color");
    card.style.backgroundColor = selectedColor;
    card.style.borderColor = selectedColor;
    card.style.boxShadow = `0 0 10px ${selectedColor}`;
  }
});

//Deleting card diligation
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("deleteBtn") ||
    e.target.classList.contains("textD")
  ) {
    const cardToDelete = e.target.closest(".card");
    if (cardToDelete) {
      cardToDelete.remove();
    }
  }
});
// printing Date
const printDate = (cardElement) => {
  const date = new Date();
  const formattedDate = date.toLocaleString();

  const dateElement = document.createElement("p");
  dateElement.classList.add("date");
  dateElement.style.fontSize = "0.9rem";
  dateElement.style.color = "gray";
  dateElement.textContent = `Date added: ${formattedDate}`;
  cardElement.appendChild(dateElement);
};
document.querySelectorAll(".card").forEach((card) => {
  printDate(card);
});


// Editing Card



container.addEventListener("click", (event) => {
  if (event.target.closest(".editBtn")) {
    const btn = event.target.closest(".editBtn");

    const card = btn.closest(".card");

    const textContent = card.querySelector(".text-content");

    const textarea = document.createElement("textarea");
    textarea.value = textContent.textContent.trim();
    textarea.style.width = "100%";
    textarea.style.height = "100px";
    textarea.style.marginBottom = "20px";

    card.replaceChild(textarea, textContent);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.style.display = "block";
    saveButton.style.margin = "10px auto";
    saveButton.style.padding = "10px 20px";
    saveButton.style.backgroundColor = "#2196f3";
    saveButton.style.color = "white";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";

    card.appendChild(saveButton);

    saveButton.addEventListener("click", () => {
      const updatedText = textarea.value;
      textContent.textContent = updatedText;
      card.replaceChild(textContent, textarea);
      card.removeChild(saveButton);
    });
  }
});
//Adding the Button for cards
addBtn.addEventListener("click",()=>{
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
  newCard.classList.add('newCard');
  // newCard.style.left='100px';
  let left1 = Math.random()*100;
  newCard.style.left = left1;
  newCard.style.top = left1;
  console.log(left1);
  
  printDate(newCard);
  container.appendChild(newCard);
})
