"use client";

import { supabase } from "@/app/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Formpage from "@/app/_component/form";

export default function editForm() {
  const { id } = useParams();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const getFormData = async () => {
      const { data, error } = await supabase
        .from("Ai Form Builder")
        .select("*")
        .eq("id", id)
        .single();

      // 🔍 Log Supabase raw response

      const cleaned = data["AI response"]
        .replace(/```json\s*/, "")
        .replace(/```/g, "")
        .trim();

      // Parse the cleaned JSON
      data["AI response"] = JSON.parse(cleaned);
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);

      if (error) {
        setError("Failed to load form");
      } else {
        setFormData(data);
      }

      setLoading(false);
    };

    getFormData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return <Formpage formData={formData} />;
}
