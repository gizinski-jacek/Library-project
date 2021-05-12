"use strict";

const buttonNewBook = document.querySelector('.addBookBtn');
const buttonShowBooks = document.querySelector('.btnShowBooks');
const bookcase = document.querySelector('#mainContainer');

buttonNewBook.addEventListener('click', () => {
    addToLibrary();
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


function addToLibrary() {
    let author = document.querySelector('.author').value;
    let title = document.querySelector('.title').value;
    let readPages = Number(document.querySelector('.readPages').value);
    let allPages = Number(document.querySelector('.allPages').value);
    if (author == '' && title == '' && readPages == '' && allPages == '') {
        alert('All fields are empty!');
    } else {
        let newBook = new Book(author, title, readPages, allPages);
        myLibrary.push(newBook);
    }
    showLibrary()
    document.querySelector('.newBookForm').reset();
}

function removeBook(btnDel) {
    btnDel.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (confirm('Delete this book?')) {
                myLibrary.splice(e.target.parentElement.id, 1);
                showLibrary();
            }
        })
    })
}

function showLibrary() {
    bookcase.textContent = '';
    let i = 0;
    while (i < myLibrary.length) {
        let form = document.querySelector('.newBookForm');
        let showBook = form.cloneNode(true);

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
        newDeleteButton.textContent = 'Delete';
        showBook.appendChild(newDeleteButton);

        let updateStatusButton = document.createElement('button');
        updateStatusButton.classList.add('updateBookBtn');
        updateStatusButton.setAttribute('type', 'button');
        updateStatusButton.textContent = 'Update';
        showBook.appendChild(updateStatusButton);

        bookcase.appendChild(showBook);
        i++;
    }
    let allDeleteButtons = document.querySelectorAll('.deleteBookBtn');
    removeBook(allDeleteButtons);
}

let book1 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book2 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book3 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book4 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book5 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);
let book6 = new Book('John Thompson John Thompson', 'Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings Devil of Broken Wings', 42, 155);

myLibrary.push(book1, book2, book3, book4, book5, book6);

document.querySelector('.newBookForm').reset();
showLibrary();
