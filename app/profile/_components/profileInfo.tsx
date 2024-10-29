"use client";

import React, { useEffect, useState } from "react";

interface UserInfo {
  user_id: number;
  user_name: string;
  user_email: string;
}

const ProfileInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/user-info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // This is important for including cookies
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserInfo(data.data);
      } catch (err) {
        setError("Failed to fetch user information");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <h2 className="text-2xl font-bold">Profile Information</h2>
      {userInfo ? (
        <div className="mt-10 flex flex-col gap-3">
          <p>Name: {userInfo.user_name}</p>
          <p>Email: {userInfo.user_email}</p>
        </div>
      ) : (
        <p>No user information available</p>
      )}
    </main>
  );
};

export default ProfileInfo;
