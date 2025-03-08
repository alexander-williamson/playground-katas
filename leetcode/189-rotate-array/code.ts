function rotate(nums: number[], k: number): void {
    let a: number[] = [];
    for(let i = 0; i < nums.length; i++) {
        let newPos = (i + k) % nums.length;
        a[newPos] = nums[i];
    }
    for(let i = 0; i < nums.length; i++) {
        nums[i] = a[i]
    }
};

const nums = [99,-1,-100,3];
rotate(nums, 3);
console.debug(nums);