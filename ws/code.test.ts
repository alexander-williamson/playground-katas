type Account = { id: AccountId; balance: number };
type Transaction = { from: AccountId; to: AccountId; amount: number };
type AccountId = "A" | "B" | "C" | "D";

const accounts: Account[] = [
  { id: "A", balance: 1200 },
  { id: "B", balance: 500 },
  { id: "C", balance: 1800 },
  { id: "D", balance: 700 },
];

const transactions: Transaction[] = [
  { from: "C", to: "B", amount: 300 }, //
  { from: "A", to: "D", amount: 200 }, // 1000
  { from: "C", to: "A", amount: 400 }, // 1400
  { from: "D", to: "B", amount: 150 }, //
  { from: "A", to: "C", amount: 250 }, // 1350
  { from: "C", to: "D", amount: 100 }, //
  { from: "B", to: "A", amount: 50 }, // 1400
  { from: "A", to: "B", amount: 150 }, // 1050
  { from: "D", to: "C", amount: 100 }, //
  { from: "B", to: "D", amount: 250 }, //
];

function deepCopy<T>(input: T[]): T[] {
  return input.map((acc) => ({ ...acc }));
}

function calculateTotals(
  accounts: Account[],
  transactions: Transaction[]
): Account[] {
  const results = deepCopy(accounts);
  for (const transaction of transactions) {
    const from = results.find((a) => a.id === transaction.from) as Account;
    const to = results.find((a) => a.id === transaction.to) as Account;
    if (!from || !to) throw Error("Could not find account");
    from.balance = from.balance - transaction.amount;
    to.balance = to.balance + transaction.amount;
  }
  return results;
}

function calculateTargetBalance(accounts: Account[]): number {
  return accounts.reduce((cur, ele) => cur + ele.balance, 0) / accounts.length;
}

function calculateBalancingTransactions(input: Account[]): Transaction[] {
  const workingAccounts = deepCopy(input);
  const results: Transaction[] = [];

  // find the target amount
  const target = calculateTargetBalance(input);

  // find the remainers
  let over = workingAccounts
    .filter((x) => x.balance > target)
    .sort((a, b) => b.balance - a.balance);
  let under = workingAccounts
    .filter((x) => x.balance < target)
    .sort((a, b) => b.balance - a.balance);

  // move the accounts
  while (under.length > 0) {
    const needed = target - under[0].balance; // 100
    const available = over[0].balance - target; // 200

    const transferAmount = Math.min(needed, available);
    results.push({ from: over[0].id, to: under[0].id, amount: transferAmount });
    over[0].balance = over[0].balance - transferAmount;
    under[0].balance = under[0].balance + transferAmount;

    // refresh the remainers
    over = workingAccounts
      .filter((x) => x.balance > target)
      .sort((a, b) => b.balance - a.balance);
    under = workingAccounts.filter((x) => x.balance < target);
  }

  return results;
}

it("calculates the correct totals", () => {
  const result = calculateTotals(accounts, transactions);

  expect(result).toEqual([
    { balance: 1050, id: "A" }, // do nothing
    { balance: 800, id: "B" }, // needs 250
    { balance: 1350, id: "C" }, // give 250, then 50
    { balance: 1000, id: "D" }, // needs 50
  ]);
});

it("calculates balance", () => {
  const result = calculateTargetBalance(
    calculateTotals(accounts, transactions)
  );

  expect(result).toEqual(1050);
});

it("calculates the correct transactions", () => {
  const startingAccounts = calculateTotals(accounts, transactions);
  const results = calculateBalancingTransactions(startingAccounts);

  expect(results).toEqual([
    {
      amount: 50,
      from: "C",
      to: "D",
    },
    {
      amount: 250,
      from: "C",
      to: "B",
    },
  ]);
});
