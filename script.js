function calculate() {
    const input = document.getElementById('expression').value.trim();
    const output = document.getElementById('output');
    let steps = [];

    try {
        // Paso 1: Reemplazar true/false por 1/0
        let expr = input.replace(/true/g, '1').replace(/false/g, '0');

        // Paso 2: Evaluar paréntesis primero
        const parenRegex = /\(([^()]+)\)/;

        while (parenRegex.test(expr)) {
            expr = expr.replace(parenRegex, (_, innerExpr) => {
                const evaluated = evaluateLogical(innerExpr, steps);
                steps.push(`(${innerExpr}) → ${evaluated}`);
                return evaluated;
            });
        }

        // Paso 3: Evaluar lo que queda (sin paréntesis)
        const final = evaluateLogical(expr, steps);
        steps.push(`Resultado final: ${final === '1' ? 'true' : 'false'}`);
        output.innerHTML = steps.join('<br>');
    } catch (error) {
        output.innerText = "Error en la expresión";
    }
}

function evaluateLogical(expr, steps) {
    // Eliminar espacios
    expr = expr.replace(/\s+/g, '');

    // Operador NOT (!)
    const notRegex = /!([01])/;
    while (notRegex.test(expr)) {
        expr = expr.replace(notRegex, (_, a) => {
            const result = a === '1' ? '0' : '1';
            steps.push(`!${a} → ${result}`);
            return result;
        });
    }

    // Operador AND (&&)
    const andRegex = /([01])&&([01])/;
    while (andRegex.test(expr)) {
        expr = expr.replace(andRegex, (_, a, b) => {
            const result = (a === '1' && b === '1') ? '1' : '0';
            steps.push(`${a} && ${b} → ${result}`);
            return result;
        });
    }

    // Operador OR (||)
    const orRegex = /([01])\|\|([01])/;
    while (orRegex.test(expr)) {
        expr = expr.replace(orRegex, (_, a, b) => {
            const result = (a === '1' || b === '1') ? '1' : '0';
            steps.push(`${a} || ${b} → ${result}`);
            return result;
        });
    }

    return expr;
}
