
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const counter = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";
let nextId = 1;

// Add a new task
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") return;

    todos.push({
        id: nextId++,
        text: text,
        completed: false
    });

    input.value = "";
    renderTodos();
});

// Display tasks
function renderTodos() {
    list.innerHTML = "";

    const visibleTodos = todos.filter(function (todo) {
        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    visibleTodos.forEach(function (todo) {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        checkbox.addEventListener("change", function () {
            todo.completed = checkbox.checked;
            renderTodos();
        });

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = todo.text;

        // Double-click to edit a task
        span.addEventListener("dblclick", function () {
            const editInput = document.createElement("input");
            editInput.className = "edit-input";
            editInput.value = todo.text;

            span.replaceWith(editInput);
            editInput.focus();
            editInput.select();

            function saveEdit() {
                const newText = editInput.value.trim();

                if (newText !== "") {
                    todo.text = newText;
                }

                renderTodos();
            }

            editInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    saveEdit();
                }

                if (event.key === "Escape") {
                    renderTodos();
                }
            });

            editInput.addEventListener("blur", saveEdit);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", function () {
            todos = todos.filter(function (item) {
                return item.id !== todo.id;
            });

            renderTodos();
        });

        li.append(checkbox, span, deleteButton);
        list.appendChild(li);
    });

    const remaining = todos.filter(function (todo) {
        return !todo.completed;
    }).length;

    counter.textContent =
        remaining + (remaining === 1 ? " item left" : " items left");
}

// Filter buttons
filters.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filters.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");
        renderTodos();
    });
});

// Clear completed tasks
document.getElementById("clear-completed")
    .addEventListener("click", function () {
        todos = todos.filter(function (todo) {
            return !todo.completed;
        });

        renderTodos();
    });

// Clear every task
document.getElementById("clear-all")
    .addEventListener("click", function () {
        todos = [];
        renderTodos();
    });

// Initial display
renderTodos();
