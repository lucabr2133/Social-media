import { UseFormSetError } from "react-hook-form";
import { Inputs } from "../src/components/Signup/Signup";
import React, { SetStateAction } from "react";
import { User } from "@/types";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function onHandleSubmitLogin(
  data: Inputs,
  setUser: React.Dispatch<SetStateAction<User | null>>,
  setError: UseFormSetError<Inputs>
) {
  try {
    const response = await fetch(`${apiUrl}/logins/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if (res.error === "Password doesnt match " || res.message === "Password doesnt match ") {
      setError("password", {
        type: "server",
        message: "Password doesn`t match"
      });
      return false;
    }

    if (res.message === "User not found") {
      setError("username", {
        type: "server",
        message: "User not found"
      });
      return false;
    }

    if (!response.ok || !res.user) {
      setError("username", {
        type: "server",
        message: res.message || "Login error"
      });
      return false;
    }

    setUser(res.user);
    return true;
  } catch (err) {
    setError("username", {
      type: "server",
      message: "Cannot connect to server (check port 3000)"
    });
    return false;
  }
}

export default onHandleSubmitLogin;
