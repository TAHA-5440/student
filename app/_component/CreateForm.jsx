"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const CreateForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [insertError, setInsertError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    setLoading(true);
    setInsertError("");
    setAiResponse("");

    try {
      const basePrompt =
        "Instructions: , On the basis of description please give form in json format with form title, form subheading, form field,field type form name, placeholder name, and form label in  JSON Format structure . Form Details:";
      const combinedPrompt = `${basePrompt} ${userInput}`;
      console.log("Prompt preview:", combinedPrompt.slice(0, 300));

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        const text = await res.text();
        data = { text };
      }
      console.log("AI response :", data);

      const aiText = data.text ?? data.result ?? JSON.stringify(data);
      setAiResponse(aiText);

      // Build row without user_id since anon can insert
      const row = {
        Input: combinedPrompt,
        "AI response": aiText,
      };

      const { data: insertData, error: insertErr } = await supabase
        .from("Ai Form Builder")
        .insert([row])
        .select();

      if (insertErr) {
        console.error("Insert error:", insertErr);
        setInsertError(
          insertErr.message ??
            "Failed to save AI response. Check console for details."
        );
      } else {
        console.log("Insert success:", insertData);
        setUserInput("");
        setDialogOpen(false);
        router.push(`/editform/${insertData[0].id}`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setAiResponse(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Form</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create the AI Form</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogDescription>
            <Textarea
              placeholder="Enter the description of the form"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            {insertError && (
              <p className="mt-2 text-sm text-red-600">{insertError}</p>
            )}
          </DialogDescription>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForm;
