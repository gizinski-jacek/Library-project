'use strict';

import { initializeApp } from 'firebase/app';
import {
	getAuth,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import {
	getFirestore,
	setDoc,
	doc,
	getDoc,
	deleteDoc,
	serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBdxAR9GbaZB7qRSZyy8NEK0BNfpQTyCMc',
	authDomain: 'library-project-6bbad.firebaseapp.com',
	projectId: 'library-project-6bbad',
	storageBucket: 'library-project-6bbad.appspot.com',
	messagingSenderId: '879469218195',
	appId: '1:879469218195:web:68dfc4d8cc1fdfe79f0066',
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDB = getFirestore(firebaseApp);

const signInUser = async () => {
	let provider = new GoogleAuthProvider();
	await signInWithPopup(getAuth(), provider);
	document.getElementById('signIn').setAttribute('hidden', 'true');
	document.getElementById('signOut').removeAttribute('hidden');
};

const signOutUser = () => {
	signOut(getAuth());
	document.getElementById('signIn').removeAttribute('hidden');
	document.getElementById('signOut').setAttribute('hidden', 'true');
};

const getProfilePicUrl = () => {
	return getAuth().currentUser.photoURL;
};

const getUserName = () => {
	return getAuth().currentUser.displayName;
};

const getUserID = () => {
	return getAuth().currentUser.uid;
};

const isUserSignedIn = () => {
	return !!getAuth().currentUser;
};

const onDataHandle = (e) => {
	e.preventDefault();
	const { id } = e.target;
	if (isUserSignedIn()) {
		if (id === 'loadLib') {
			loadUserData();
		}
		if (id === 'saveLib') {
			saveUserData(myLibrary);
		}
		if (id === 'wipeLib') {
			wipeUserData();
		}
	} else {
		alert('Sign in with your account to use this functionality.');
	}
};

const loadUserData = async () => {
	try {
		const docData = await getDoc(
			doc(firebaseDB, 'usersLibraries', getUserName() + getUserID())
		);
		if (docData.exists()) {
			myLibrary = docData.data().lib;
			clearDisplay();
			showLibrary();
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
		}
	} catch (error) {
		console.log('Error reading data from Firebase Database: ', error);
	}
};

const saveUserData = async (data) => {
	try {
		await setDoc(
			doc(firebaseDB, 'usersLibraries', getUserName() + getUserID()),
			{
				name: getUserName(),
				lib: data,
				timestamp: serverTimestamp(),
			}
		);
	} catch (error) {
		console.error('Error writing new data to Firebase Database: ', error);
	}
};

const wipeUserData = async () => {
	if (
		confirm(
			'Are you sure you want to wipe all your data? This is irreversible!'
		)
	) {
		try {
			await deleteDoc(
				doc(firebaseDB, 'usersLibraries', getUserName() + getUserID())
			);
		} catch (error) {
			console.log('Error deleting data from Firebase Database: ', error);
		}
	}
};

const authStateObserver = (user) => {
	if (user) {
		document.querySelector('.userProfilePic').src = getProfilePicUrl();
		document.querySelector('.userName').textContent = getUserName();

		document.querySelector('.userProfilePic').removeAttribute('hidden');
		document.querySelector('.userName').removeAttribute('hidden');
		document.querySelector('#signOut').removeAttribute('hidden');
		document.querySelector('#signIn').setAttribute('hidden', 'true');
	} else {
		document
			.querySelector('.userProfilePic')
			.setAttribute('hidden', 'true');
		document.querySelector('.userName').setAttribute('hidden', 'true');
		document.querySelector('#signIn').removeAttribute('hidden');
		document.querySelector('#signOut').setAttribute('hidden', 'true');
	}
};

const initFirebaseAuth = () => {
	onAuthStateChanged(getAuth(), authStateObserver);
};

const mainContainer = document.getElementById('mainContainer');
const newBookForm = document.getElementById('newBookForm');
const loadLibrary = document.getElementById('loadLib');
const saveLibrary = document.getElementById('saveLib');
const wipeLibrary = document.getElementById('wipeLib');
const signInBtn = document.getElementById('signIn');
const signOutBtn = document.getElementById('signOut');

newBookForm.querySelector('.readPages').addEventListener('input', () => {
	let rp = newBookForm.querySelector('.readPages');
	let ap = newBookForm.querySelector('.allPages');
	if (rp.value > ap.value) {
		rp.setCustomValidity(
			"You've read more pages than the book has them in total?"
		);
	} else {
		rp.setCustomValidity('');
	}
});

newBookForm.addEventListener('submit', (e) => {
	let a = newBookForm.querySelector('.author');
	let t = newBookForm.querySelector('.title');
	let rp = newBookForm.querySelector('.readPages');
	let ap = newBookForm.querySelector('.allPages');
	if (
		a.validity.valid &&
		t.validity.valid &&
		rp.validity.valid &&
		ap.validity.valid
	) {
		addToLibrary(a, t, rp, ap);
	}
	e.preventDefault();
});

let myLibrary = [];

class Book {
	constructor(author, title, readPages, allPages) {
		this.author = author;
		this.title = title;
		this.readPages = readPages;
		this.allPages = allPages;
	}
}

loadLibrary.addEventListener('click', (e) => {
	onDataHandle(e);
	clearDisplay();
	showLibrary();
});

saveLibrary.addEventListener('click', (e) => {
	onDataHandle(e);
	saveLib();
});
wipeLibrary.addEventListener('click', (e) => {
	onDataHandle(e);
	wipeLib();
});

signInBtn.addEventListener('click', signInUser);
signOutBtn.addEventListener('click', signOutUser);

// Load library from local storage. Create new one if it's empty.
function loadLib() {
	myLibrary = JSON.parse(localStorage.getItem('localLibrary'));
	if (myLibrary == null) {
		myLibrary = [];
		if (
			confirm(
				'No saved library found. Do you want to load example library?'
			)
		) {
			loadRandomLib();
			saveLib();
		}
	} else {
		return myLibrary;
	}
}

// Save library to local storage.
function saveLib() {
	localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
}

// Wipe entire local storage and update display.
function wipeLib() {
	if (confirm('Are you sure you want to wipe? This is irreversible!')) {
		localStorage.clear();
		myLibrary = [];
		clearDisplay();
		showLibrary();
	}
}

function addToLibrary(author, title, readPages, allPages) {
	let newBook = new Book(
		author.value,
		title.value,
		Number(readPages.value),
		Number(allPages.value)
	);
	myLibrary.push(newBook);
	saveLib();
	loadLib();
	clearDisplay();
	showLibrary();
	newBookForm.reset();
}

function updateBookInLibrary(index, author, title, readPages, allPages) {
	let updatedBook = new Book(
		author.value,
		title.value,
		Number(readPages.value),
		Number(allPages.value)
	);
	myLibrary.splice(index, 1, updatedBook);
	saveLib();
	loadLib();
	clearDisplay();
	showLibrary();
	newBookForm.reset();
}

// Display books in the library.
function showLibrary() {
	let i = 0;
	while (i < myLibrary.length) {
		let showBook = newBookForm.cloneNode(true);
		showBook.className = 'book';
		showBook.setAttribute('id', i);
		showBook.removeChild(showBook.childNodes[7]);
		showBook.querySelector('.author').value = myLibrary[i].author;
		showBook.querySelector('.title').value = myLibrary[i].title;
		showBook.querySelector('.readPages').value = myLibrary[i].readPages;
		showBook.querySelector('.allPages').value = myLibrary[i].allPages;

		let newDeleteButton = document.createElement('button');
		newDeleteButton.className = 'deleteBookBtn';
		newDeleteButton.setAttribute('type', 'button');
		newDeleteButton.textContent = 'DELETE';
		showBook.appendChild(newDeleteButton);

		let updateStatusButton = document.createElement('button');
		updateStatusButton.classList.add('updateBookBtn');
		updateStatusButton.setAttribute('type', 'button');
		updateStatusButton.textContent = 'UPDATE';
		showBook.appendChild(updateStatusButton);

		mainContainer.insertBefore(showBook, newBookForm);
		i++;
	}
	removeBook(document.querySelectorAll('.deleteBookBtn'));
	updateBook(document.querySelectorAll('.updateBookBtn'));
	decrementBtn(document.querySelectorAll('.decrement'));
	incrementBtn(document.querySelectorAll('.increment'));
}

// Check if values provided in the new book form are valid.
function checkValuesValidity(a, t, readP, allP) {
	readP = Number(readP);
	allP = Number(allP);
	if (a == '' && t == '' && readP == '' && allP == '') {
		alert('All fields are empty!');
		return false;
	} else if (isNaN(readP) || isNaN(allP)) {
		alert('Pages are counted in numbers!');
		return false;
	} else if (!Number.isInteger(readP) || !Number.isInteger(allP)) {
		alert('Use whole numbers for page count!');
		return false;
	} else if (readP > allP) {
		alert("You've read more pages than the book has?");
		return false;
	} else {
		return true;
	}
}

// Removes all elements in main container except for new book form.
function clearDisplay() {
	while (mainContainer.firstChild.id !== 'newBookForm') {
		mainContainer.removeChild(mainContainer.firstChild);
	}
}

// Removes targeted book from library and updates books displayed.
function removeBook(deleteBtn) {
	deleteBtn.forEach((button) => {
		button.addEventListener('click', (e) => {
			if (confirm('Remove this book from display?')) {
				myLibrary.splice(e.target.closest('form').id, 1);
				e.target.closest('form').remove();
			}
		});
	});
}

// Updates targeted book by grabing values from it's form, creating new book
// with updated values and splicing it in place of old book.
function updateBook(updateBtn) {
	updateBtn.forEach((button) => {
		button.addEventListener('click', (e) => {
			if (confirm('Update this book?')) {
				let form = e.target.closest('form');
				let a = form.querySelector('.author');
				let t = form.querySelector('.title');
				let rp = form.querySelector('.readPages');
				let ap = form.querySelector('.allPages');
				updateBookInLibrary(form.id, a, t, rp, ap);
			}
		});
	});
}

function decrementBtn(decrementBtn) {
	decrementBtn.forEach((button) => {
		button.addEventListener('click', (e) => {
			let nodes = e.target.parentElement;
			if (e.target.classList.contains('read')) {
				nodes.querySelector('.readPages').value = decrementValue(
					nodes.querySelector('.readPages').value
				);
			} else if (e.target.classList.contains('all')) {
				if (
					nodes.querySelector('.readPages').value ==
					nodes.querySelector('.allPages').value
				) {
					nodes.querySelector('.readPages').value = decrementValue(
						nodes.querySelector('.readPages').value
					);
				}
				nodes.querySelector('.allPages').value = decrementValue(
					nodes.querySelector('.allPages').value
				);
			}
		});
	});
}

function decrementValue(value) {
	value = parseInt(value);
	value = isNaN(value) ? 0 : value;
	value = value < 0 ? 0 : value;
	if (value > 0) {
		value--;
	}
	return value;
}

function incrementBtn(incrementBtn) {
	incrementBtn.forEach((button) => {
		button.addEventListener('click', (e) => {
			let nodes = e.target.parentElement;
			if (e.target.classList.contains('read')) {
				if (
					nodes.querySelector('.readPages').value ==
					nodes.querySelector('.allPages').value
				) {
					nodes.querySelector('.allPages').value = incrementValue(
						nodes.querySelector('.allPages').value
					);
				}
				nodes.querySelector('.readPages').value = incrementValue(
					nodes.querySelector('.readPages').value
				);
			} else if (e.target.classList.contains('all')) {
				nodes.querySelector('.allPages').value = incrementValue(
					nodes.querySelector('.allPages').value
				);
			}
		});
	});
}

function incrementValue(value) {
	value = parseInt(value);
	value = isNaN(value) ? 0 : value;
	value = value < 0 ? 0 : value;
	value++;
	return value;
}

// Random books for testing purposes.
function loadRandomLib() {
	let book1 = new Book('John Thompson', 'Devil of Broken Wings', 42, 125);
	let book2 = new Book('Tom Johnson', 'Angel of Broken Wings', 155, 155);
	let book3 = new Book('Johnny Thomp', 'Broken Wings', 150, 200);
	let book4 = new Book('Tommy John', 'Fixed Wings', 12, 155);
	myLibrary.push(book1, book2, book3, book4);
}

clearDisplay();
showLibrary();
newBookForm.reset();

initFirebaseAuth();
