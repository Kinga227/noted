import React from 'react';
import { useDrag } from 'react-dnd';
import Assignment from './todotypes/Assignment';
import Important from './todotypes/Important';
import Fun from './todotypes/Fun';
import Presenting from './todotypes/Presenting';
import Exam from './todotypes/Exam';
import People from './todotypes/People';
import Calendar from './todotypes/Calendar';

function ToDoItem({ todo, handleTodoClick, handleDropToTrash }) {
  const [{ isDragging }, drag] = useDrag({
    item: { id: todo.id, date: todo.date, type: 'TODO_ITEM' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (dropResult.type === 'DATE_CARD') {
        } else if (dropResult.type === 'TRASH') {
          handleDropToTrash(item.id);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    type: 'TODO_ITEM',
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button type="button" className="todo-item" onClick={() => handleTodoClick(todo.id)}>
        {todo.typeId === 1 && (
          <>
            <Assignment />
            <div className="description-container">
              <strong>
                {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
              </strong>
            </div>
          </>
        )}
        {todo.typeId === 2 && (
          <>
            <Important />
            <div className="description-container">
              {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
            </div>
          </>
        )}
        {todo.typeId === 3 && (
          <>
            <Fun />
            <div className="description-container">
              <i>
                {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
              </i>
            </div>
          </>
        )}
        {todo.typeId === 4 && (
          <>
            <Presenting />
            <div className="description-container">
              {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
            </div>
          </>
        )}
        {todo.typeId === 5 && (
          <>
            <Exam />
            <div className="description-container">
              <span style={{ fontWeight: 800 }}>
                {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
              </span>
            </div>
          </>
        )}
        {todo.typeId === 6 && (
          <>
            <People />
            <div className="description-container">
              {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
            </div>
          </>
        )}
        {todo.typeId === 7 && (
          <>
            <Calendar />
            <div className="description-container">
              {todo.done ? <span className="todo-done">{todo.description}</span> : <span>{todo.description}</span>}
            </div>
          </>
        )}
      </button>
    </div>
  );
}

export default ToDoItem;
