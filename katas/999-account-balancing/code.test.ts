type Account = { id: AccountId; balance: number };
type Transaction = { from: AccountId; to: AccountId; amount: number };
type AccountId = "A" | "B" | "C" | "D";

import currency from "currency.js";

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

  // get the target amount
  const target = calculateTargetBalance(workingAccounts);

  // for everything that is under, take it from over
  // while something is under, loop through the overs and decrements until complete
  // always take it from the most large number

  let under = workingAccounts
    .filter((x) => x.balance < target)
    .filter((x) => target - x.balance > 0.01);
  let over = workingAccounts
    .filter((x) => x.balance > target)
    .sort((a, b) => b.balance - a.balance); // largest at front

  console.debug({ under, over });

  let results: Transaction[] = [];

  while (under.length > 0 && over.length > 0) {
    let available = currency(over[0].balance).subtract(target);
    let desired = currency(target).subtract(under[0].balance);
    let transferAmount = Math.min(available.value, desired.value);

    results.push({
      amount: transferAmount,
      from: over[0].id,
      to: under[0].id,
    });

    over[0].balance = over[0].balance - transferAmount;
    under[0].balance = under[0].balance + transferAmount;

    under = workingAccounts
      .filter((x) => x.balance < target)
      .filter((x) => target - x.balance > 0.01);
    over = workingAccounts
      .filter((x) => x.balance > target)
      .sort((a, b) => b.balance - a.balance); // largest at front
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

it("calculates the correct transactionsfor a simple example", () => {
  const startingAccounts = calculateTotals(
    [
      { balance: 100, id: "A" },
      { balance: 50, id: "B" },
    ],
    []
  );
  const results = calculateBalancingTransactions(startingAccounts);

  expect(results).toEqual([{ amount: 25, from: "A", to: "B" }]);
});

it.only("calculates the correct transactionsfor a complex example", () => {
  const startingAccounts = calculateTotals(
    [
      { balance: 100, id: "A" },
      { balance: 99.98, id: "B" },
    ],
    []
  );
  const results = calculateBalancingTransactions(startingAccounts);

  expect(results).toEqual([{ amount: 0.01, from: "A", to: "B" }]);
});
