import {v4 as uuidv4} from 'uuid'

let state = localStorage.getItem("todo-list") ? JSON.parse(localStorage.getItem("todo-list")) : []

const todo = document.querySelector(".todo");
const todoItems = document.querySelector(".todo-items")
const noItems = document.querySelector(".no-items")
const todoInput = document.querySelector(".todo-input input")
const todoInputBtn = document.querySelector(".todo-input span")
noItems.innerText = "No Tasks at the momoent";
noItems.className = "no-items"

const active = document.querySelector(".status .active span");
const finished = document.querySelector(".status .finished span");
const total = document.querySelector(".status .total span");

const calcTaskStatus = () => {
    total.innerText = state.length;
    active.innerText = state.filter((el) => !el.checked).length;
    finished.innerText = state.filter((el) => el.checked).length;
}

const addItem = (val, checked = false, uuid) => {
    const item = document.createElement('div');
    const text = document.createElement('span');
    const clear = document.createElement('div');
    const checkbox = document.createElement('input');

    text.innerText = val;
    text.className = checked ? 'checked' : '';

    clear.innerText = "Clear";
    clear.addEventListener("click", () => {
        item.remove();
        state = state?.filter((el) => el.uuid !== uuid);
        localStorage.setItem("todo-list", JSON.stringify(state));
        createStartEl();
    })

    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    checkbox.addEventListener("change", (e) => {
        state =  state?.map(el => el.uuid === uuid ? {...el, checked: e.target.checked} : el);
        localStorage.setItem("todo-list", JSON.stringify(state));

        if(e.target.checked){
            text.className = "checked"
        }else {
            text.className = "";
        }

        calcTaskStatus();
    })

    item.className = "item";
    item.dataset.uuid = uuid;

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(clear);
    todoItems.appendChild(item);
    todoInput.value = "";
}



todoInputBtn.addEventListener("click", () => {
    const uuid = uuidv4();
    const val = todoInput.value;

    addItem(val, false, uuid);
    state.push({
        uuid: uuid, 
        text: val,
        checked: false,
    })
    createStartEl();
    localStorage.setItem("todo-list", JSON.stringify(state));
});

const createStartEl = () => {
    todoItems.remove();
    noItems.remove();
    todoItems.innerHTML = "";

    if (state.length === 0){
        todo.appendChild(noItems);
    }else {
        todo.appendChild(todoItems);
        state?.forEach((el) => {
            addItem(el.text, el.checked, el.uuid);
        })
    }

    calcTaskStatus();
}


const clearAllTasks = () => {
    state = [];
    localStorage.setItem("todo-list", JSON.stringify(state));
    createStartEl();
}

const clearFinishedTasks = () => {
    state = state?.filter((el) => {
        if(el?.checked)
        document.querySelector(`[data-uuid="${el.uuid}"]`).remove();

        return !el?.checked;
    })
    localStorage.setItem("todo-list", JSON.stringify(state));
    createStartEl();
}



document.querySelector(".clear-all").addEventListener("click", clearAllTasks);
document.querySelector(".clear-finished").addEventListener("click", clearFinishedTasks);


createStartEl();
