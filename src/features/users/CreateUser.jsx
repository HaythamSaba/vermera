import { useState } from "react";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUsername } from "./userSlice";
import { useNavigate } from "react-router";
import MainButton from "../../ui/MainButton";

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!username.trim()) return;
    dispatch(updateUsername(username));
    navigate("/products");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-[87.8vh] bg-ivory flex items-center justify-center px-4">
      <div className="bg-cream border border-stone p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone/20 rounded-full mb-4">
            <User className="w-8 h-8 text-brass" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-espresso mb-2">
            Welcome to Vermera
          </h1>
          <p className="text-taupe">Enter your name to get started</p>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-charcoal mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-stone bg-cream outline-none transition"
          />
        </div>

        <MainButton
          content="Start Shopping"
          variant="quiet"
          fullWidth
          onClick={handleSubmit}
          disabled={!username.trim()}
        />

        {/* Footer Text */}
        <p className="text-center text-sm text-taupe mt-6">
          Considered pieces for everyday living.
        </p>
      </div>
    </div>
  );
};

export default CreateUser;
