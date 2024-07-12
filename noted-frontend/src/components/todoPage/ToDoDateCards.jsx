import React from 'react';
import { useDrop } from 'react-dnd';
import ToDoItem from './ToDoItem';
import AddToDoButton from './AddToDoButton';
import { useToDoQuery } from '../../hooks/useToDoQuery';

function ToDoDateCard({ date, originalDate, dayName, todos, handleTodoClick, handleDropToTrash }) {
  const todosForDate = todos.filter(
    (todo) => new Date(todo.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) === date,
  );
  const doneTodos = todosForDate.filter((todo) => todo.done);
  const notDoneTodos = todosForDate.filter((todo) => !todo.done);
  const allTodos = [...notDoneTodos, ...doneTodos];
  const { updateDate } = useToDoQuery();

  const [{ isOver }, drop] = useDrop({
    accept: 'TODO_ITEM',
    drop: (item) => {
      const droppedTodoId = item.id;
      const updatedTodos = todos.map((todo) => (todo.id === droppedTodoId ? { ...todo, date: originalDate } : todo));
      updateDate(droppedTodoId, originalDate);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`day-card ${isOver ? 'highlight' : ''}`}>
      <div className="date-container">
        <p className="day-name">{dayName}</p>
        <p className="date">{date}</p>
        <AddToDoButton originalDate={originalDate} />
      </div>
      <div className="todos-container">
        {allTodos.map((todo) => (
          <ToDoItem key={todo.id} todo={todo} handleTodoClick={handleTodoClick} handleDropToTrash={handleDropToTrash} />
        ))}
      </div>
    </div>
  );
}

export default ToDoDateCard;
