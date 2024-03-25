import { Task } from "./Task.js";

class Todos {
    #tasks = [];
    #backend_url = '';

    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = async () => {
        return fetch(this.#backend_url)
            .then(response => response.json())
            .then(json => {
                this.#readJson(json);
                return this.#tasks;
            });
    };

    addTask = async (text) => {
        const json = JSON.stringify({ description: text });
        return fetch(this.#backend_url + '/new', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: json
        })
        .then(response => response.json())
        .then(json => this.#addToArray(json.id, text));
    };

    removeTask = (id) => {
        return fetch(this.#backend_url + '/delete/' + id, {
            method: 'delete'
        })
        .then(response => response.json())
        .then(json => {
            this.#removeFromArray(id);
            return json.id;
        });
    };

    #readJson = (tasksAsJson) => {
        tasksAsJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    };

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    };

    #removeFromArray = (id) => {
        this.#tasks = this.#tasks.filter(task => task.id !== id);
    };
}

export { Todos };