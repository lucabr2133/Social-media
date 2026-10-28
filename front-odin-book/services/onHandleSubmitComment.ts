import React from "react";
import { socket } from "../src/socket";

async function onHandleSubmitComment(
  e: React.FormEvent<HTMLFormElement>,
  userId: string,
  publicationId: string
) {
  e.preventDefault();
  const form = e.currentTarget || (e.target as HTMLFormElement);
  const formData = new FormData(form);
  const rawComment = formData.get("comment");
  const comment = typeof rawComment === "string" ? rawComment.trim() : "";

  if (!comment) return;

  socket.emit("publication comments", {
    text: comment,
    from: userId,
    publicationId,
  });

  form.reset();
}

export default onHandleSubmitComment;
