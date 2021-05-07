"use strict";
const buttonNewBook = document.querySelector('.newBook');
const buttonShowBooks = document.querySelector('.btnShowBooks');
const bookcase = document.querySelector('.bookcase');

buttonNewBook.addEventListener('click', () => {
    addToLibrary();
})

buttonShowBooks.addEventListener('click', () => {
    showLibrary();
})

let myLibrary = [];

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.info = function() {
        return this.title + ' written by ' + this.author + ', ' + this.pages + ' pages, ' + 
        (this.status ? 'finished reading.' : 'still reading.');
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

function statusCheck() {
    let element = document.querySelectorAll('[name=newStatus]');
    for (let i = 0; i < element.length; i++) {
        if (element[i].checked) {
            return (element[i].value == 'true')
        }
    }
}

function addToLibrary() {
    let title = document.querySelector('#newTitle').value;
    let author = document.querySelector('#newAuthor').value;
    let pages = Number(document.querySelector('#newPages').value);
    let status = statusCheck()
    if (title == '' && author == '' && pages == '') {
        alert('All fields are empty!');
    } else {
        let newBook = new Book(title, author, pages, status);
        myLibrary.push(newBook);
    }
    showLibrary()
    document.querySelector('.newForm').reset();
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

function statusChange(btnStat) {
    btnStat.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (myLibrary[e.target.parentElement.id].status){
                myLibrary[e.target.parentElement.id].status = false;
                e.target.textContent = 'Finished';
                e.target.style.backgroundColor = 'lime';
                showLibrary()
            } else if (!myLibrary[e.target.parentElement.id].status) {
                myLibrary[e.target.parentElement.id].status = true;
                e.target.textContent = 'Reading';
                e.target.style.backgroundColor = 'yellowgreen';
                showLibrary()
            }
        })
    })
}

function showLibrary() {
    bookcase.textContent = '';
    let i = 0;
    while (i < myLibrary.length) {
        let showBook = document.createElement('div');
        showBook.classList.add('book');
        showBook.setAttribute('id', i);
        showBook.textContent = myLibrary[i].info();

        let newDeleteButton = document.createElement('button');
        newDeleteButton.classList.add('btnDelete');
        newDeleteButton.setAttribute('type', 'button');
        newDeleteButton.textContent = 'X';
        showBook.appendChild(newDeleteButton);

        let newStatusButton = document.createElement('button');
        newStatusButton.classList.add('btnStatus');
        newStatusButton.setAttribute('type', 'button');
        newStatusButton.textContent = myLibrary[i].status ? 'Finished' : 'Reading';
        newStatusButton.style.backgroundColor = myLibrary[i].status ? 'lime' : 'yellowgreen';
        showBook.appendChild(newStatusButton);

        bookcase.appendChild(showBook);
        i++;
    }
    let allDeleteButtons = document.querySelectorAll('.btnDelete');
    removeBook(allDeleteButtons);
    let allStatusButtons = document.querySelectorAll('.btnStatus');
    statusChange(allStatusButtons);
}

document.querySelector('.newForm').reset();
showLibrary();