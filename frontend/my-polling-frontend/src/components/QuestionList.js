"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/questions/");
        setQuestions(response.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Survey Questions</h2>
        {questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions available yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((question) => (
              <li key={question.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{question.question_text}</h3>
                <p className="text-sm text-gray-500">
                  Published on: {new Date(question.pub_date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
