import React, { useState, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo } from "./todoSlice";

const Todo = () => {
    const [text, setText] = useState("");
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const [filteredTodos, setFilteredTodos] = useState(todos);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (filter === 'all') {
            setFilteredTodos(todos);
        } else if (filter === 'active') {
            setFilteredTodos(todos.filter(todo => !todo.completed));
        } else if (filter === 'completed') {
            setFilteredTodos(todos.filter(todo => todo.completed));
        }
    }, [todos, filter]);

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleAddTodo = () => {
        if (text) {
            dispatch(addTodo(text));
            setText("");
        }
    };

    const handleToggleComplete = (id) => {
        dispatch(toggleComplete(id));
    };

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id));
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };



    return (
        <div className="view">
            <div style={{marginBottom: '0.5em'}}>
                <input className="input-text" placeholder="Введите задачу" type="text" value={text} onChange={handleInputChange} />{" "}
            </div>

                <button onClick={handleAddTodo} style={{float: 'right', marginBottom: '0.5em'}}>Добавить</button>{" "}
            <div>
                <select 
                    onChange={handleFilterChange}
                    value={filter}
                    style={{height: '2.5em', width: '10em', marginRight: '2em'}}
                >
                    <option value="all">Все</option>
                    <option value="active">Активные</option>
                    <option value="completed">Завершенные</option>
                </select>
            </div>


            <ul>
                {" "}
                {filteredTodos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            textDecoration: todo.completed ? "line-through" : "none"
                        }}
                    >
                        <div className="task-row" style={{marginBottom: '0.5em'}}>
                            <input
                                className="input-checkbox"
                                type="checkbox" checked={todo.completed} onChange={() => handleToggleComplete(todo.id)}
                            />
                            <div className="todo-text">{todo.text}{" "}</div>
                            <button onClick={() => handleDeleteTodo(todo.id)} style={{float: 'right'}}>Удалить</button>{" "}
                        </div>
                    </li>
                ))}{" "}
            </ul>{" "}
        </div>
    );
};

export default Todo;
