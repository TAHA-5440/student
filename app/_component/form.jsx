// Form editor with field editing, preview, and submission
"use client";
import React, { useState, useEffect } from "react";
import {
  Edit,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "../lib/supabase";

// Sub-component for editing field label and placeholder
const EditFieldController = ({ field, onUpdate }) => {
  const [label, setLabel] = useState(
    field.label || field.formLabel || field.form_label || ""
  );
  const [placeholder, setPlaceholder] = useState(
    field.placeholder || field.placeholderName || field.placeholder_name || ""
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    onUpdate({
      ...field,
      label: label,
      formLabel: label,
      placeholder: placeholder,
      placeholderName: placeholder,
    });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-all">
          <Edit size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5 shadow-2xl border-gray-200 rounded-2xl">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-gray-800">Field Settings</h4>
            <p className="text-xs text-gray-500">Update visuals.</p>
          </div>
          <div className="grid gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400">
                Label Name
              </label>
              <input
                className="border border-gray-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase text-gray-400">
                Placeholder
              </label>
              <input
                className="border border-gray-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 w-full rounded-xl"
            >
              Update Field
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Main form editor component
const Formpage = ({ formData }) => {
  const [fields, setFields] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({});

  /**
   * Parses AI-generated JSON response and extracts form structure
   * Handles both string and object responses from the AI model
   * Supports multiple naming conventions (camelCase and snake_case)
   *
   * @returns {Object} Parsed form with title, subheading, and fields array
   */
  const getAiData = () => {
    const raw = formData?.["AI response"];
    if (!raw) return { title: "Loading...", subheading: "", fields: [] };

    let parsed = raw;
    // Parse JSON if it's returned as a string
    if (typeof raw === "string") {
      try {
        const cleanJson = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        return {
          title: "Fixing Form Structure...",
          subheading: "Please wait or edit manually.",
          fields: [],
        };
      }
    }

    // Extract form metadata using multiple naming conventions
    return {
      title: parsed.formTitle || parsed.form_title || "Untitled Form",
      subheading:
        parsed.formSubheading ||
        parsed.form_subheading ||
        "Fill details below.",
      fields: parsed.formFields || parsed.form_fields || [],
    };
  };

  // Parse AI data into usable form structure
  const ai = getAiData();

  // Initialize fields when form data changes
  useEffect(() => {
    if (ai.fields && ai.fields.length > 0) {
      setFields(ai.fields);
    }
  }, [formData]);

  /**
   * Removes a field from the form by index
   * @param {number} indexToDelete - Index of field to remove
   */
  const deleteField = (indexToDelete) => {
    setFields(fields.filter((_, index) => index !== indexToDelete));
  };

  /**
   * Updates a specific field's properties
   * Called when user edits field label or placeholder
   *
   * @param {number} index - Field index to update
   * @param {Object} updatedData - New field data
   */
  const handleFinalUpdate = (index, updatedData) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updatedData };
    setFields(updatedFields);
  };

  /**
   * Updates form field values as user types
   * Maintains state of all user inputs for form submission
   *
   * @param {string} label - Field label
   * @param {string} value - User input value
   */
  const handleInputChange = (label, value) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  /**
   * Persists form structure changes to Supabase database
   * Called when user clicks "Save Changes" button
   * Updates the AI response JSON with modified fields
   */
  const handleSaveFormStructure = async () => {
    if (!formData?.id) return alert("No form ID found.");
    setIsSaving(true);
    try {
      const updatedAiResponse = {
        ...ai,
        formFields: fields,
      };

      const { error } = await supabase
        .from("Ai Form Builder")
        .update({ "AI response": updatedAiResponse })
        .eq("id", formData.id);

      if (error) throw error;
      alert("Form structure saved!");
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Submits form responses to database
   * Stores user input values with form metadata
   * Only available in preview mode
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare submission data with form title and description
      const submissionData = {
        form_title: ai.title,
        form_subheading: ai.subheading,
        responses: formValues,
      };

      const { error } = await supabase.from("form_responses").insert([
        {
          form_id: formData?.id || "unknown",
          response_data: submissionData,
        },
      ]);
      if (error) throw error;
      alert("Submitted successfully!");
      setFormValues({});
    } catch (err) {
      alert("Error submitting response.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copies current form URL to clipboard for sharing
   * Provides visual feedback (checkmark) when copied
   */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ===== HEADER / TOOLBAR ===== */}
      {/* Fixed header with form title, action buttons for save/preview/share */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* FormAI Logo */}
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <span className="font-bold text-gray-800">FormAI Builder</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Changes Button - Only shown in edit mode */}
          {!isPreview && (
            <Button
              onClick={handleSaveFormStructure}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 rounded-full gap-2 px-6"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}

          {/* Preview/Exit Preview Toggle Button */}
          <Button
            variant={isPreview ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <EyeOff size={18} className="mr-2" />
            ) : (
              <Eye size={18} className="mr-2" />
            )}
            {isPreview ? "Exit Preview" : "Live Preview"}
          </Button>

          {/* Share Link Button */}
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleShare}
          >
            {copied ? (
              <Check size={18} className="text-green-600 mr-2" />
            ) : (
              <Share2 size={18} className="mr-2" />
            )}
            {copied ? "Copied!" : "Share Link"}
          </Button>
        </div>
      </header>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex flex-1 p-6 gap-6 overflow-hidden">
        {/* Left Sidebar - Field Controller (Edit Mode Only) */}
        {!isPreview && (
          <aside className="flex-[1.5] border bg-white p-6 h-full rounded-3xl shadow-sm">
            <h2 className="font-bold text-lg text-gray-800">Controller</h2>
            <p className="text-sm text-gray-500 mb-6">
              Modify fields then Save.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase">
                Status
              </p>
              {/* Status indicator showing edit mode is ready */}
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                <Check size={14} /> Ready to Edit
              </div>
            </div>
          </aside>
        )}

        {/* Main Form Display Area */}
        {/* Expands to full width in preview mode, shared with sidebar in edit mode */}
        <main
          className={`flex flex-col transition-all duration-500 border bg-white rounded-3xl p-12 overflow-y-auto shadow-sm ${
            isPreview ? "flex-[10] max-w-4xl mx-auto" : "flex-[5]"
          }`}
        >
          <div className="max-w-2xl mx-auto w-full">
            {/* Form Title */}
            <h1 className="font-black text-gray-900 text-4xl text-center mb-2 tracking-tight">
              {ai.title}
            </h1>
            {/* Form Subheading */}
            <p className="text-gray-500 text-center mb-12">{ai.subheading}</p>

            {/* ===== FORM FIELDS ===== */}
            <form className="space-y-8" onSubmit={handleSubmitResponse}>
              {/* Render each field dynamically */}
              {fields.map((field, index) => {
                // Extract field properties with fallbacks for different naming conventions
                const fLabel =
                  field.label ||
                  field.formLabel ||
                  field.form_label ||
                  `Field ${index + 1}`;
                const fType = field.fieldType || field.field_type || "text";
                const fPlaceholder =
                  field.placeholder ||
                  field.placeholderName ||
                  field.placeholder_name ||
                  "";

                return (
                  <div
                    key={index}
                    className="flex items-end gap-4 w-full group relative"
                  >
                    <div className="flex-1">
                      {/* Field Label */}
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">
                        {fLabel}
                      </label>

                      {/* Render textarea for long-form fields */}
                      {fType === "textarea" ? (
                        <textarea
                          placeholder={fPlaceholder}
                          value={formValues[fLabel] || ""}
                          onChange={(e) =>
                            handleInputChange(fLabel, e.target.value)
                          }
                          className={`w-full border border-gray-200 p-3.5 rounded-2xl transition-all shadow-sm outline-none ${
                            isPreview
                              ? "bg-white focus:ring-2 focus:ring-green-500"
                              : "bg-gray-50 cursor-not-allowed opacity-80"
                          }`}
                          rows={field.rows || 4}
                          disabled={!isPreview}
                        />
                      ) : (
                        /* Render input field for single-line fields */
                        <input
                          type={fType}
                          placeholder={fPlaceholder}
                          value={formValues[fLabel] || ""}
                          onChange={(e) =>
                            handleInputChange(fLabel, e.target.value)
                          }
                          className={`w-full border border-gray-200 p-3.5 rounded-2xl transition-all shadow-sm outline-none ${
                            isPreview
                              ? "bg-white focus:ring-2 focus:ring-green-500"
                              : "bg-gray-50 cursor-not-allowed opacity-80"
                          }`}
                          disabled={!isPreview}
                          required={isPreview && field.required}
                        />
                      )}
                    </div>

                    {/* ===== FIELD ACTION BUTTONS (Edit Mode Only) ===== */}
                    {!isPreview && (
                      <div className="flex gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border p-1 rounded-full shadow-sm">
                        {/* Edit Field Button */}
                        <EditFieldController
                          field={field}
                          onUpdate={(data) => handleFinalUpdate(index, data)}
                        />
                        {/* Delete Field Button */}
                        <button
                          onClick={() => deleteField(index)}
                          type="button"
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ===== SUBMIT BUTTON ===== */}
              {/* Only shown in preview mode when form has fields */}
              {isPreview && fields.length > 0 && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 h-14 rounded-2xl text-lg font-bold shadow-lg mt-4 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Formpage;
