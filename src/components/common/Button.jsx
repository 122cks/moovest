import { motion } from "framer-motion";

const variants = {
  primary: "bg-emerald-500 hover:bg-emerald-400 text-white",
  secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
  ghost:
    "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
