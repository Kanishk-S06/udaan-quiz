'use client'
import { SetStateAction, useState } from 'react';

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [generatedQuiz, setGeneratedQuiz] = useState('');
  const [showAnswers, setShowAnswers] = useState(false); // Control for showing answers

  const handleTopicChange = (event: { target: { value: SetStateAction<string> }; }) => {
    setTopic(event.target.value);
  };

  const handleNumQuestionsChange = (event: { target: { value: string }; }) => {
    setNumQuestions(parseInt(event.target.value)); 
  };

  const handleSubmit = async () => {
    const request = {
      topic,
      numQuestions,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data = await response.text();
        setGeneratedQuiz(data); 
        setShowAnswers(false); 
      } else {
        console.error('Error generating quiz:', response.statusText);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers); // Toggle answer visibility
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">UDAAN Quiz Generator</h1>

      <label htmlFor="topic" className="block text-lg mb-2">Quiz Topic:</label>
      <input
        id="topic"
        type="text"
        placeholder="Enter Quiz Topic"
        value={topic}
        onChange={handleTopicChange}
        className="w-full px-3 py-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
      />

      <label htmlFor="numQuestions" className="block text-lg mb-2">Number of Questions:</label>
      <input
        id="numQuestions"
        type="number"
        placeholder="Number of Questions"
        value={numQuestions}
        onChange={handleNumQuestionsChange}
        className="w-full px-3 py-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-black transition mb-4"
      >
        Generate Quiz
      </button>

      <button
        onClick={toggleShowAnswers}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-black transition"
      >
        {showAnswers ? 'Hide Answers' : 'Show Answers'}
      </button>

      <div className="mt-6 bg-white p-4 rounded-lg">
        <pre className="whitespace-pre-wrap">
          {showAnswers ? generatedQuiz : generatedQuiz.replace(/Answer Key:([\s\S]*)/g, '')} {/* Hide answers */}
        </pre>
      </div>
    </div>
  );
}
