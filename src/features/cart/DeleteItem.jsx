import { useDispatch } from "react-redux";
import { deleteItem } from "./cartSlice";
import { Trash2 } from "lucide-react";

const DeleteItem = ({ sku }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(deleteItem(sku));
  };
  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 transition ml-2 p-4 bg-cream rounded-full hover:bg-red-100"
      title="Remove item"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};

export default DeleteItem;
