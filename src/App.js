import { useRef, useState } from "react";
import "./styles.css";

const URL = "https://dummyjson.com/products/search";

export default function App() {
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState("");
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const timerId = useRef();

  const handleClick = (e) => {
    setSuggestions([]);
    setValue(e.target.innerText);
    setSuggestionsActive(false);
  };

  const handleChange = (e) => {
    const searchText = e.target.value.trim();
    setValue(searchText);
    if (searchText === "") {
      setSuggestionsActive(false);
      return;
    } else {
      getSuggestionsDebounced(searchText);
    }
  };

  function debounce(fn, delay) {
    return (...args) => {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  const fetchData = async (searchText) => {
    const url = `${URL}?q=${searchText}`;
    const res = await fetch(url);
    const result = await res.json();
    setSuggestions(result.products);
    setSuggestionsActive(true);
  };

  const getSuggestionsDebounced = debounce(fetchData, 500);

  const Suggestions = () => {
    return (
      <ul className="suggestion-list">
        {suggestions.map((suggestion) => {
          return (
            <li key={suggestion.id} onClick={handleClick}>
              {suggestion.title}
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <div className="wrapper">
      <input
        type="text"
        className="typeahead"
        placeholder="Search Products..."
        value={value}
        onChange={handleChange}
      />
      {suggestionsActive && <Suggestions />}
    </div>
  );
}
