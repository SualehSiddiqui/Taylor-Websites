import {
    auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, doc, setDoc
} from './firebase.js'
const userUid = localStorage.getItem("userUid");

if (!userUid && window.location.pathname != "/index.html" && window.location.pathname != "/register/index.html") {
    window.location.replace("/index.html")
} else if (userUid && window.location.pathname != "/card/index.html") {
    window.location.replace("/card/index.html")
    console.log("User is signed out")
}

const spinner = document.getElementById('spinner-div')


const loginUser = () => {
    spinner.style.display = 'block';
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    console.log('email', email.value, 'password', password.value);
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("userUid", `${user.uid}`);
            window.location.replace("/card/index.html")
            spinner.style.display = 'none';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorMessage', errorMessage);
            Swal.fire({
                customClass: {
                    text: 'swal2-title'
                },
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
            spinner.style.display = 'none';
        });
}

const loginBtn = document.getElementById('login-btn');
loginBtn && loginBtn.addEventListener('click', loginUser);

const signUser = () => {
    spinner.style.display = 'block';
    let email = document.getElementById("sign-email");
    let password = document.getElementById("sign-password");
    let name = document.getElementById("sign-name");
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    uid: user.uid,
                });
                localStorage.setItem("userUid", `${user.uid}`)
                window.location.replace("/card/index.html")
                spinner.style.display = 'none';
            }
            catch (e) {
                console.log("Error", e)
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errorMessage", errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
            spinner.style.display = 'none';
        });
}

const signBtn = document.getElementById('sign-btn');
signBtn && signBtn.addEventListener('click', signUser);
