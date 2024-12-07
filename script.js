const card = document.querySelector(".card");
const colors = document.querySelectorAll(".color");
const deleteButtons = document.querySelectorAll(".deleteBtn");

//Changing the colors
colors.forEach((color) => {
  color.addEventListener("click", () => {
    const selectedColor = color.getAttribute("data-color");
    card.style.borderColor = selectedColor;
    card.style.boxShadow = `0 0 10px ${selectedColor}`;
    card.style.backgroundColor = selectedColor;
  });
});
// Removeing the card
deleteButtons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const cardToDelete = event.target.closest(".card"); // Find the closest parent card
    cardToDelete.remove();
  });
});
