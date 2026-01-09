"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateForm from "../_component/CreateForm";
import { supabase } from "../lib/supabase";
import { FileText, Loader2, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFormList();
  }, []);

  const getFormList = async () => {
    setLoading(true);
    // Fetching from the main builder table to get titles/subtitles
    const { data, error } = await supabase
      .from("Ai Form Builder")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching forms:", error);
    } else {
      setFormList(data);
      console.log("Fetched forms:", data);
    }
    setLoading(false);
  };

  const parseAiResponse = (rawResponse) => {
    if (!rawResponse)
      return { form_title: "Untitled", form_subheading: "No description" };

    let parsed = rawResponse;

    // 1. If it's a string (common with Supabase JSONB or text columns), parse it
    if (typeof rawResponse === "string") {
      try {
        const cleanString = rawResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsed = JSON.parse(cleanString);
      } catch (e) {
        console.error("Parsing Error", e);
        return {
          form_title: "Error Parsing",
          form_subheading: "Malformed data",
        };
      }
    }

    // 2. Extract values using BOTH naming conventions
    return {
      form_title: parsed.formTitle || parsed.form_title || "Untitled Form",
      form_subheading:
        parsed.formSubheading ||
        parsed.form_subheading ||
        "No description provided.",
    };
  };

  const deleteForm = async (id) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    const { error } = await supabase
      .from("Ai Form Builder")
      .delete()
      .eq("id", id);
    if (!error) getFormList();
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50/50">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Forms</h1>
          <p className="text-gray-500 text-sm">
            View and manage your AI-generated forms
          </p>
        </div>
        <CreateForm onFormCreated={getFormList} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      ) : formList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {formList.map((form) => {
            // Get the title and subtitle from the AI Response column
            const aiData = parseAiResponse(form["AI response"]);

            return (
              <div
                key={form.id}
                className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* TITLE */}
                  <h2 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1">
                    {aiData?.form_title}
                  </h2>

                  {/* SUBTITLE */}
                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                    {aiData?.form_subheading}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    ID: {form.id}
                  </span>

                  <Link href={`/editform/${form.id}`}>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full h-9 text-xs font-bold px-4"
                    >
                      Edit Form <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400 italic">
            No forms found. Create your first one!
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
