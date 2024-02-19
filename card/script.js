import {
  db, addDoc, collection, getDocs, deleteDoc, doc, query, where
} from '../firebase.js';

const userUid = localStorage.getItem("userUid");


const measurements = [
  {
    customer: 'John Doe',
    shirtLength: '30 inches',
    chest: '40 inches',
    waist: '36 inches',
    sleeveLength: '25 inches',
    additionalInfo: 'Some additional info'
  },
  { customer: 'Jane Smith', shirtLength: '32 inches', chest: '38 inches', waist: '34 inches', sleeveLength: '24 inches', additionalInfo: 'More details' },
  { customer: 'Hassam Ovais', shirtLength: '28 inches', chest: '42 inches', waist: '38 inches', sleeveLength: '26 inches', additionalInfo: 'Extra notes' },
  { customer: 'Michael Johnson', shirtLength: '28 inches', chest: '42 inches', waist: '38 inches', sleeveLength: '26 inches', additionalInfo: 'Additional details' }
];

// Function to create measurement cards
function createCard(measurement, index, id) {
  const card = document.createElement('div');
  card.classList.add('card');

  const html = `
    <span class="delete" data-index="${index}" onclick="deleteCard('${id}')">&times;</span>
    <h2>Customer: ${measurement.customer}</h2>
    <p>Shirt Length: ${measurement.shirtLength}</p>
    <p>Chest: ${measurement.chest}</p>
    <p>Waist: ${measurement.waist}</p>
    <p>Sleeve Length: ${measurement.sleeveLength}</p>
    <p>Additional Information: ${measurement.additionalInfo}</p>
  `;

  card.innerHTML = html;
  return card;
}

// Function to render measurement cards
const renderCards = async () => {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "measurements"));
  querySnapshot.forEach((doc, index) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    const card = createCard(doc.data(), index, doc.id);
    cardContainer.appendChild(card);

  })
}

// Function to filter measurement cards based on search input
async function filterCards() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  const q = query(collection(db, "measurements"), where("customer", "==", searchInput, "uid", "==", userUid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });

  renderFilteredCards(filteredMeasurements);
}

// Function to render filtered measurement cards
function renderFilteredCards(filteredMeasurements) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';

  filteredMeasurements.forEach((measurement, index) => {
    const card = createCard(measurement, index);
    cardContainer.appendChild(card);
  });

  // Add event listeners to delete icons
  const deleteIcons = document.querySelectorAll('.delete');
  deleteIcons.forEach(icon => {
    icon.addEventListener('click', function () {
      const index = parseInt(this.dataset.index);
      measurements.splice(index, 1);
      renderFilteredCards(filteredMeasurements.filter((_, i) => i !== index));
    });
  });
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('keyup', filterCards);

// Initial rendering of measurement cards
renderCards();

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById('addCardBtn');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};


const addCard = async (event) => {
  event.preventDefault();

  let customerName = document.getElementById('customer-name').value;
  let shirtLength = document.getElementById('shirt-length').value;
  let chest = document.getElementById('chest').value;
  let waist = document.getElementById('waist').value;
  let sleeveLength = document.getElementById('sleeve-length').value;
  let additionalInfo = document.getElementById('additional-info').value;

  const docRef = await addDoc(collection(db, "measurements"), {
    customer: customerName,
    shirtLength: shirtLength,
    chest: chest,
    waist: waist,
    sleeveLength: sleeveLength,
    additionalInfo: additionalInfo
  });
  console.log("Document written with ID: ", docRef.id);
  renderCards(); // Render the updated cards
  modal.style.display = 'none'; // Close the modal
  customerName = "";
  shirtLength = "";
  chest = "";
  waist = "";
  sleeveLength = "";
  additionalInfo = "";
}
// Handle form submission for adding new measurements
document.getElementById('addMeasurementForm').addEventListener('submit', addCard);


//Delete Card

const deleteCard = async (id) => {
  await deleteDoc(doc(db, "measurements", `${id}`));
  console.log('deleted')
  renderCards();
}

window.deleteCard = deleteCard
