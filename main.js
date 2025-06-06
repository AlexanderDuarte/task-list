const form = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const filter = document.getElementById("filter-category");

const audioAddTask = new Audio("./audios/add-task.wav");
const audioTaskRemove = new Audio("./audios/remove-task.wav");
const audioWarning = new Audio("./audios/warning.wav");
const audioCheck = new Audio("./audios/check.wav")



const list = JSON.parse(localStorage.getItem("localList")) || [];

if (list) list.forEach((item) => taskList.appendChild(createElementTask(item)));

form.addEventListener("submit", addTask);
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    RemoveTask(e);
  } else if (e.target.classList.contains("checkbox")) {
    toggleCheck(e.target.parentNode.parentNode);
  }
});

filter.addEventListener("input", handleFilter);

function updateLocalStorage() {
  localStorage.setItem("localList", JSON.stringify(list));
}

function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function addTask(e) {
  e.preventDefault();
  const inputText = form["task-input"].value.trim();
  if (!inputText) return;
  const task = {
    id: generateUniqueId(),
    task: form["task-input"].value.trim(),
    category: form["category-select"].value,
    ischecked: false,
  };
  list.push(task);
  taskList.appendChild(createElementTask(task));
  audioAddTask.play();

  updateLocalStorage();

  form["task-input"].value = "";
}

function RemoveTask(e) {
  const taskItem = e.target.parentNode;

  taskItem.classList.add("anim-task-remove");
  setTimeout(() => removeElementTask(taskItem.id), 300);

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === taskItem.id) {
      list.splice(i, 1);
      audioTaskRemove.play();
      break;
    }
  }
  updateLocalStorage();
}

function removeElementTask(id) {
  taskList.removeChild(document.getElementById(id));
}

function createElementTask({ id, task, category, ischecked }) {
  const element = document.createElement("li");
  element.classList.add("anim-task-start");
  element.id = id;
  element.innerHTML = `<label  class="custom-checkbox"
            ><input name="input-checkbox" class="checkbox" type="checkbox" ${
              ischecked ? 'checked="checked"' : ""
            }> <span></span
          ></label>
          <p class="task">${task}</p>
          <p class="category">${category}</p>
          <button class="delete">&#10060;</button>`;
  if (ischecked)
    element.querySelector(".task").style.textDecoration = "line-through";
  return element;
}

function toggleCheck(task) {
  
  list.forEach((taskItem) => {
    if (taskItem.id === task.id) {
      taskItem.ischecked = !taskItem.ischecked;

      toggleElementCheck(task);
    }
  });
  
  updateLocalStorage();
}

function toggleElementCheck(task) {
  const taskText = task.querySelector(".task");

  if (task.firstChild.firstChild.checked) {
    taskText.style.textDecoration = "line-through";
  } else {
    taskText.style.textDecoration = "none";
  }
  audioCheck.play()
}

function handleFilter(e) {
  const filterList = taskList.querySelectorAll("li");

  if (e.target.value === "Todos") {
    filterList.forEach((item) => (item.style.display = "flex"));
    return;
  }

  filterList.forEach((item) => {
    if (item.querySelector(".category").innerText === e.target.value) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// Developed by AlexanderDuarte (https://github.com/AlexanderDuarte)
