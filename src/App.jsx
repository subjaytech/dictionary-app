import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiMoon } from 'react-icons/fi';
import { BiBook } from 'react-icons/bi';
import { BsPlayFill } from 'react-icons/bs';

function App() {
  const [word, setWord] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [font, setFont] = useState('serif');
  const [isInputEmpty, setIsInputEmpty] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const fetchWord = async (searchWord) => {
    try {
      setError(null);
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`);
      setData(response.data[0]);
    } catch (err) {
      setError("No definitions found");
      setData(null);
    }
  };

  const handleSubmit = () => {
    if (word.trim() === '') {
      setIsInputEmpty(true);
      return;
    }
    setIsInputEmpty(false);
    fetchWord(word);
  };

  const playAudio = () => {
    if (data?.phonetics) {
      const audioObj = data.phonetics.find(p => p.audio && p.audio !== '');
      if (audioObj) {
        new Audio(audioObj.audio).play();
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  return (
    <div className={`min-h-screen transition-colors duration-300 font-${font} ${theme === 'dark' ? 'bg-app-black text-white' : 'bg-white text-gray-700'}`}>
      
      <div className="max-w-3xl mx-auto p-6">
        
        <header className="flex justify-between items-center mb-12">
          <BiBook className="text-4xl text-gray-500" />
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className={`appearance-none bg-transparent font-bold cursor-pointer outline-none pr-6 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Mono</option>
              </select>
            </div>

            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-app-purple' : 'bg-gray-400'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
              <FiMoon className={`text-xl ${theme === 'dark' ? 'text-app-purple' : 'text-gray-500'}`} />
            </div>
          </div>
        </header>

        <div className="relative mb-8">
          <input 
            type="text" 
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
              setIsInputEmpty(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Search for any word..."
            className={`w-full py-4 px-6 rounded-2xl font-bold outline-none border hover:border-app-purple focus:border-app-purple transition-colors 
              ${theme === 'dark' ? 'bg-app-dark-bg text-white' : 'bg-gray-100 text-gray-800'}
              ${isInputEmpty ? 'border-red-500' : 'border-transparent'}
            `}
          />
          <FiSearch 
            onClick={handleSubmit}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-app-purple text-xl cursor-pointer" 
          />
        </div>
        
        {isInputEmpty && (
          <p className="text-red-500 -mt-6 mb-6">Whoops, can’t be empty…</p>
        )}

        {data ? (
          <main>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-2">{data.word}</h1>
                <p className="text-xl md:text-2xl text-app-purple font-medium">{data.phonetic}</p>
              </div>
              
              <button 
                onClick={playAudio}
                className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-app-purple/20 flex items-center justify-center hover:bg-app-purple transition-all group"
              >
                <BsPlayFill className="text-3xl md:text-5xl text-app-purple group-hover:text-white pl-1" />
              </button>
            </div>

            {data.meanings.map((meaning, index) => (
              <section key={index} className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold italic font-serif">{meaning.partOfSpeech}</h2>
                  <div className="h-px bg-gray-200 w-full opacity-50"></div>
                </div>

                <p className="text-gray-500 mb-4 text-lg">Meaning</p>
                <ul className="list-disc marker:text-app-purple pl-5 space-y-3 mb-6">
                  {meaning.definitions.map((def, idx) => (
                    <li key={idx}>
                      <span className="block">{def.definition}</span>
                      {def.example && (
                        <span className="text-gray-500 mt-2 block">"{def.example}"</span>
                      )}
                    </li>
                  ))}
                </ul>

                {meaning.synonyms.length > 0 && (
                  <div className="flex gap-4">
                    <h3 className="text-gray-500">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {meaning.synonyms.map((syn, i) => (
                        <span 
                          key={i} 
                          className="text-app-purple font-bold hover:underline cursor-pointer"
                          onClick={() => { setWord(syn); fetchWord(syn); }}
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}

            <div className="h-px bg-gray-200 w-full opacity-50 my-8"></div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-gray-500">
              <p>Source</p>
              <a href={data.sourceUrls[0]} target="_blank" rel="noreferrer" className="underline hover:text-app-purple break-all">
                {data.sourceUrls[0]}
              </a>
            </div>
          </main>
        ) : (
          !error ? null : (
            <div className="text-center mt-20">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="font-bold text-xl mb-4">No Definitions Found</h3>
              <p className="text-gray-500">Sorry, we couldn't find definitions for the word you were looking for.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;