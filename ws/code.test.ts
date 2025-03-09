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
  { from: "A", to: "D", amount: 200 }, // 900
  { from: "C", to: "A", amount: 400 }, //
  { from: "D", to: "B", amount: 150 }, // 750
  { from: "A", to: "C", amount: 250 }, //
  { from: "C", to: "D", amount: 100 }, // 850
  { from: "B", to: "A", amount: 50 },
  { from: "A", to: "B", amount: 150 },
  { from: "D", to: "C", amount: 100 }, // 750
  { from: "B", to: "D", amount: 250 }, // 1000
];

function getTotals(acc: Account[], tra: Transaction[]): Account[] {
  const results = acc.map((acc) => ({ ...acc })); // Deep copy
  for (const transaction of tra) {
    const from = results.find((x) => x.id === transaction.from) as Account;
    const to = results.find((x) => x.id === transaction.to) as Account;
    from.balance = from.balance - transaction.amount;
    to.balance = to.balance + transaction.amount;
  }
  return results;
}

function rebalance(input: Account[]): Transaction[] {
  // get the target amount
  // for each account
  // if the account is already balanced then skip

  // find the accounts over
  // find the accounts under

  const workingAccounts = input.map((acc) => ({ ...acc })); // Deep copy
  const results: Transaction[] = [];
  const target =
    workingAccounts.reduce((acc, curr) => acc + curr.balance, 0) / input.length;

  console.debug({ target });

  let under = workingAccounts.filter((x) => x.balance < target);
  let over = workingAccounts
    .filter((x) => x.balance > target)
    .sort((a, b) => b.balance - a.balance); // sort by highest first

  while (under.length > 0 && over.length > 0) {
    const u = under[0];
    const o = over[0];

    const amountUnder = target - u.balance;
    const amountOver = o.balance - target;

    const transferAmount = Math.min(amountUnder, amountOver);
    results.push({
      amount: transferAmount,
      from: o.id,
      to: u.id,
    });

    // apply
    o.balance = o.balance - transferAmount;
    u.balance = u.balance + transferAmount;

    // filter
    under = workingAccounts.filter((x) => x.balance < target);
    over = workingAccounts
      .filter((x) => x.balance > target)
      .sort((a, b) => b.balance - a.balance); // sort by highest first
  }

  return results;
}

it("returns the correct value for A", () => {
  const results = getTotals(accounts, transactions);

  expect(results).toEqual<Account[]>([
    { balance: 1050, id: "A" }, // do nothing
    { balance: 800, id: "B" }, // add 250
    { balance: 1350, id: "C" }, // take 300
    { balance: 1000, id: "D" }, // add 50
  ]);
});

it("sorts correctly", () => {
  const balancingTransactions = rebalance(getTotals(accounts, transactions));

  expect(balancingTransactions).toEqual([
    {
      amount: 250,
      from: "C",
      to: "B",
    },
    {
      amount: 50,
      from: "C",
      to: "D",
    },
  ]);

  const results = getTotals(accounts, [
    ...transactions,
    ...balancingTransactions,
  ]);

  expect(results).toEqual([
    { balance: 1050, id: "A" },
    { balance: 1050, id: "B" },
    { balance: 1050, id: "C" },
    { balance: 1050, id: "D" },
  ]);
});
