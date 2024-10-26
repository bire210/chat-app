import  { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useDropzone } from 'react-dropzone';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';

const CustomInput = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleEmojiClick = (event, emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ text, file });
    setText('');
    setFile(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="flex items-center w-full border border-gray-300 rounded-full p-2 shadow-sm">
        <button
          type="button"
          className="text-2xl text-gray-500 hover:text-gray-700 mx-2"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border-none outline-none p-2 text-lg"
        />
        <div {...getRootProps()} className="text-2xl text-gray-500 hover:text-gray-700 mx-2 cursor-pointer">
          <input {...getInputProps()} />
          <FaPaperclip />
        </div>
        <button type="submit" className="text-2xl text-blue-500 hover:text-blue-700 mx-2">
          <FaPaperPlane />
        </button>
      </form>
      {file && <p className="mt-2 text-sm text-gray-700">Selected file: {file.name}</p>}
    </div>
  );
};

export default CustomInput;
