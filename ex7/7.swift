func isGoal(_ acc: Int, _ rest: ArraySlice<Int>, _ goal: Int) -> Bool {
  if (rest.count == 0) {
    return acc == goal
  }
  return isGoal(acc + rest.first!, rest.dropFirst(), goal) || isGoal(acc * rest.first!, rest.dropFirst(), goal)
}

var matchedTotal = 0

while let line = readLine() {
  let splitLine = line.split(separator: ":")
  let goal = Int(splitLine[0])!
  let numbers = splitLine[1].split(separator: " ").map({ Int($0)! })
  if isGoal(numbers[0], numbers.dropFirst(), goal) {
    matchedTotal += goal
  }
}

print(matchedTotal)