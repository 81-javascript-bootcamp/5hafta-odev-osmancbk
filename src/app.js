import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
  }

  addTask(task) {
    const $taskFormBtn = document.querySelector('.mb-3');
    $taskFormBtn.disabled = true;
    $taskFormBtn.innerText = 'Loading';
    console.log($taskFormBtn);
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        $taskFormBtn.disabled = false;
        $taskFormBtn.innerText = 'Add Task';
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><td><button class="btn btn-danger">Delete</button></td>`;
    const $taskDeleteBtn = $newTaskEl.querySelector('button');
    $taskDeleteBtn.onclick = () => this.deleteTask(task.id);
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  deleteTask(id) {
    deleteTaskFromApi(id)
      .then((response) => response.json())
      .then((deletedTask) => this.deleteTaskFromTable(deletedTask));
  }

  deleteTaskFromTable(task) {
    const $deletedTaskEl = document.querySelectorAll('tr');
    $deletedTaskEl.forEach((item) => {
      item.querySelector('th').innerHTML == task.id && item.remove();
    });
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.$taskFormInput.value && this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
