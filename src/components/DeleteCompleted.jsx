import React from "react";
import { Trash2 } from "lucide-react";

const DeleteCompleted = () => {
  return (
    <div className="fixed bottom-4 right-4 text-red-500 bg-white rounded-full p-2 border border-gray-300/50">
      <Trash2 size={20} />
    </div>
  );
};

export default DeleteCompleted;
