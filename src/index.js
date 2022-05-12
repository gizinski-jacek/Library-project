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
	apiKey: 'AIzaSyB6fdMSJ13X8-le3wAF4YWqJ5Cctm71YqY',
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
	loadUserData();
};

const signOutUser = () => {
	signOut(getAuth());
	document.getElementById('signIn').removeAttribute('hidden');
	document.getElementById('signOut').setAttribute('hidden', 'true');
	clearDisplay();
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

const onCloudDataHandle = (e) => {
	e.preventDefault();
	const { id } = e.target;
	if (isUserSignedIn()) {
		if (id === 'loadCloudLibrary') {
			loadUserData();
		}
		if (id === 'saveCloudLibrary') {
			saveUserData(myLibrary);
		}
		if (id === 'wipeCloudLibrary') {
			wipeUserData();
		}
	} else {
		alert('Sign in with your Google account to use this functionality.');
	}
};

const onLocalDataHandle = (e) => {
	e.preventDefault();
	const { id } = e.target;
	if (id === 'loadLocalLibrary') {
		loadLibrary();
	}
	if (id === 'saveLocalLibrary') {
		saveLibrary(myLibrary);
	}
	if (id === 'wipeLocalLibrary') {
		wipeLibrary();
	}
};

const loadUserData = async () => {
	try {
		const docData = await getDoc(
			doc(firebaseDB, 'usersLibraries', getUserID())
		);
		if (docData.exists()) {
			myLibrary = docData.data().lib;
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
	let pureData = data.map((obj) => Object.assign({}, obj));
	try {
		await setDoc(doc(firebaseDB, 'usersLibraries', getUserID()), {
			name: getUserName(),
			lib: pureData,
			timestamp: serverTimestamp(),
		});
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
			await deleteDoc(doc(firebaseDB, 'usersLibraries', getUserID()));
			clearDisplay();
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

		switchLibrary.className = 'cloudStorage';
		localStorageControls.setAttribute('hidden', 'true');
		cloudStorageControls.removeAttribute('hidden');
	} else {
		document.querySelector('.userProfilePic').setAttribute('hidden', 'true');
		document.querySelector('.userName').setAttribute('hidden', 'true');
		document.querySelector('#signIn').removeAttribute('hidden');
		document.querySelector('#signOut').setAttribute('hidden', 'true');

		switchLibrary.className = 'localStorage';
		cloudStorageControls.setAttribute('hidden', 'true');
		localStorageControls.removeAttribute('hidden');
	}
};

const initFirebaseAuth = () => {
	onAuthStateChanged(getAuth(), authStateObserver);
};

const mainContainer = document.getElementById('mainContainer');
const newBookForm = document.getElementById('newBookForm');
const switchLibrary = document.getElementById('switchLibrary');

const localStorageControls = document.getElementById('localStorageControls');
const loadLocalLibrary = document.getElementById('loadLocalLibrary');
const saveLocalLibrary = document.getElementById('saveLocalLibrary');
const wipeLocalLibrary = document.getElementById('wipeLocalLibrary');

const cloudStorageControls = document.getElementById('cloudStorageControls');
const loadCloudLibrary = document.getElementById('loadCloudLibrary');
const saveCloudLibrary = document.getElementById('saveCloudLibrary');
const wipeCloudLibrary = document.getElementById('wipeCloudLibrary');

const signInBtn = document.getElementById('signIn');
const signOutBtn = document.getElementById('signOut');

newBookForm.querySelector('#readPages').addEventListener('input', () => {
	let rp = newBookForm.querySelector('#readPages');
	let ap = newBookForm.querySelector('#allPages');
	if (Number(rp.value) > Number(ap.value)) {
		rp.setCustomValidity(
			"You've read more pages than the book has them in total?"
		);
	} else {
		rp.setCustomValidity('');
	}
});

newBookForm.addEventListener('submit', (e) => {
	let a = newBookForm.querySelector('#author');
	let t = newBookForm.querySelector('#title');
	let rp = newBookForm.querySelector('#readPages');
	let ap = newBookForm.querySelector('#allPages');
	if (
		a.validity.valid &&
		t.validity.valid &&
		rp.validity.valid &&
		ap.validity.valid
	) {
		addBookToDisplay(a, t, rp, ap);
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

switchLibrary.addEventListener('click', () => {
	if (cloudStorageControls.hidden) {
		if (isUserSignedIn()) {
			switchLibrary.className = 'cloudStorage';
			localStorageControls.setAttribute('hidden', 'true');
			cloudStorageControls.removeAttribute('hidden');
		} else {
			alert('Sign in with your Google account to use this functionality.');
		}
	} else if (localStorageControls.hidden) {
		switchLibrary.className = 'localStorage';
		cloudStorageControls.setAttribute('hidden', 'true');
		localStorageControls.removeAttribute('hidden');
	}
});

loadLocalLibrary.addEventListener('click', onLocalDataHandle);
saveLocalLibrary.addEventListener('click', onLocalDataHandle);
wipeLocalLibrary.addEventListener('click', onLocalDataHandle);
loadCloudLibrary.addEventListener('click', onCloudDataHandle);
saveCloudLibrary.addEventListener('click', onCloudDataHandle);
wipeCloudLibrary.addEventListener('click', onCloudDataHandle);

signInBtn.addEventListener('click', signInUser);
signOutBtn.addEventListener('click', signOutUser);

// Load library from local storage. Create new one if it's empty.
function loadLibrary() {
	myLibrary = JSON.parse(localStorage.getItem('localLibrary'));
	if (myLibrary == null) {
		myLibrary = [];
		if (
			confirm('No saved library found. Do you want to load example library?')
		) {
			loadRandomLib();
			saveLibrary();
			showLibrary();
		}
	} else {
		myLibrary = myLibrary;
		showLibrary();
	}
}

// Save library to local storage.
function saveLibrary() {
	localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
}

// Wipe entire local storage and update display.
function wipeLibrary() {
	if (confirm('Are you sure you want to wipe? This is irreversible!')) {
		localStorage.removeItem('localLibrary');
		myLibrary = [];
		clearDisplay();
	}
}

function addBookToDisplay(author, title, readPages, allPages) {
	let newBook = new Book(
		author.value,
		title.value,
		Number(readPages.value),
		Number(allPages.value)
	);
	myLibrary.push(newBook);
	showLibrary();
	newBookForm.reset();
}

function updateBookDisplay(index, author, title, readPages, allPages) {
	let updatedBook = new Book(
		author,
		title,
		Number(readPages),
		Number(allPages)
	);
	myLibrary.splice(index, 1, updatedBook);
	showLibrary();
	newBookForm.reset();
}

// Display books in the library.
function showLibrary() {
	clearDisplay();
	let i = 0;
	while (i < myLibrary.length) {
		let showBook = newBookForm.cloneNode(true);
		showBook.className = 'book';
		showBook.setAttribute('id', i);
		showBook.querySelector('#author').value = myLibrary[i].author;
		showBook.querySelector('#title').value = myLibrary[i].title;
		showBook.querySelector('#readPages').value = myLibrary[i].readPages;
		showBook.querySelector('#allPages').value = myLibrary[i].allPages;

		let deleteBookButton = document.createElement('button');
		deleteBookButton.className = 'deleteBookBtn';
		deleteBookButton.setAttribute('type', 'button');
		deleteBookButton.textContent = 'DELETE';
		showBook.appendChild(deleteBookButton);

		let updateBookButton = document.createElement('button');
		updateBookButton.classList.add('updateBookBtn');
		updateBookButton.setAttribute('type', 'button');
		updateBookButton.textContent = 'UPDATE';
		showBook.appendChild(updateBookButton);

		showBook.querySelector('.bookControls').innerHTML = '';
		showBook.querySelector('.bookControls').appendChild(deleteBookButton);
		showBook.querySelector('.bookControls').appendChild(updateBookButton);

		mainContainer.insertBefore(showBook, newBookForm);
		i++;
	}
	removeBook(document.querySelectorAll('.deleteBookBtn'));
	updateBook(document.querySelectorAll('.updateBookBtn'));
	newBookForm
		.querySelector('.pages')
		.querySelectorAll('button')
		.forEach((button) => {
			button.removeEventListener('click', decrementListener);
			button.removeEventListener('click', incrementListener);
		});
	attachListenersToDecrementBtns(document.querySelectorAll('.decrement'));
	attachListenersToIncrementBtns(document.querySelectorAll('.increment'));
}

// Check if values provided in the new book form are valid.
function checkValuesValidity(a, t, readP, allP) {
	readP = Number(readP);
	allP = Number(allP);
	if (a == '' && t == '' && readP == '' && allP == '') {
		alert('All fields are empty!');
		return false;
	} else if (a == '') {
		alert('Author field is required!');
		return false;
	} else if (t == '') {
		alert('Title field is required!');
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
			let form = e.target.closest('form');
			let a = form.querySelector('#author').value;
			let t = form.querySelector('#title').value;
			let rp = form.querySelector('#readPages').value;
			let ap = form.querySelector('#allPages').value;
			if (checkValuesValidity(a, t, rp, ap)) {
				if (confirm('Update this book?')) {
					updateBookDisplay(form.id, a, t, rp, ap);
				}
			}
		});
	});
}

function attachListenersToDecrementBtns(allDecrementButtons) {
	allDecrementButtons.forEach((button) => {
		button.addEventListener('click', decrementListener);
	});
}

function decrementListener(e) {
	let nodes = e.target.closest('.pages');
	if (e.target.classList.contains('all')) {
		if (
			nodes.querySelector('#readPages').value ==
			nodes.querySelector('#allPages').value
		) {
			let newValue = decrementValue(nodes.querySelector('#readPages').value);
			nodes.querySelector('#readPages').value = newValue;
		}
		let newValue = decrementValue(nodes.querySelector('#allPages').value);
		nodes.querySelector('#allPages').value = newValue;
	} else if (e.target.classList.contains('read')) {
		let newValue = decrementValue(nodes.querySelector('#readPages').value);
		nodes.querySelector('#readPages').value = newValue;
	}
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

function attachListenersToIncrementBtns(allIncrementButtons) {
	allIncrementButtons.forEach((button) => {
		button.addEventListener('click', incrementListener);
	});
}

function incrementListener(e) {
	let nodes = e.target.closest('.pages');
	if (e.target.classList.contains('read')) {
		if (
			nodes.querySelector('#readPages').value ==
			nodes.querySelector('#allPages').value
		) {
			let newValue = incrementValue(nodes.querySelector('#allPages').value);
			nodes.querySelector('#allPages').value = newValue;
		}
		let newValue = incrementValue(nodes.querySelector('#readPages').value);
		nodes.querySelector('#readPages').value = newValue;
	} else if (e.target.classList.contains('all')) {
		let newValue = incrementValue(nodes.querySelector('#allPages').value);
		nodes.querySelector('#allPages').value = newValue;
	}
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

showLibrary();
newBookForm.reset();

initFirebaseAuth();
