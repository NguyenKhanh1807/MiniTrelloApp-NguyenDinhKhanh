import { useDrag } from "react-dnd";

export default function TaskDraggable({ task, children }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "task",
    item: {
      id: task.id || task._id,
      status: task.status,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
    >
      {children}
    </div>
  );
}
