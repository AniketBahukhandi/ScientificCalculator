"use client";
import React, { useState, useEffect } from "react";
import "./calculator.css";
import { evaluate } from "mathjs";

const buttons = [
  ["Rad", "Deg", "x!", "(", ")", "%", "CE"],
  ["Inv", "sin", "ln", "7", "8", "9", "/"],
  ["π", "cos", "log", "4", "5", "6", "*"],
  ["e", "tan", "√", "1", "2", "3", "-"],
  ["AC", "EXP", "xʸ", "0", ".", "+", "="],
];

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("calc_history")) || [];
    setHistory(savedHistory);
  }, []);

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
        case "=": {
          let expr = expression
            .replace(/π/g, "pi")
            .replace(/xʸ/g, "^")
            .replace(/EXP/g, "e")
            .replace(/√\(([^()]+)\)/g, "sqrt($1)")
            .replace(/√([0-9.]+)/g, "sqrt($1)")
            // Insert () after functions if not already present
            .replace(/(sin|cos|tan|log|ln|sqrt)(\d+(\.\d+)?)/g, "$1($2)");

          let result = evaluate(expr);
          updateHistory(`${expression} = ${result}`);
          setExpression(String(result));
          break;
        }
        case "sin":
        case "cos":
        case "tan":
        case "log":
        case "ln":
        case "sqrt":
          setExpression((prev) => (prev ? prev + val : val));
          break;
        case "x!": {
          const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
          setExpression((prev) => {
            let result = fact(Number(prev));
            updateHistory(`${prev}! = ${result}`);
            return String(result);
          });
          break;
        }
        default:
          setExpression((prev) => prev + val);
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setExpression("Error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if ((key >= "0" && key <= "9") || "+-*/().".includes(key)) {
        setExpression((prev) => prev + key);
      } else if (key === "Enter") {
        e.preventDefault();
        handleClick("=");
      } else if (key === "Backspace") {
        handleClick("CE");
      } else if (key.toLowerCase() === "c") {
        handleClick("AC");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression]);

  return (
    <div className="calculator-container">
      <div className="calculator">
      <div className="header">Scientific Calculator</div>
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
    </div>
  );
};

export default Calculator;
