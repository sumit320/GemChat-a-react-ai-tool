export const scrollToBottom = (ref) => {
  if (ref?.current) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }
};
