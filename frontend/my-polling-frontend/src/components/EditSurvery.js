"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const EditSurvey = ({ surveyId }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/questions/${surveyId}/`)
      .then((response) => {
        setQuestion(response.data.question_text);
        return axios.get(
          `http://localhost:8000/api/choices/?question=${surveyId}`
        );
      })
      .then((response) => {
        setOptions(response.data.map((choice) => choice.choice_text));
      })
      .catch((err) => {
        setError("Failed to load survey data.");
        console.error(err);
      });
  }, [surveyId]);

  const saveSurvey = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.put(`http://localhost:8000/api/questions/${surveyId}/`, {
        question_text: question,
      });

      await Promise.all(
        options.map((choice, index) =>
          axios.put(`http://localhost:8000/api/choices/${index}/`, {
            choice_text: choice,
            question: surveyId,
          })
        )
      );

      router.push("/questions");
    } catch (err) {
      setError("Failed to save changes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Edit Survey</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Edit survey question"
        />

        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
            placeholder={`Edit option ${index + 1}`}
          />
        ))}

        <button
          onClick={saveSurvey}
          disabled={loading}
          className={`mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditSurvey;
