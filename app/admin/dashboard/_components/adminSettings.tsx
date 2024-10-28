"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminSettings = () => {
  const [monthlyGoal, setMonthlyGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyGoal = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/admin/monthly_goal`,
          { credentials: "include" },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch monthly goal");
        }
        const result = await response.json();
        if (!result.success || !result.data) {
          throw new Error("Invalid data received from API");
        }

        const goalValue = result.data[0]?.monthly_goal;
        if (goalValue === undefined || goalValue === null) {
          throw new Error("Monthly goal data is missing");
        }

        const parsedGoal = parseInt(goalValue, 10);
        if (isNaN(parsedGoal)) {
          throw new Error("Invalid monthly goal value");
        }

        setMonthlyGoal(parsedGoal);
      } catch (err) {
        console.error("Error fetching monthly goal:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to fetch monthly goal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyGoal();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (monthlyGoal === null) {
      toast.error("Please enter a valid monthly goal");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/admin/monthly_goal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ monthly_goal: monthlyGoal }),
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update monthly goal");
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to update monthly goal");
      }
      toast.success("Monthly goal updated successfully");
    } catch (err) {
      console.error("Error updating monthly goal:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to update monthly goal");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setMonthlyGoal(null);
    } else {
      const parsedValue = parseInt(value, 10);
      setMonthlyGoal(isNaN(parsedValue) ? null : parsedValue);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-10 h-fit">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 bg-transparent"
          >
            <Input
              name="monthly_goal"
              type="number"
              placeholder="Enter monthly goal"
              required
              labelPlacement="outside"
              label="Monthly Goal"
              variant="underlined"
              className="w-fit border-none p-0"
              description="Set your monthly goal"
              value={monthlyGoal?.toString() ?? ""}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              className="w-fit bg-green-500 transition-all duration-300 ease-in-out hover:bg-green-600"
              disabled={monthlyGoal === null}
            >
              Save
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminSettings;
