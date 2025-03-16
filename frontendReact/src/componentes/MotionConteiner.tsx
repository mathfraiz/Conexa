import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

// Definição das props do componente
interface MotionContainerProps {
  children: ReactNode;
  backgroundImage?: string;
  height?: string;
  animation?: MotionProps["initial"];
  transition?: MotionProps["transition"];
  className?: string;
}

const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  backgroundImage = "",
  height = "h-auto",
  animation = { opacity: 0, y: -20 },
  transition = { duration: 0.5 },
  className = "",
}) => {
  return (
    <motion.div
      className={`relative bg-cover bg-center w-full ${height} ${className}`}
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none" }}
      initial={animation}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default MotionContainer;
