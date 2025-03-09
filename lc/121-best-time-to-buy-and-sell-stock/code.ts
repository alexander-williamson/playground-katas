function maxProfit(prices: number[]): number {
  let maxProfit = 0;
  let minPrice = Infinity;
  let highest = prices[0];

  for (let i = 0; i < prices.length; i++) {
    let currProfit = prices[i] - minPrice; // massive
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    }
    if (currProfit > maxProfit) {
      maxProfit = currProfit;
    }
  }

  return maxProfit;
}
