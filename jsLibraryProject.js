"use strict";

const mainContainer = document.querySelector('#mainContainer');
const newBookForm = document.querySelector('.newBookForm');
const loadLibrary = document.querySelector('#loadLib');
const saveLibrary = document.querySelector('#saveLib');
const wipeLibrary = document.querySelector('#wipeLib');

document.querySelector('.addBookBtn').addEventListener('click', (e) => {
    addToLibrary(e.target.parentElement.childNodes);
})

let myLibrary = [];

class Book {
    constructor(author, title, readPages, allPages) {
        this.author = author;
        this.title = title;
        this.readPages = readPages;
        this.allPages = allPages;
    }
}

loadLibrary.addEventListener('click', () => {
    loadLib();
    clearDisplay();
    showLibrary();
})

saveLibrary.addEventListener('click', saveLib);
wipeLibrary.addEventListener('click', wipeLib);

// Load library from local storage. Create new one if it's empty.
function loadLib() {
    myLibrary = JSON.parse(localStorage.getItem('localLibrary'));
    if (myLibrary == null) {
        alert('No saved library found!');
        myLibrary = [];
        saveLib();
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
    if (confirm('Are you sure you want to wipe your library? This is irreversible!')) {
        localStorage.clear();
        clearDisplay();
        showLibrary();
    }
}

function addToLibrary(form) {
    let author = form[1].value;
    let title = form[3].value;
    let readPages = Number(form[5].childNodes[3].value);
    let allPages = Number(form[5].childNodes[9].value);
    if (checkValidValues(author, title, readPages, allPages)) {
        let newBook = new Book(author, title, readPages, allPages);
        myLibrary.push(newBook);
        saveLib();
        clearDisplay();
        showLibrary();
        newBookForm.reset();
    }
}

// Display book in the library.
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
function checkValidValues(a, t, readP, allP) {
    if (a == '' && t == '' && readP == '' && allP == '') {
        alert('All fields are empty!');
        return false;
    } else if (Number.isNaN(readP) || Number.isNaN(allP)) {
        alert('Pages are counted in numbers!');
        return false;
    } else if (!Number.isInteger(readP) || !Number.isInteger(allP)) {
        alert('Use whole numbers for page count!');
        return false;
    } else if (readP > allP) {
        alert('You\'ve read more pages than the book has?');
        return false;
    } else if (readP < 0 || allP < 0) {
        alert('Book has negative number of pages?');
        return false;
    } else {
        return true;
    }
}

// Removes all elements in main container except for new book form.
function clearDisplay() {
    while (mainContainer.firstChild.className !== 'newBookForm') {
        mainContainer.removeChild(mainContainer.firstChild);
    }
}

// Removes targeted book from library and updates books displayed.
function removeBook(deleteBtn) {
    deleteBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (confirm('Delete this book?')) {
                myLibrary.splice(e.target.parentElement.id, 1);
                e.target.parentElement.remove();
                // clearDisplay();
                // showLibrary();
            }
        })
    })
}

// Updates targeted book by grabing values from it's form, creating new book
// with updated values and splicing it in place of old book.
function updateBook(updateBtn) {
    updateBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (confirm('Update this book?')) {
                let form = e.target.parentElement.childNodes;
                let author = form[1].value;
                let title = form[3].value;
                let readPages = Number(form[5].childNodes[3].value);
                let allPages = Number(form[5].childNodes[9].value);
                if (checkValidValues(author, title, readPages, allPages)) {
                    let newBook = new Book(author, title, readPages, allPages)
                    myLibrary.splice(e.target.parentElement.id, 1, newBook)
                    saveLib();
                }
            }
        })
    })
}

function decrementBtn(decrementBtn) {
    decrementBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
            let nodes = e.target.parentElement.childNodes;
            if (e.target.classList.contains('read')) {
                nodes[3].value = decrementValue(nodes[3].value);
            } else if (e.target.classList.contains('all')) {
                nodes[9].value = decrementValue(nodes[9].value);
            }
        })
    })
}

function incrementBtn(incrementBtn) {
    incrementBtn.forEach((button) => {
        button.addEventListener('click', (e) => {
            let nodes = e.target.parentElement.childNodes;
            if (e.target.classList.contains('read')) {
                nodes[3].value = incrementValue(nodes[3].value);
            } else if (e.target.classList.contains('all')) {
                nodes[9].value = incrementValue(nodes[9].value);
            }
        })
    })
}

function decrementValue(value) {
    value = parseInt(value);
    value = isNaN(value) ? 0 : value;
    value = (value < 0) ? 0 : value;
    if (value > 0) {
        value--;
    }
    return value;
}

function incrementValue(value) {
    value = parseInt(value);
    value = isNaN(value) ? 0 : value;
    value = (value < 0) ? 0 : value;
    value++;
    return value;
}

// Random books for testing purposes.
// let book1 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// let book2 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// let book3 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// let book4 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// let book5 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// let book6 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
// myLibrary.push(book1);
// myLibrary.push(book1, book2, book3, book4, book5, book6);

clearDisplay();
showLibrary();
newBookForm.reset();
