import React from 'react';
import { languages } from '../constants.js';

const LanguageDropdown = ({ langSetter, verSetter , socket, lang, ver}) => {
  
  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    const selectedVersion = languages.find(lang => lang.name === selectedLanguage).version;
    langSetter(selectedLanguage);
    verSetter(selectedVersion);
    socket.emit("change-language", { language: selectedLanguage, version: selectedVersion });
  };

  return (
    <div>
      <select className='p-2 font-size' value={lang} onChange={handleChange}>
        {
          languages.map((lang) => (
            <option key={lang.name} value={lang.name} className='bg-blue-900'>
              {lang.name.toUpperCase()} <span className='font-'>{lang.version}</span>
            </option>
          ))
        }
      </select>
    </div>
  );
};

export default LanguageDropdown;
