const container = document.getElementById('container');
const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const isbnInput = document.getElementById('isbn');
const bookList = document.getElementById('bookList');

class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBook(book) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td class='title'>${book.title}</td>
            <td class='author'>${book.author}</td>
            <td class='isbn'>${book.isbn}</td>
            <td>
                <a href="#" class="delete">x</a>
            </td>
        `;
        bookList.appendChild(row);
    }

    showAlert(message, className) {
        const alertEl = document.createElement('div');
        alertEl.className = `alert ${className}`;
        const text = document.createTextNode(message);
        alertEl.appendChild(text);
        container.insertBefore(alertEl, bookForm);
        window.setTimeout(_ => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        titleInput.value = '';
        authorInput.value = '';
        isbnInput.value = '';
    }
}

class LocalStorage extends UI {
    addBooksToLs(book) {
        const books = this.getBooksFromLs();
        localStorage.setItem('book', JSON.stringify(
            [...books, book]
        ));
    }

    getAllBooksFromLs() {
        let books = this.getBooksFromLs();
        bookList.innerHTML = '';
        books.forEach(book => {
            this.addBook(book);
        });
    }

    removeBooksFromLs(deletBook) {
        const books = this.getBooksFromLs();
        localStorage.setItem('book', JSON.stringify(
            books.filter(book => JSON.stringify(book) !== JSON.stringify(deletBook))
        ));
    }

    getBooksFromLs() {
        const gfls = localStorage.getItem('book');
        const books = JSON.parse(gfls);
        return gfls !== null ? books : [];
    }
}

bookForm.addEventListener('submit', event => {
    event.preventDefault();

    const title = titleInput.value;
    const author = authorInput.value;
    const isbn = isbnInput.value;

    const book = new Book(title, author, isbn);
    const ui = new UI();
    const ls = new LocalStorage();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please Fill All Input Fields', 'error');
    } else {
        ui.addBook(book);
        ui.showAlert('Book Added', 'success');
        ui.clearFields();
        ls.addBooksToLs(book);
    }
});

// get all books from ls:
const ls = new LocalStorage();
ls.getAllBooksFromLs();

bookList.addEventListener('click', event => {
    event.preventDefault();
    const ui = new UI();
    const target = event.target;
    ui.deleteBook(target);
    console.log(target);
    const row = target.parentElement.parentElement;
    const title = row.querySelector('.title').textContent;
    const author = row.querySelector('.author').textContent;
    const isbn = row.querySelector('.isbn').textContent;
    const deleteBook = new Book(title, author, isbn);
    ls.removeBooksFromLs(deleteBook);
    ls.getAllBooksFromLs();
});