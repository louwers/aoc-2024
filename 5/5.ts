import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin
});

let readingRules = true;

const rules: Record<string, Set<string>> = {};
const orders: string[][] = [];

function processLine(line: string) {
  const split = readingRules ? line.split("|") : line.split(",");

  if (split.length === 1 && readingRules) {
    readingRules = false;
    return;
  }

  if (readingRules) {
    if (!rules[split[1]]) rules[split[1]] = new Set();
    rules[split[1]].add(split[0]);
    return;
  }
  
  orders.push(split);
}

rl.on("line", processLine);

function hasCorrectOrder(order: string[]) {
  const seen = new Set();
  const all = new Set([...order]);
  for (const num of order) {
    seen.add(num);
    for (const mustAppearBefore of rules[num] || []) {
      if (!all.has(mustAppearBefore)) continue;
      if (!seen.has(mustAppearBefore)) return false;
    } 
  }
  return true;
}

rl.on("close", () => {
  let total = 0;
  for (const order of orders) {
    if (hasCorrectOrder(order)) {
      total += Number.parseInt(order[(order.length  - 1) / 2]);
    }
  }
  console.log(total);
});