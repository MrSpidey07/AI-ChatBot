export class ChatError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleError = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
};
