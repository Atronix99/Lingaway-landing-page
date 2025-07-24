// components/UserInfo.tsx
"use client";

import { useUser } from "@clerk/nextjs";

export default function UserInfo() {
  const { user } = useUser();

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.username || user.firstName || "User"}!</h2>
      ) : (
        <h2>User information not available.</h2>
      )}
    </div>
  );
}
