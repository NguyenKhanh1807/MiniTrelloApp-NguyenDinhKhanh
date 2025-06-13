import { useDrop } from "react-dnd";
import TaskItem from "./TaskItem";

const TaskColumn = ({ status, tasks, boardId, cardId, onUpdate, onDelete }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (draggedTask) => {
      if (draggedTask.status !== status) {
        onUpdate(draggedTask.id, { status });
      }
    },
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 p-3 rounded shadow min-h-[300px] w-full"
    >
      <h3 className="text-lg font-semibold capitalize mb-2">{status}</h3>
      {tasks.map((task) => (
        <TaskItem
          key={task.id || task._id}
          task={task}
          boardId={boardId}
          cardId={cardId}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskColumn;
