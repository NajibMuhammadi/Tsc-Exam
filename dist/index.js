"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const taskInput = document.querySelector('#taskInput');
const addTaskBtn = document.querySelector('#addTask');
const taskList = document.querySelector('#taskList');
const topBooks = document.querySelector('#TopBooks');
let tasks = loadTasks();
tasks.forEach(addTask);
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = { taskText: taskText, completed: false };
        addTask(task);
        tasks.push(task);
        saveTasks();
        taskInput.value = '';
    }
});
function addTask(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task.taskText;
    if (task.completed) {
        listItem.classList.add('checked');
    }
    const span = document.createElement('span');
    span.innerHTML = 'X';
    span.addEventListener('click', (e) => {
        e.stopPropagation();
        taskList.removeChild(listItem);
        tasks = tasks.filter(t => t !== task);
        saveTasks();
    });
    listItem.addEventListener('click', () => {
        task.completed = !task.completed;
        listItem.classList.toggle('checked', task.completed);
        saveTasks();
    });
    listItem.appendChild(span);
    taskList.appendChild(listItem);
}
function saveTasks() {
    localStorage.setItem('Tasks', JSON.stringify(tasks));
}
function loadTasks() {
    const taskJSON = localStorage.getItem("Tasks");
    if (taskJSON == null)
        return [];
    return JSON.parse(taskJSON);
}
function fetchApi() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://openlibrary.org/people/mekBot/books/want-to-read.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const books = data.reading_log_entries.map(entry => ({
                title: entry.work.title,
                authorName: entry.work.author_names,
                firstPublishYear: entry.work.first_publish_year || null,
            }));
            return books;
        }
        catch (err) {
            console.error('Error fetching', err);
            return [];
        }
    });
}
fetchApi().then(books => {
    books.slice(0, 5).forEach(book => {
        const listItem = document.createElement('li');
        const title = document.createElement('p');
        title.style.fontSize = '20px';
        title.style.fontStyle = 'italic',
            title.textContent = `Title: ${book.title}`;
        const subtitle = document.createElement('p');
        subtitle.textContent = ` Author: ${book.authorName.join(", ")}`;
        const year = document.createElement('p');
        year.textContent = ` Year Published: ${book.firstPublishYear}`;
        listItem.append(title, subtitle, year);
        topBooks.appendChild(listItem);
    });
});
/* https://openlibrary.org/people/mekBot/books/want-to-read.json */ 
