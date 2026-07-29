import { CheckCircle } from "lucide-react";

export default function Toast({ message }) {
  return (
    <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
      <CheckCircle size={22} />
      <span className="font-semibold">{message}</span>
    </div>
  );
}