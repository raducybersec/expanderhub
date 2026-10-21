export function solveMathFromText(text: string): number {
  // Find a run of numbers, operators, parentheses, decimal points, and spaces.
  const candidates = text.match(/[0-9+\-*/().\s]+/g) ?? [];

  for (const candidate of candidates) {
    const expression = candidate.trim();

    // Skip fragments that don't contain an operator.
    if (!/[+\-*/]/.test(expression)) continue;

    try {
      const tokens = expression.match(/\d+(?:\.\d+)?|[()+\-*/]/g);
      if (!tokens || tokens.join("") !== expression.replace(/\s+/g, "")) continue;

      let position = 0;

      function parseExpression(): number {
        let value = parseTerm();

        while (tokens![position] === "+" || tokens![position] === "-") {
          const operator = tokens![position++];
          const right = parseTerm();
          value = operator === "+" ? value + right : value - right;
        }

        return value;
      }

      function parseTerm(): number {
        let value = parseFactor();

        while (tokens![position] === "*" || tokens![position] === "/") {
          const operator = tokens![position++];
          const right = parseFactor();

          if (operator === "/" && right === 0) {
            throw new Error("Division by zero");
          }

          value = operator === "*" ? value * right : value / right;
        }

        return value;
      }

      function parseFactor(): number {
        const token = tokens![position++];

        if (token === "+" || token === "-") {
          const value = parseFactor();
          return token === "-" ? -value : value;
        }

        if (token === "(") {
          const value = parseExpression();
          if (tokens![position++] !== ")") throw new Error("Missing closing parenthesis");
          return value;
        }

        const value = Number(token);
        if (!Number.isFinite(value)) throw new Error("Invalid number");
        return value;
      }

      const result = parseExpression();
      if (position === tokens.length) return result;
    } catch {
      // Try the next candidate if this one isn't a valid expression.
    }
  }

  throw new Error("No valid math expression found");
}


