let editIndex = -1;

let groceries = JSON.parse(localStorage.getItem('groceries')) || [];
const listItem = document.querySelector('#item-list');

const textInput = document.getElementById('item-input');
const addButton = document.querySelector('.btn');
const bodyContainer = document.getElementById('body-container');

// add event listener to check for empty input and change button text
textInput.addEventListener('input', () => {
  if (textInput.value === '') {
    addButton.textContent = 'Add Item';
    addButton.classList.remove('btn-green')
  }
});

const renderData = () => {
  // show/hide body-container based on whether groceries array is empty or not
  if (groceries.length > 0) {
    bodyContainer.classList.add('show');
  } else {
    bodyContainer.classList.remove('show');
  }

  listItem.innerHTML = groceries
    .map((grocery, index) => `
      <li data-index="${index}"${index === editIndex ? ' class="disabled"' : ''}>
        ${grocery}
        <button class="remove-item btn-link text-red" data-index="${index}">
          <i class="fa-solid fa-xmark" data-index="${index}"></i>
        </button>
      </li>
    `)
    .join('');

  const removeBtns = document.querySelectorAll('.fa-xmark');
  removeBtns.forEach((removeBtn) => {
    removeBtn.addEventListener('click', (event) => {
      // event.stopPropagation(); // prevent click event from propagating to parent li element
      const index = removeBtn.getAttribute('data-index');
      groceries.splice(index, 1);
      localStorage.setItem('groceries', JSON.stringify(groceries));
      renderData();
    });
  });

  const listItems = document.querySelectorAll('#item-list li');
  listItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      // check if the target element is the remove button
      if (event.target.classList.contains('fa-xmark')) {
        return;
      }
      const index = item.getAttribute('data-index');
      const textInput = document.getElementById('item-input');
      textInput.value = groceries[index];
      const addButton = document.querySelector('.btn');
      const buttonId = document.getElementById('add-item');
      addButton.textContent = 'Update Item';
      buttonId.classList.add('btn-green');
      addButton.setAttribute('data-index', index);
      const icon = document.getElementById('icon');
      if (addButton.textContent === 'Update Item') {
        icon.classList.add('fa-pencil');
      } else {
        icon.classList.remove('fa-pencil');
      }
    });
  });
};


renderData();

const groceryForm = document.getElementById('item-form');
groceryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const textInput = document.getElementById('item-input');
  const addButton = document.querySelector('.btn');
  if (addButton.textContent === 'Update Item') {
    const index = addButton.getAttribute('data-index');
    groceries[index] = textInput.value;
    addButton.textContent = 'Add Item';
    addButton.classList.remove('btn-green')
  } else {
    if (textInput.value) {
      groceries.push(textInput.value);
    }
  }
  textInput.value = '';
  localStorage.setItem('groceries', JSON.stringify(groceries));
  renderData();
});

// Clear All
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
  groceries = [];
  localStorage.removeItem('groceries');
  renderData();
});

// Filter
const filterInput = document.getElementById('filter');
filterInput.addEventListener('input', () => {
  const filterValue = filterInput.value.toLowerCase();
  const filteredGroceries = groceries.filter(grocery => grocery.toLowerCase().includes(filterValue));
  listItem.innerHTML = filteredGroceries
    .map((grocery, index) => `
      <li>
        ${grocery}
        <button class="remove-item btn-link text-red">
          <i class="fa-solid fa-xmark" data-index="${index}"></i>
        </button>
      </li>
    `)
    .join('');
});
