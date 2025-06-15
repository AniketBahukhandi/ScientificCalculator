"use client";
import React, { useState, useEffect } from "react";
import "./calculator.css";
import { evaluate } from "mathjs";

const buttons = [
  ["Rad", "Deg", "x!", "(", ")", "%", "CE"],
  ["Inv", "sin", "ln", "7", "8", "9", "/"],
  ["π", "cos", "log", "4", "5", "6", "*"],
  ["e", "tan", "√", "1", "2", "3", "-"],
  ["AC", "EXP", "xʸ", "0", ".", "+", "="]
];

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("calc_history")) || [];
    setHistory(savedHistory);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      const keyMap = {
        Enter: "=",
        Backspace: "CE",
        Delete: "AC",
        "^": "xʸ"
      };

      const operators = ["+", "-", "*", "/", "%", ".", "(", ")"];
      const numbers = Array.from({ length: 10 }, (_, i) => String(i));
      const functions = ["sin", "cos", "tan", "log", "ln", "EXP"];

      if (numbers.includes(key) || operators.includes(key)) {
        handleClick(key);
      } else if (key in keyMap) {
        handleClick(keyMap[key]);
      } else if (functions.includes(key)) {
        handleClick(key);
      } else if (key.toLowerCase() === "e") {
        handleClick("e");
      } else if (key.toLowerCase() === "p") {
        handleClick("π");
      } else if (key === "!") {
        handleClick("x!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, history]);

  const updateHistory = (newEntry) => {
    const updated = [newEntry, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem("calc_history", JSON.stringify(updated));
  };

  const handleClick = (val) => {
    try {
      switch (val) {
        case "AC":
          setExpression("");
          break;
        case "CE":
          setExpression((prev) => prev.slice(0, -1));
          break;
        case "=":
          let expr = expression
            .replace(/π/g, "pi")
            .replace(/√/g, "sqrt")
            .replace(/xʸ/g, "^")
            .replace(/EXP/g, "e");
          let result = evaluate(expr);
          updateHistory(`${expression} = ${result}`);
          setExpression(String(result));
          break;
        case "sin":
        case "cos":
        case "tan":
        case "log":
        case "ln":
        case "sqrt":
          setExpression((prev) => `${val}(${prev})`);
          break;
        case "x!":
          let fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
          setExpression((prev) => {
            let result = fact(Number(prev));
            updateHistory(`${prev}! = ${result}`);
            return String(result);
          });
          break;
        default:
          setExpression((prev) => prev + val);
      }
    } catch (error) {
      setExpression("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="display">{expression || 0}</div>
      <div className="button-grid">
        {buttons.flat().map((btn, idx) => (
          <button key={idx} onClick={() => handleClick(btn)}>
            {btn}
          </button>
        ))}
      </div>
      <div className="history">
        <h4>History</h4>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
