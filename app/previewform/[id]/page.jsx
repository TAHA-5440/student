"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PreviewPage = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // 1. Get the data from localStorage
    const savedData = localStorage.getItem("formPreviewData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            {formData.title || "Untitled Form"}
          </h1>
          <p className="text-gray-500 text-lg">
            {formData.subheading || "Please complete the form below."}
          </p>
        </div>

        {/* Dynamic Form Fields */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {formData.fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                {field.form_label}
              </label>
              <input
                type={field.field_type}
                placeholder={field.placeholder_name}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all bg-gray-50/50"
                required
              />
            </div>
          ))}

          {/* Submit Action */}
          <div className="pt-6">
            <Button className="w-full h-14 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-lg font-bold shadow-lg shadow-green-200 transition-transform active:scale-[0.98]">
              Submit Response
            </Button>
          </div>
        </form>

        {/* Footer Credit */}
        <div className="mt-12 text-center border-t pt-6">
          <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
            Powered by FormAI
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
