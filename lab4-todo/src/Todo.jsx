import React, { useState, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo } from "./todoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday, isTomorrow, isSameDay, parseISO } from "date-fns";
import { ru } from "date-fns/locale"; // Assuming you want Russian locale

const Todo = () => {
    const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const [filteredTodos, setFilteredTodos] = useState(todos);
    const [filter, setFilter] = useState('all');

    // Group todos by date
    const groupTodosByDate = (todos) => {
        const grouped = {};
        
        todos.forEach(todo => {
            let dateKey;
            const todoDate = todo.dueDate ? new Date(todo.dueDate) : null;
            
            if (!todoDate) {
                dateKey = "Без даты";
            } else if (isToday(todoDate)) {
                dateKey = "Сегодня";
            } else if (isTomorrow(todoDate)) {
                dateKey = "Завтра";
            } else {
                dateKey = format(todoDate, "EEEE, MMMM d", { locale: ru });
            }
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(todo);
        });
        
        // Sort the groups by date
        const sortedGroups = {};
        const groupOrder = ["Сегодня", "Завтра", "Без Даты"];
        
        // Add special groups first in order
        groupOrder.forEach(group => {
            if (grouped[group]) {
                sortedGroups[group] = grouped[group];
            }
        });
        
        // Add remaining dates in chronological order
        Object.keys(grouped)
            .filter(group => !groupOrder.includes(group))
            .sort((a, b) => {
                const dateA = grouped[a][0].dueDate ? new Date(grouped[a][0].dueDate) : new Date(0);
                const dateB = grouped[b][0].dueDate ? new Date(grouped[b][0].dueDate) : new Date(0);
                return dateA - dateB;
            })
            .forEach(group => {
                sortedGroups[group] = grouped[group];
            });
        
        return sortedGroups;
    };

    useEffect(() => {
        let filtered = [...todos];
        
        if (filter === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }
        
        setFilteredTodos(filtered);
    }, [todos, filter]);

    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    const handleAddTodo = () => {
        if (text) {
            dispatch(addTodo({
                text,
                dueDate: dueDate ? dueDate.toISOString() : null
            }));
            setText("");
            setDueDate(null);
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

    const groupedTodos = groupTodosByDate(filteredTodos);

    return (
        <div className="view">
            <div style={{ marginBottom: '0.5em' }}>
                <input 
                    className="input-text" 
                    placeholder="Введите задачу" 
                    type="text" 
                    value={text} 
                    onChange={handleInputChange} 
                />
            </div>
            <div style={{ marginBottom: '0.5em', display: 'flex', alignItems: 'center' }}>
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    placeholderText="Выберите дату"
                    dateFormat="dd.MM.yyyy"
                    locale={ru}
                    minDate={new Date()}
                    isClearable
                    className="date-picker-input"
                />
                <button 
                    onClick={handleAddTodo} 
                    style={{ marginLeft: '0.5em' }}
                >
                    Добавить
                </button>
            </div>
            <div>
                <select 
                    onChange={handleFilterChange}
                    value={filter}
                    style={{ height: '2.5em', width: '10em', marginRight: '2em' }}
                >
                    <option value="all">Все</option>
                    <option value="active">Активные</option>
                    <option value="completed">Завершенные</option>
                </select>
            </div>

            <div className="todo-groups">
                {Object.keys(groupedTodos).map((dateGroup) => (
                    <div key={dateGroup} className="todo-group">
                        <h3 className="group-header">{dateGroup}</h3>
                        <ul>
                            {groupedTodos[dateGroup].map((todo) => (
                                <li
                                    key={todo.id}
                                    style={{
                                        textDecoration: todo.completed ? "line-through" : "none"
                                    }}
                                >
                                    <div className="task-row" style={{ marginBottom: '0.5em' }}>
                                        <input
                                            className="input-checkbox"
                                            type="checkbox" 
                                            checked={todo.completed} 
                                            onChange={() => handleToggleComplete(todo.id)}
                                        />
                                        <div className="todo-text">
                                            {todo.text}
                                            {todo.dueDate && (
                                                <span style={{ 
                                                    fontSize: '0.8em',
                                                    color: '#666',
                                                    marginLeft: '0.5em'
                                                }}>
                                                    {format(new Date(todo.dueDate), 'dd.MM.yyyy')}
                                                </span>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTodo(todo.id)} 
                                            style={{ float: 'right' }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todo;
