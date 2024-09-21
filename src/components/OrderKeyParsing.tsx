import React, { useState, useRef, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaHome, FaClipboardCheck } from 'react-icons/fa';

const OrderKeyParsing: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const outputRef = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<'order' | 'article' | 'or'>('order');

  const mergeStringsAndCopy = async () => {
    const cleanedString = inputText.trim();
    let finalString = '';

    if (selectedOption === 'order') {
      const characters = cleanedString.replace(/\s/g, '').split('');
      const uniqueGroups: string[] = [];
      let currentGroup = '';

      for (let i = 0; i < characters.length; i++) {
        currentGroup += characters[i];

        if (currentGroup.length === 7) {
          if (!uniqueGroups.includes(currentGroup)) {
            uniqueGroups.push(currentGroup);
          }
          currentGroup = '';
        }
      }

      finalString = '000' + uniqueGroups.join(';000');
    } else if (selectedOption === 'article') {
      const words = cleanedString.replace(/\s+/g, ' ').trim().split(' ');
      const uniqueWords = [...new Set(words)];
      finalString = uniqueWords.join(';');
    } else if (selectedOption === 'or') {
      const words = cleanedString.split(/\s+/);
      const uniqueWords = [...new Set(words)];
      finalString = '*' + uniqueWords.join('* or *') + '*';
    }

    setOutputText(finalString);

    try {
      await navigator.clipboard.writeText(finalString);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearFields = () => {
    setInputText('');
    setOutputText('');
  };

  const countSemicolons = () => {
    return outputText.length > 0 ? (outputText.match(/;/g) || []).length + 1 : 0;
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value as 'order' | 'article' | 'or');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded p-6 w-full max-w-md">
      
        <h3 className="text-2xl font-bold mb-6 text-center">Order-Key Parsing KLS</h3>

        <div className="mb-4">
          <label htmlFor="inputTextbox" className="block mb-2 text-gray-700">Enter Input Order:</label>
          <input
            type="text"
            id="inputTextbox"
            className="w-full p-2 border border-gray-300 rounded"
            value={inputText}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
            placeholder="Enter input order"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="outputTextbox" className="block mb-2 text-gray-700">Output:</label>
          <input
            type="text"
            id="outputTextbox"
            className="w-full p-2 border border-gray-300 rounded"
            value={outputText}
            readOnly
            ref={outputRef}
            placeholder="Output will appear here"
          />
        </div>

        <div className="flex justify-between mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center" onClick={mergeStringsAndCopy}>
            <FaClipboardCheck className="mr-2" /> Process Copy
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center" onClick={clearFields}>
            <FaTimes className="mr-2" /> Clear Input
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">
            Number of order: <span className="font-bold">{countSemicolons()}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Choose an option:</label>
          <div className="flex">
            <label htmlFor="orderOption" className="mr-4">
              <input
                type="radio"
                id="orderOption"
                name="option"
                value="order"
                checked={selectedOption === 'order'}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Order
            </label>
            <label htmlFor="articleOption" className="mr-4">
              <input
                type="radio"
                id="articleOption"
                name="option"
                value="article"
                checked={selectedOption === 'article'}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Article
            </label>
            <label htmlFor="orOption" className="mr-4">
              <input
                type="radio"
                id="orOption"
                name="option"
                value="or"
                checked={selectedOption === 'or'}
                onChange={handleOptionChange}
                className="mr-2"
              />
              Or Mode
            </label>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Budi Ariyanto - E00904 - PT. Kawan Lama Sejahtera
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderKeyParsing;
