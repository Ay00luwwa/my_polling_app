"use client";

import React, { useState } from "react";
import axios from "axios";
import NavigateToQuestions from "../components/NavigateToQuestions";

const SurveyCreator = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    } else {
      setError("Maximum of 5 options allowed.");
    }
  };

  const handleInputChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setError("");
  };

  const saveSurvey = async () => {
    if (question.trim() && options.every((opt) => opt.trim())) {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          "https://surverpoll.pythonanywhere.com/api/questions/",
          {
            question_text: question,
            pub_date: new Date().toISOString(),
          }
        );
        const questionId = response.data.id;

        await Promise.all(
          options.map((opt) =>
            axios.post("https://surverpoll.pythonanywhere.com/api/choices/", {
              choice_text: opt,
              question: questionId,
            })
          )
        );

        setQuestion("");
        setOptions([""]);
      } catch (err) {
        console.error("Error creating survey:", err);
        setError("Failed to create survey. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Create a New Survey
        </h2>

        {error && (
          <p className="text-red-600 font-medium text-center mb-4">{error}</p>
        )}

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Enter your survey question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />

          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
            <button
              onClick={addOption}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
            >
              Add Option
            </button>

            <button
              onClick={saveSurvey}
              disabled={loading}
              className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                loading ? "cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Survey"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <NavigateToQuestions />
        </div>
      </div>
    </div>
  );
};

export default SurveyCreator;
