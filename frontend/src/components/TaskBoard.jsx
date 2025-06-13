import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskItem from "./TaskItem";
import TaskDraggable from "./TaskDraggable";

export default function TaskBoard({ boardId, cardId, tasks, onDelete, onUpdate }) {
  const statuses = ["icebox", "doing", "done"];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 w-full">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            boardId={boardId}
            cardId={cardId}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </DndProvider>
  );
}

function TaskColumn({ status, tasks, boardId, cardId, onDelete, onUpdate }) {
  const [, drop] = useDrop({
    accept: "task",
    drop: (draggedTask) => {
      if (draggedTask.status !== status) {
        onUpdate(draggedTask.id, { status });
      }
    },
  });
  
  const statusColors = {
    icebox: "bg-blue-100 border-blue-400",
    doing: "bg-yellow-100 border-yellow-400",
    done: "bg-green-100 border-green-400",
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[250px] border-t-4 ${statusColors[status]} rounded-md p-4 transition-all`}
    >
      <h2 className="text-xl font-bold text-center mb-3 capitalize tracking-wide">
        {status}
      </h2>

      {tasks.length === 0 ? (
        <div className="text-gray-400 text-sm italic text-center">
          No tasks
        </div>
      ) : (
        tasks.map((task) => (
          <TaskDraggable key={task.id || task._id} task={task}>
            <TaskItem
              task={task}
              boardId={boardId}
              cardId={cardId}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </TaskDraggable>
        ))
      )}
    </div>
  );
}
