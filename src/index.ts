const taskInput = document.querySelector('#taskInput') as HTMLInputElement;
const addTaskBtn = document.querySelector('#addTask') as HTMLButtonElement;
const taskList = document.querySelector('#taskList') as HTMLUListElement;
const topBooks = document.querySelector('#TopBooks') as HTMLUListElement;

type Task = {
    taskText: string;
    completed: boolean;
};

let tasks : Task [] = loadTasks();

tasks.forEach(addTask);

addTaskBtn.addEventListener('click', (): void => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task: Task = { taskText: taskText, completed: false };
        addTask(task);
        tasks.push(task);
        saveTasks();
        taskInput.value = '';
    }
});

function addTask(task: Task): void {
    const listItem = document.createElement('li');
    listItem.textContent= task.taskText;
    if (task.completed){
        listItem.classList.add('checked');
    }

    const span = document.createElement('span');
    span.innerHTML = 'X';

    span.addEventListener('click', (e) => {
        e.stopPropagation();
        taskList.removeChild(listItem);
        tasks = tasks.filter(t => t !== task);
        saveTasks();
    })

    listItem.addEventListener('click', (): void => {
        task.completed = !task.completed;
        listItem.classList.toggle('checked', task.completed);
        saveTasks();
    });

    listItem.appendChild(span)
    taskList.appendChild(listItem);
}

function saveTasks(){
    localStorage.setItem('Tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[]{
   const taskJSON = localStorage.getItem("Tasks");
   if(taskJSON == null) return [];
   return JSON.parse(taskJSON);
}


type Book = {
    title: string;
    authorName: string[];
    firstPublishYear: number | null;
};

type ApiResponse = {
    reading_log_entries: {
        work: {
            title: string;
            author_names: string[];
            first_publish_year: number | null;
        };
    }[];
};

async function fetchApi(): Promise<Book[]> {
    try {
        const response = await fetch('https://openlibrary.org/people/mekBot/books/want-to-read.json');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        const books: Book[] = data.reading_log_entries.map(entry => ({
            title: entry.work.title,
            authorName: entry.work.author_names,
            firstPublishYear: entry.work.first_publish_year || null,
        }));

        return books;

    } catch (err) {
        console.error('Error fetching', err);
        return [];
    }
}

fetchApi().then(books => {
    books.slice(0, 5).forEach(book => {
        const listItem = document.createElement('li');
        const title = document.createElement('p');
        title.style.fontSize = '20px'
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