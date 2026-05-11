export const isMockEnabled = () => {
  if (import.meta.env.DEV) {
    return (
      import.meta.env.VITE_ENABLE_MOCK_DATA !== "false" ||
      localStorage.getItem("equiaudit_force_mock") === "true"
    );
  }
  return import.meta.env.VITE_ENABLE_MOCK_DATA === "true";
};
