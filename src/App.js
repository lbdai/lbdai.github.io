import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, List } from 'lucide-react';
import './App.css';
import './quiz-app.css';
import multiTestData from './data/data.json';


function App() {
  const [currentTestId, setCurrentTestId] = useState(multiTestData.tests[0].id);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTestSelectionOpen, setIsTestSelectionOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Get current test
  const currentTest = multiTestData.tests.find(test => test.id === currentTestId);
  const totalPages = Math.ceil(currentTest.questions.length / ITEMS_PER_PAGE);

  const handleTestChange = (testId) => {
    setCurrentTestId(testId);
    setCurrentPage(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setIsTestSelectionOpen(false);
  };

  const handleAnswerSelect = (questionId, answerId) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: answerId
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentPage(0);
  };

  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return currentTest.questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const calculateScore = () => {
    return currentTest.questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Test Selection Modal/Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
        ${isTestSelectionOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Select a Test</h2>
          {multiTestData.tests.map((test) => (
            <button
              key={test.id}
              onClick={() => handleTestChange(test.id)}
              className={`w-full text-left p-2 mb-2 rounded ${
                currentTestId === test.id 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {test.title}
            </button>
          ))}
          <button 
            onClick={() => setIsTestSelectionOpen(false)}
            className="w-full mt-4 p-2 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="relative">
        {/* Test Selection Toggle */}
        <button 
          onClick={() => setIsTestSelectionOpen(!isTestSelectionOpen)}
          className="absolute top-0 left-0 p-2 bg-gray-200 rounded"
        >
          <List size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center">
          {currentTest.title}
        </h1>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 mb-1">
          {getCurrentPageQuestions().map((question) => (
            <div 
              key={question.id} 
              className="border rounded-lg p-4 shadow-sm"
            >
              <p className="font-semibold mb-3">
                {question.text}
              </p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(question.id, option.id)}
                    className={`w-full text-left p-2 rounded ${
                      isSubmitted
                        ? option.id === question.correctAnswer
                          ? 'bg-green-100 border-green-300'
                          : selectedAnswers[question.id] === option.id
                            ? 'bg-red-100 border-red-300'
                            : 'bg-gray-100'
                        : selectedAnswers[question.id] === option.id
                          ? 'bg-blue-100 border-blue-300'
                          : 'hover:bg-gray-50'
                    } border transition-colors`}
                  >
                    {option.text}
                    {isSubmitted && (
                      option.id === question.correctAnswer 
                        ? <CheckCircle2 className="float-right text-green-500" size={20} />
                        : selectedAnswers[question.id] === option.id
                          ? <XCircle className="float-right text-red-500" size={20} />
                          : null
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="flex items-center p-2 bg-gray-200 rounded disabled:opacity-50"
          >
            <ChevronLeft /> Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center p-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next <ChevronRight />
          </button>
        </div>

        {/* Submit and Result Section */}
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              Your Score: {calculateScore()} / {currentTest.questions.length}
            </h2>
            <button 
              onClick={handleReset}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
