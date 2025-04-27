let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = "all";

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const noTasksMsg = document.getElementById('no-tasks-msg');

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    title: taskInput.value,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.unshift(newTask);
  saveTasks();
  taskInput.value = '';
  renderTasks();
});

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';
  noTasksMsg.classList.toggle('hidden', tasks.length > 0);

  let filteredTasks = tasks;

  if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    
    li.innerHTML = `
      <span>${task.title}</span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Filter Tasks
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.getAttribute('data-filter');
    filterButtons.forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  });
});

// Initial render
renderTasks();