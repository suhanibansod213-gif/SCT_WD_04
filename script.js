/* =========================================
   TO-DO APP — TASK 04
========================================= */

// Get elements
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("task-date");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const allFilter = document.getElementById("all-filter");
const activeFilter = document.getElementById("active-filter");
const completedFilter = document.getElementById("completed-filter");

const taskCount = document.getElementById("task-count");


// Store tasks
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

let currentFilter = "all";


// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// =========================================
// ADD TASK
// =========================================

function addTask() {

    const text = taskInput.value.trim();
    const date = dateInput.value;

    // Don't allow empty tasks
    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    renderTasks();

    taskInput.focus();
}


// =========================================
// DELETE TASK
// =========================================

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// =========================================
// TOGGLE COMPLETED
// =========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// =========================================
// EDIT TASK
// =========================================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        return;
    }

    task.text = updatedText;

    saveTasks();

    renderTasks();
}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(date) {

    if (!date) {
        return "";
    }

    const dateObject = new Date(date);

    if (isNaN(dateObject.getTime())) {
        return date;
    }

    return dateObject.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


// =========================================
// FILTER TASKS
// =========================================

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        return tasks.filter(task => task.completed);

    }

    return tasks;
}


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = getFilteredTasks();


    // Empty state
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("div");

        emptyMessage.className = "empty-message";

        emptyMessage.innerHTML = `
            <div class="empty-icon">🌸</div>
            <p>No tasks here!</p>
            <small>Add something you want to accomplish ✨</small>
        `;

        taskList.appendChild(emptyMessage);

    } else {

        filteredTasks.forEach(task => {

            const taskItem = document.createElement("div");

            taskItem.className = "task-item";

            if (task.completed) {
                taskItem.classList.add("completed");
            }


            // Checkbox
            const checkbox = document.createElement("button");

            checkbox.className = "task-checkbox";

            checkbox.innerHTML = task.completed ? "✓" : "";

            checkbox.setAttribute(
                "aria-label",
                task.completed
                    ? "Mark task incomplete"
                    : "Mark task completed"
            );

            checkbox.addEventListener("click", () => {
                toggleTask(task.id);
            });


            // Task content
            const taskContent = document.createElement("div");

            taskContent.className = "task-content";


            const taskText = document.createElement("p");

            taskText.className = "task-text";

            taskText.textContent = task.text;


            taskContent.appendChild(taskText);


            // Date
            if (task.date) {

                const taskDate = document.createElement("small");

                taskDate.className = "task-date";

                taskDate.textContent = `🕒 ${formatDate(task.date)}`;

                taskContent.appendChild(taskDate);
            }


            // Buttons
            const taskActions = document.createElement("div");

            taskActions.className = "task-actions";


            // Edit button
            const editButton = document.createElement("button");

            editButton.className = "edit-btn";

            editButton.innerHTML = "✏️";

            editButton.title = "Edit task";

            editButton.addEventListener("click", () => {
                editTask(task.id);
            });


            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.className = "delete-btn";

            deleteButton.innerHTML = "🗑️";

            deleteButton.title = "Delete task";

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });


            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);


            // Build task
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskContent);
            taskItem.appendChild(taskActions);

            taskList.appendChild(taskItem);

        });
    }


    updateTaskCount();
}


// =========================================
// UPDATE TASK COUNT
// =========================================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(task => !task.completed).length;

    if (taskCount) {

        taskCount.textContent =
            remainingTasks === 1
                ? "1 task remaining"
                : `${remainingTasks} tasks remaining`;
    }
}


// =========================================
// FILTER BUTTONS
// =========================================

function setFilter(filter) {

    currentFilter = filter;

    // Remove active class
    allFilter?.classList.remove("active");
    activeFilter?.classList.remove("active");
    completedFilter?.classList.remove("active");


    // Add active class
    if (filter === "all") {

        allFilter?.classList.add("active");

    } else if (filter === "active") {

        activeFilter?.classList.add("active");

    } else if (filter === "completed") {

        completedFilter?.classList.add("active");
    }


    renderTasks();
}


// =========================================
// FILTER EVENTS
// =========================================

allFilter?.addEventListener("click", () => {

    setFilter("all");

});


activeFilter?.addEventListener("click", () => {

    setFilter("active");

});


completedFilter?.addEventListener("click", () => {

    setFilter("completed");

});


// =========================================
// ADD BUTTON
// =========================================

addTaskBtn?.addEventListener("click", addTask);


// =========================================
// ENTER KEY
// =========================================

taskInput?.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        event.preventDefault();

        addTask();
    }

});


// =========================================
// INITIAL LOAD
// =========================================

renderTasks();