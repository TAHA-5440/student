// ============================================================================
// Create Form Component - AI-powered form generation
// ============================================================================
// Handles the initial form creation workflow:
// - Collects user description via dialog modal
// - Sends description to AI API for form structure generation
// - Saves generated form to Supabase database
// - Navigates to form editor after successful creation
// ============================================================================

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
  // ===== STATE MANAGEMENT =====
  // Track if dialog modal is open
  const [dialogOpen, setDialogOpen] = useState(false);
  // Store user's form description input
  const [userInput, setUserInput] = useState("");
  // Show loading state while calling AI API
  const [loading, setLoading] = useState(false);
  // Store AI response from model
  const [aiResponse, setAiResponse] = useState("");
  // Track database insert errors
  const [insertError, setInsertError] = useState("");

  // Next.js router for navigation after form creation
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;

    // Reset state before starting
    setLoading(true);
    setInsertError("");
    setAiResponse("");

    try {
      // Construct AI prompt with specific format requirements
      // AI is instructed to return JSON with form structure
      const basePrompt =
        "Instructions: , On the basis of description please give form in json format with form title, form subheading, form field,field type form name, placeholder name, and form label in  JSON Format structure . Form Details:";
      const combinedPrompt = `${basePrompt} ${userInput}`;
      console.log("Prompt preview:", combinedPrompt.slice(0, 300));

      // Call AI API route
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      // Parse response - handle both JSON and text responses
      let data;
      try {
        data = await res.json();
      } catch (err) {
        const text = await res.text();
        data = { text };
      }
      console.log("AI response :", data);

      // Extract AI text from various response formats
      // Different AI models return responses in different structures
      const aiText = data.text ?? data.result ?? JSON.stringify(data);
      setAiResponse(aiText);

      // Prepare database row
      // Includes the original prompt and AI-generated form structure
      const row = {
        Input: combinedPrompt,
        "AI response": aiText,
      };

      // Insert form into Supabase database
      const { data: insertData, error: insertErr } = await supabase
        .from("Ai Form Builder")
        .insert([row])
        .select();

      // Handle insertion result
      if (insertErr) {
        console.error("Insert error:", insertErr);
        setInsertError(
          insertErr.message ??
            "Failed to save AI response. Check console for details."
        );
      } else {
        console.log("Insert success:", insertData);
        // Clear form and close dialog
        setUserInput("");
        setDialogOpen(false);
        // Navigate to form editor for the newly created form
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
      {/* Dialog Trigger Button - Opens the create form modal */}
      <DialogTrigger asChild>
        <Button variant="outline">Create Form</Button>
      </DialogTrigger>

      {/* Dialog Modal Content */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create the AI Form</DialogTitle>

        {/* Form Input Section */}
        <form onSubmit={handleSubmit}>
          <DialogDescription>
            {/* Textarea for user to describe their desired form */}
            <Textarea
              placeholder="Enter the description of the form"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            {/* Error message display if form creation fails */}
            {insertError && (
              <p className="mt-2 text-sm text-red-600">{insertError}</p>
            )}
          </DialogDescription>

          {/* Dialog Action Buttons */}
          <DialogFooter className="mt-4">
            {/* Cancel Button - Closes dialog without creating form */}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            {/* Submit Button - Triggers AI form generation */}
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
