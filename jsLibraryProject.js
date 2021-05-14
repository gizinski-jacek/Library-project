"use strict";

const mainContainer = document.querySelector('#mainContainer');
const newBookForm = document.querySelector('.newBookForm');
const addBookBtn = document.querySelector('.addBookBtn');

addBookBtn.addEventListener('click', (e) => {
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

// function BookContainer() {
//     this.ele = document.createElement('div');
//     this.ele.classList.add('bookContainer');
//     this.ele.setAttribute('id', "!!NEED ID HERE!!");

// }

// function saveLibrary() {
//     localStorage.setItem('localLibrary', JSON.stringify(myLibrary));
// }

// function loadLibrary() {
//     myLibrary = JSON.parse(localStorage.getItem('localLibrary'));
//     return myLibrary;
// }

function addToLibrary(form) {
    let author = form[1].value;
    let title = form[3].value;
    let readPages = Number(form[5].childNodes[3].value);
    let allPages = Number(form[5].childNodes[9].value);
    if (checkValidValues(author, title, readPages, allPages)) {
        let newBook = new Book(author, title, readPages, allPages);
        myLibrary.push(newBook);
        newBookForm.reset();
        clearDisplay();
        showLibrary();
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
    let allDeleteButtons = document.querySelectorAll('.deleteBookBtn');
    removeBook(allDeleteButtons);
    let allUpdateButtons = document.querySelectorAll('.updateBookBtn');
    updateBook(allUpdateButtons);
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
                }
            }
        })
    })
}

// Random books for testing purposes.
let book1 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book2 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book3 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book4 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book5 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book6 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);

myLibrary.push(book1);
// myLibrary.push(book1, book2, book3, book4, book5, book6);

clearDisplay();
showLibrary();
newBookForm.reset();
