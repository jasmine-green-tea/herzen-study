import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo } from "./todoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday, isTomorrow, isPast, isAfter, addDays } from "date-fns";
import { ru } from "date-fns/locale";

const Todo = () => {
    const [text, setText] = useState("");
    const [dueDateTime, setDueDateTime] = useState(null);
    const todos = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const [filteredTodos, setFilteredTodos] = useState(todos);
    const [filter, setFilter] = useState("all");

    const getDeadlineStatus = (todo) => {
        if (todo.completed) return "completed";
        if (!todo.dueDate) return "none";
        
        const now = new Date();
        const dueDate = new Date(todo.dueDate);
        
        if (isPast(dueDate)) return "overdue";
        if (isToday(dueDate) || isTomorrow(dueDate)) return "urgent";
        if (isAfter(dueDate, addDays(now, 1))) return "upcoming";
        return "none";
    };

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
                dateKey = format(todoDate, "EEEE, d MMMM", { locale: ru });
            }
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(todo);
        });
        
        const sortedGroups = {};
        const groupOrder = ["Сегодня", "Завтра", "Без даты"];
        
        groupOrder.forEach(group => {
            if (grouped[group]) {
                sortedGroups[group] = grouped[group];
            }
        });
        
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
                dueDate: dueDateTime ? dueDateTime.toISOString() : null,
                completed: false,
                completedAt: null
            }));
            setText("");
            setDueDateTime(null);
        }
    };

    const handleToggleComplete = (id) => {
        const todo = todos.find(t => t.id === id);
        dispatch(toggleComplete({
            id,
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : null
        }));
    };

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id));
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const groupedTodos = groupTodosByDate(filteredTodos);

    const statusStyles = {
        completed: {
            backgroundColor: "#f0f0f0",
            borderLeft: "4px solid #888",
            opacity: 0.8
        },
        overdue: {
            backgroundColor: "#ffdddd",
            borderLeft: "4px solid #ff0000"
        },
        urgent: {
            backgroundColor: "#fff8dd",
            borderLeft: "4px solid #ffcc00"
        },
        upcoming: {
            backgroundColor: "#ddffdd",
            borderLeft: "4px solid #00aa00"
        },
        none: {}
    };

    return (
        <div className="view">
            <h2 style={{ marginBottom: '0.5em' }}>Список дел</h2>
            <div style={{ marginBottom: '0.5em' }}>
                <input 
                    className="input-text" 
                    placeholder="Введите задачу" 
                    type="text" 
                    value={text} 
                    onChange={handleInputChange} 
                />
                <DatePicker
                    selected={dueDateTime}
                    onChange={(date) => setDueDateTime(date)}
                    placeholderText="Выберите дату и время"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd.MM.yyyy HH:mm"
                    locale={ru}
                    minDate={new Date()}
                    isClearable
                    className="date-picker-input"
                />
            </div>

            <button 
                onClick={handleAddTodo}
                style={{ marginBottom: '0.5em'}}
            >
                Добавить
            </button>

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
                            {groupedTodos[dateGroup].map((todo) => {
                                const status = getDeadlineStatus(todo);
                                return (
                                    <li
                                        key={todo.id}
                                        style={{
                                            
                                            ...statusStyles[status],
                                            padding: "0.5em",
                                            marginBottom: "0.5em",
                                            borderRadius: "4px",
                                            transition: "all 0.3s ease",
                                            color: '#555'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                className="input-checkbox"
                                                type="checkbox" 
                                                checked={todo.completed} 
                                                onChange={() => handleToggleComplete(todo.id)}
                                                style={{ marginRight: '0.5em'}}
                                            />
                                            <div className="todo-text" style={{ flexGrow: 1, textDecoration: todo.completed ? "line-through" : "none"}}>
                                                {todo.text}
                                                {todo.dueDate && (
                                                    <span style={{ 
                                                        fontSize: '0.8em',
                                                        color: '#666',
                                                        marginLeft: '0.5em'
                                                    }}>
                                                        {format(new Date(todo.dueDate), 'dd.MM.yyyy HH:mm')}
                                                    </span>
                                                )}
                                                {todo.completed && todo.completedAt && (
                                                    <span style={{ 
                                                        fontSize: '0.8em',
                                                        color: '#666',
                                                        marginLeft: '0.5em',
                                                        fontStyle: 'italic'
                                                    }}>
                                                        (Выполнено: {format(new Date(todo.completedAt), 'dd.MM.yyyy HH:mm')})
                                                    </span>
                                                )}
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                style={{textDecoration: 'none'}}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todo;