import {
  db, addDoc, collection, getDocs, deleteDoc, doc, query, where, updateDoc, getDoc, signOut, auth
} from '../firebase.js';

const userUid = localStorage.getItem("userUid");

let edit = false;

// Function to create measurement cards
function createCard(measurement, index, id) {
  const card = document.createElement('div');
  card.classList.add('card');
  const html = `
    <p class="delete" data-index="${index}" onclick="deleteCard('${id}')">&times;</p>
    <h2>Customer: ${measurement.customer}</h2>
    <p>Shirt Length: ${measurement.shirtLength}</p>
    <p>Chest: ${measurement.chest}</p>
    <p>Waist: ${measurement.waist}</p>
    <p>Sleeve Length: ${measurement.sleeveLength}</p>
    <p>Additional Information: ${measurement.additionalInfo}</p>
    <button type="button" class="btn btn-outline-success" onclick="editCard('${id}')">Edit</button>
  `;

  card.innerHTML = html;
  return card;
}

// Function to render measurement cards
const renderCards = async () => {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';

  const q = query(collection(db, "measurements"), where("uid", "==", userUid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc, index) => {
    // doc.data() is never undefined for query doc snapshots
    const card = createCard(doc.data(), index, doc.id);
    cardContainer.appendChild(card);

  })
}

// Function to filter measurement cards based on search input
const filterCards = async () => {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';
  const searchInput = document.getElementById('searchInput').value;
  console.log('filterCards', searchInput, userUid)

  const startSearch = searchInput;
  const endSearch = searchInput + '\uf8ff'; // '\uf8ff' is a special Unicode character
  const q = query(collection(db, "measurements"),
    where("customer", ">=", startSearch),
    where("customer", "<=", endSearch),
    where("uid", "==", userUid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc, index) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    const card = createCard(doc.data(), index, doc.id);
    cardContainer.appendChild(card);
  });

  // renderFilteredCards(filteredMeasurements);
}

// Event listener for search input
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', filterCards);

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
  let updateDocId = document.getElementById('update-doc-id').value;
  if (!edit) {
    const docRef = await addDoc(collection(db, "measurements"), {
      customer: customerName,
      shirtLength: shirtLength,
      chest: chest,
      waist: waist,
      sleeveLength: sleeveLength,
      additionalInfo: additionalInfo,
      uid: userUid
    });
    console.log("Document written with ID: ", docRef.id);
    Swal.fire({
      title: "Added!",
      text: "Your measurement has been saved",
      icon: "success"
    });
    renderCards(); // Render the updated cards
    modal.style.display = 'none'; // Close the modal
    customerName = "";
    shirtLength = "";
    chest = "";
    waist = "";
    sleeveLength = "";
    additionalInfo = "";
  }
  else {
    console.log(updateDocId)
    const measurementRef = doc(db, "measurements", updateDocId);
    await updateDoc(measurementRef, {
      customer: customerName,
      shirtLength: shirtLength,
      chest: chest,
      waist: waist,
      sleeveLength: sleeveLength,
      additionalInfo: additionalInfo,
      uid: userUid
    });
    Swal.fire({
      title: "Updated!",
      text: "Your measurement has been updated",
      icon: "success"
    });
    renderCards(); // Render the updated cards
    modal.style.display = 'none'; // Close the modal
    customerName = "";
    shirtLength = "";
    chest = "";
    waist = "";
    sleeveLength = "";
    additionalInfo = "";
  }
}
// Handle form submission for adding new measurements
document.getElementById('addMeasurementForm').addEventListener('submit', addCard);

//Delete Card

const deleteCard = async (id) => {
  await deleteDoc(doc(db, "measurements", `${id}`));
  renderCards();
  Swal.fire({
    title: "Deleted!",
    text: "Your measurement has been deleted",
    icon: "warning"
  });
}

const editCard = async (id) => {
  console.log('id', id);
  const docRef = doc(db, "measurements", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const measurementData = docSnap.data();
    console.log(measurementData);

    // Populate input fields with data from the measurement object
    document.getElementById('customer-name').value = measurementData.customer;
    document.getElementById('shirt-length').value = measurementData.shirtLength;
    document.getElementById('chest').value = measurementData.chest;
    document.getElementById('waist').value = measurementData.waist;
    document.getElementById('sleeve-length').value = measurementData.sleeveLength;
    document.getElementById('additional-info').value = measurementData.additionalInfo;
    document.getElementById('update-doc-id').value = id;

    modal.style.display = 'block';
    edit = true;
  } else {
    console.log("No such document!");
  }
}

window.deleteCard = deleteCard;
window.editCard = editCard;


const logout = () => {
  signOut(auth).then(() => {
    localStorage.clear()
    window.location.replace("index.html")
    console.log('logout', window.location)
  }).catch((error) => {
    // An error happened.
    console.log("erroe", error)
  });
}


const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', logout);

if (!userUid && window.location.pathname != "/index.html" && window.location.pathname != "/register/index.html") {
  window.location.replace("/index.html")
} else if (userUid && window.location.pathname != "/card/index.html") {
  window.location.replace("/card/index.html")
  console.log("User is signed out")
}