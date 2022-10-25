const books = [];

const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-event';


function generateId() {
  return +new Date();
};

function generateBook(id, title, author, year, isComplete) {
  return {
    id, title, author, year, isComplete
  };
};

function findBook(id) {
  try {
    for (const book of books) {
      if (book.id === id) {
        return book;
      }
    }

    return null;
  } catch (err) {
    console.error(err);
  }
};

function findBookIndexById(id) {
  try {
    for (const i in books) {
      if (books[i].id === id) {
        return i;
      }
    }

    return -1;
  } catch (err) {
    console.error(err);
  }
};

function makeBook(obj) {
  try {
    const { id, title, author, year, isComplete } = obj;

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${author}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${year}`;

    const statusButton = document.createElement('button');
    statusButton.classList.add('green');

    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus buku';
    removeButton.addEventListener('click', function () {
      removeBookById(id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('gray');
    editButton.innerText = 'Perbaharui';
    editButton.addEventListener('click', function () {
      const bookElement = updateBook(id);
      container.append(bookElement);
    });

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('action');
    buttonWrapper.append(statusButton, removeButton, editButton);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(bookTitle, bookAuthor, bookYear, buttonWrapper);
    container.setAttribute('id', `book-${id}`);

    if (isComplete) {
      statusButton.innerText = 'Belum selesai di Baca';
      statusButton.addEventListener('click', function () {
        changeToIncomplete(id);
      });
    } else {
      statusButton.innerText = 'Selesai dibaca';
      statusButton.addEventListener('click', function () {
        changeToCompleted(id);
      });
    }

    return container;
  } catch (err) {
    console.error(err);
  }
};

function updateBook(id) {
  try {
    const book = findBook(id);

    const labelTitle = document.createElement('label');
    labelTitle.setAttribute('for', 'updateBookTitle');
    labelTitle.innerText = 'Judul';
    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('id', 'updateBookTitle');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('value', book.title);
    inputTitle.setAttribute('required', '');
    const updateTitleWrapper = document.createElement('div');
    updateTitleWrapper.classList.add('update-wrapper');
    updateTitleWrapper.append(labelTitle, inputTitle);

    const labelAuthor = document.createElement('label');
    labelAuthor.setAttribute('for', 'updateBookAuthor');
    labelAuthor.innerText = 'Penulis';
    const inputAuthor = document.createElement('input');
    inputAuthor.setAttribute('id', 'updateBookAuthor');
    inputAuthor.setAttribute('type', 'text');
    inputAuthor.setAttribute('value', book.author);
    inputAuthor.setAttribute('required', '');
    const updateAuthorWrapper = document.createElement('div');
    updateAuthorWrapper.classList.add('update-wrapper');
    updateAuthorWrapper.append(labelAuthor, inputAuthor);

    const labelYear = document.createElement('label');
    labelYear.setAttribute('for', 'updateBookYear');
    labelYear.innerText = 'Tahun';
    const inputYear = document.createElement('input');
    inputYear.setAttribute('id', 'updateBookYear');
    inputYear.setAttribute('type', 'number');
    inputYear.setAttribute('value', book.year);
    inputYear.setAttribute('required', '');
    const updateYearWrapper = document.createElement('div');
    updateYearWrapper.classList.add('update-wrapper');
    updateYearWrapper.append(labelYear, inputYear);

    const submit = document.createElement('button');
    submit.classList.add('update-button');
    submit.setAttribute('id', 'updatedBookSubmit');
    submit.setAttribute('type', 'submit');
    submit.innerText = 'Ubah';

    const form = document.createElement('form');
    form.setAttribute('id', 'updateBook');
    form.append(updateTitleWrapper, updateAuthorWrapper, updateYearWrapper, submit);

    form.addEventListener('submit', function (e) {
      book.title = inputTitle.value;
      book.author = inputAuthor.value;
      book.year = inputYear.value;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      e.preventDefault();
    });

    return form;
  } catch (err) {
    console.error(err);
  }
};

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    console.info('Browser tidak mendukung local storage');
    return false
  }

  return true;
};

function saveData() {
  try {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  } catch (err) {
    console.error(err);
  }
};


function loadData() {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  } catch (err) {
    console.error(err);
  }
};


function addBook() {
  try {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const bookId = generateId();
    const book = generateBook(bookId, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(book);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } catch (err) {
    console.error(err);
  }
};

function changeToCompleted(id) {
  try {
    const bookTarget = findBook(id);

    if (bookTarget === null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } catch (err) {
    console.error(err);
  }
};

function changeToIncomplete(id) {
  try {
    const bookTarget = findBook(id);

    if (bookTarget === null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } catch (err) {
    console.error(err);
  }
};


function removeBookById(id) {
  try {
    const bookTarget = findBook(id);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const inputBookForm = document.getElementById('inputBook');
  const searchBookForm = document.getElementById('searchBook');


  inputBookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener('submit', function (e) {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerText = '';
    completeBookshelfList.innerText = '';

    const bookTitle = document.getElementById('searchBookTitle');
    const bookTitleValue = bookTitle.value.toLowerCase();
    const filteredBook = books.filter((b) => b.title.toLowerCase().includes(bookTitleValue));

    for (const book of filteredBook) {
      if (book.isComplete) {
        const bookElement = makeBook(book);
        completeBookshelfList.append(bookElement);
      } else {
        const bookElement = makeBook(book);
        incompleteBookshelfList.append(bookElement);
      }
    }

    e.preventDefault();
  });

  if (isStorageExist()) {
    loadData()
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerText = '';
  completeBookshelfList.innerText = '';

  for (const book of books) {
    const bookElement = makeBook(book);

    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement)
    }
  }
});
