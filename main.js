const books = [];

const STORAGE_KEY = 'BOOKSHELF_STORAGE';
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-event';


function generateId() {
  return `book-${+new Date()}`;
};

function generateBook({ id, title, author, year, isComplete }) {
  return {
    id, title, author, year, isComplete
  };
};

function findBook(id) {
  for (const book of books) {
    if (book.id === id) return book;
  }

  return null;
};

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) return index;
  }

  return -1;
};

function createPopupElement(id) {
  const paragraphPopupElement = createInfoElement({
    name: 'p',
    className: 'popup__paragraph',
    text: 'Anda yakin ingin menghapus buku?',
  });

  const cancelButtonElement = createButtonElement({
    className: 'button button--primary', type: 'button', text: 'Batal',
  });

  cancelButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();

    if (popupElement.classList.contains('popup--enabled')) {
      document.querySelector('.popup').remove();
    }
  });

  const deleteButtonElement = createButtonElement({
    className: 'button button--secondary', type: 'button', text: 'Hapus',
  });

  deleteButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();

    document.querySelector('.popup').remove();
    deleteBook(id);
  })

  const actionPopupElement = createInfoElement({
    name: 'div', className: 'popup__action', text: '',
  });

  actionPopupElement.append(cancelButtonElement, deleteButtonElement);

  const cardPopupElement = createInfoElement({
    name: 'div', className: 'popup__card', text: '',
  });

  cardPopupElement.append(paragraphPopupElement, actionPopupElement);

  const popupElement = createInfoElement({
    name: 'div', className: 'popup', text: '',
  });

  popupElement.append(cardPopupElement);

  return popupElement;
}

function createButtonElement({ className, type, text }) {
  const element = document.createElement('button');
  element.setAttribute('class', className);
  element.setAttribute('type', type);
  element.innerText = text;

  return element;
}

function createInfoElement({ name, className, text }) {
  const element = document.createElement(name);
  element.setAttribute('class', className);
  element.innerText = text;

  return element;
}

function createLabelElement({ className, id, text }) {
  const element = document.createElement('label');
  element.setAttribute('class', className);
  element.setAttribute('for', id);
  element.innerText = text;

  return element;
}

function createInputElement({ className, id, type, value }) {
  const element = document.createElement('input');
  element.setAttribute('class', className);
  element.setAttribute('id', id);
  element.setAttribute('type', type);
  element.setAttribute('value', value);
  element.setAttribute('required', '');

  return element;
}

function createFieldsetElement(className) {
  const element = document.createElement('fieldset');
  element.setAttribute('class', className);

  return element;
}

function createBook(book) {
  const { id, title, author, year, isComplete } = book;

  const titleElement = createInfoElement({
    name: 'h3', className: 'book__title', text: title,
  });

  const authorElement = createInfoElement({
    name: 'p', className: 'book__paragraph', text: author,
  });

  const yearElement = createInfoElement({
    name: 'p', className: 'book__paragraph', text: year,
  });

  const addButtonText = (isComplete)
    ? 'Belum selesai dibaca'
    : 'Selesai dibaca';

  const addButtonElement = createButtonElement({
    className: 'button button--primary', type: 'button', text: addButtonText,
  });

  addButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();

    if (isComplete) {
      updateToUncompleted(id);
    } else {
      updateToComplete(id);
    }
  });

  const deleteButtonElement = createButtonElement({
    className: 'button button--secondary', type: 'button', text: 'Hapus buku',
  });

  deleteButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();

    const popupElement = createPopupElement(id);
    popupElement.classList.add('popup--enabled');

    const bodyElement = document.querySelector('body');
    bodyElement.append(popupElement);
  });

  const editButtonElement = createButtonElement({
    className: 'button button--secondary', type: 'button', text: 'Perbaharui',
  });

  editButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();

    const bookElement = updateBook(id);
    const numberOfBookElementChild = document
      .getElementById(id)
      .childElementCount;

    if (numberOfBookElementChild < 5) {
      itemElement.append(bookElement);
    }
  });

  const actionElement = createInfoElement({
    name: 'div', className: 'book__action', text: '',
  });

  actionElement.append(
    addButtonElement, deleteButtonElement, editButtonElement,
  );

  const itemElement = createInfoElement({
    name: 'li', className: 'content__item', text: ''
  });

  itemElement.setAttribute('id', id);
  itemElement.append(titleElement, authorElement, yearElement, actionElement);

  return itemElement;
};

function updateBook(id) {
  const book = findBook(id);

  const titleLabelElement = createLabelElement({
    className: 'form__label', id: 'updateBookTitle', text: 'Judul',
  });

  const titleInputElement = createInputElement({
    className: 'form__input',
    id: 'updateBookTitle',
    type: 'text',
    value: book.title,
  });

  const titleFieldsetElement = createFieldsetElement('form__field');
  titleFieldsetElement.append(titleLabelElement, titleInputElement);

  const authorLabelElement = createLabelElement({
    className: 'form__label', id: 'updateBookAuthor', text: 'Penulis',
  });

  const authorInputElement = createInputElement({
    className: 'form__input',
    id: 'updateBookAuthor',
    type: 'text',
    value: book.author,
  });

  const authorFieldsetElement = createFieldsetElement('form__field');
  authorFieldsetElement.append(authorLabelElement, authorInputElement);

  const yearLabelElement = createLabelElement({
    className: 'form__label', id: 'updateBookYear', text: 'Tahun',
  });

  const yearInputElement = createInputElement({
    className: 'form__input',
    id: 'updateBookYear',
    type: 'number',
    value: book.year,
  });

  const yearFieldsetElement = createFieldsetElement('form__field');
  yearFieldsetElement.append(yearLabelElement, yearInputElement);

  const submitButtonElement = createButtonElement({
    className: 'button button--primary', type: 'submit', text: 'Selesai',
  });

  submitButtonElement.setAttribute('id', 'updateBookSubmit');

  const formElement = document.createElement('form');
  formElement.setAttribute('class', 'form')
  formElement.setAttribute('id', 'updateBookForm');
  formElement.append(
    titleFieldsetElement,
    authorFieldsetElement,
    yearFieldsetElement,
    submitButtonElement,
  );

  formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    book.title = titleInputElement.value
    book.author = authorInputElement.value
    book.year = parseInt(yearInputElement.value);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  });

  return formElement;
};

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    console.info('Browser tidak mendukung local storage');
    return false
  }

  return true;
};

function saveBook() {
  if (isStorageExist()) {
    const parsedBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedBooks);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};


function loadBook() {
  const serializedBooks = localStorage.getItem(STORAGE_KEY);
  let parsedBooks = JSON.parse(serializedBooks);

  if (parsedBooks !== null) {
    for (const book of parsedBooks) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};


function addBook() {
  const id = generateId();
  const title = document.getElementById('bookTitle').value;
  const author = document.getElementById('bookAuthor').value;
  const year = document.getElementById('bookYear').value;
  const isComplete = document.getElementById('bookIsComplete').checked;

  const book = generateBook({ id, title, author, year, isComplete });
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
};

function updateToComplete(id) {
  const book = findBook(id);
  if (book === null) return;
  book.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
};

function updateToUncompleted(id) {
  const book = findBook(id);
  if (book === null) return;
  book.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
};


function deleteBook(id) {
  const book = findBook(id);
  const bookIndex = books.indexOf(book);

  if (bookIndex === -1) return;
  books.splice(bookIndex, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
};

const bookFormElement = document.getElementById('bookForm');
const searchFormElement = document.getElementById('searchForm');

const bookUncompletedListElement = document.getElementById('bookUncompletedList');
const bookCompleteListElement = document.getElementById('bookCompleteList');

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist()) loadBook()
})

bookFormElement.addEventListener('submit', (event) => {
  event.preventDefault();

  addBook();
});

searchFormElement.addEventListener('submit', (event) => {
  event.preventDefault();

  bookUncompletedListElement.innerText = '';
  bookCompleteListElement.innerText = '';

  const title = document.getElementById('bookSearch').value.toLowerCase();
  const filteredBook = books.filter((book) => {
    return book.title.toLowerCase().includes(title)
  });

  for (const book of filteredBook) {
    if (book.isComplete) {
      const bookElement = createBook(book);
      bookCompleteListElement.append(bookElement);
    } else {
      const bookElement = createBook(book);
      bookUncompletedListElement.append(bookElement);
    }
  }
});

document.addEventListener(RENDER_EVENT, () => {
  bookUncompletedListElement.innerText = '';
  bookCompleteListElement.innerText = '';

  for (const book of books) {
    const bookElement = createBook(book);

    if (book.isComplete) {
      bookCompleteListElement.append(bookElement);
    } else {
      bookUncompletedListElement.append(bookElement)
    }
  }
});
