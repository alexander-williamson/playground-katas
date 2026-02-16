import { describe, expect, it } from "bun:test";

class DynamicArray<T = number> {
  protected capacity: number;
  protected arr: T[];
  protected itemCount: number;

  constructor() {
    this.capacity = 10;
    this.itemCount = 0;
    this.arr = new Array(this.capacity);
  }

  getItemCount() {
    return this.itemCount;
  }

  getCapacity() {
    return this.capacity;
  }

  get(index: number): T {
    if (index < 0 || index > this.capacity - 1) {
      throw new Error("Out of bounds");
    }
    return this.arr[index]!;
  }

  private resize(newCapacity: number): void {
    const newArr: T[] = new Array(newCapacity);
    for (let i = 0; i < newArr.length; i++) {
      newArr[i]! = this.arr[i]!;
    }
    this.arr = newArr!;
    this.capacity = newCapacity;
  }

  append(value: T): undefined {
    if (this.capacity === this.itemCount) {
      this.resize(this.capacity * 2);
    }
    this.arr[this.itemCount] = value;
    this.itemCount = this.itemCount + 1;
  }

  pop(): T {
    if (this.itemCount === 0) {
      throw new Error("Out of bounds");
    }
    if (this.itemCount == this.capacity * 0.25 && this.itemCount >= 10) {
      this.resize(this.capacity * 0.25);
    }
    const result = this.arr[this.itemCount - 1];
    this.itemCount--;
    return result!;
  }
}

describe("dynamic array", () => {
  describe("creating a new instance", () => {
    const sut = new DynamicArray();

    it("has correct sizes", () => {
      expect(sut.getItemCount()).toEqual(0);
      expect(sut.getCapacity()).toEqual(10);
    });

    it("returns undefined for properties initially", () => {
      expect(sut.get(0)).toBeUndefined();
      expect(sut.get(9)).toBeUndefined();
    });

    it("throws error if trying to fetch outside of the bounds", () => {
      expect(() => sut.get(-1)).toThrowError(/Out of bounds/);
      expect(() => sut.get(10)).toThrowError(/Out of bounds/);
    });
  });

  describe("pushing an object", () => {
    it("adds an item", () => {
      const sut = new DynamicArray();

      sut.append(1000);

      expect(sut.get(0)).toEqual(1000);
      expect(sut.getCapacity()).toEqual(10);
      expect(sut.getItemCount()).toEqual(1);
    });

    it("does not resize the array if we do not run out of space", () => {
      const sut = new DynamicArray();

      sut.append(1000);
      sut.append(2000);
      sut.append(3000);
      sut.append(4000);
      sut.append(5000);
      sut.append(6000);
      sut.append(7000);
      sut.append(8000);
      sut.append(9000);
      sut.append(10000);

      expect(sut.getItemCount()).toEqual(10);
      expect(sut.getCapacity()).toEqual(10);
    });

    it("resizes the array larger when we run out of space", () => {
      const sut = new DynamicArray();

      sut.append(1000);
      sut.append(2000);
      sut.append(3000);
      sut.append(4000);
      sut.append(5000);
      sut.append(6000);
      sut.append(7000);
      sut.append(8000);
      sut.append(9000);
      sut.append(10000);
      sut.append(11000);

      expect(sut.getItemCount()).toEqual(11);
      expect(sut.getCapacity()).toEqual(20);
    });
  });

  describe("removing an item", () => {
    it("throws an Out of bounds error if there are no items to return", () => {
      const sut = new DynamicArray();

      expect(() => sut.pop()).toThrow(/Out of bounds/);
    });

    it("removes an item", () => {
      const sut = new DynamicArray();

      sut.append(1000);
      sut.append(2000);

      expect(sut.pop()).toEqual(2000);
      expect(sut.getCapacity()).toEqual(10);
      expect(sut.getItemCount()).toEqual(1);
    });

    it.only("resizes a 40 at 10 items", () => {
      const sut = new DynamicArray();

      for (let i = 0; i < 40; i++) {
        sut.append(i * 1000);
      }

      for (let i = 0; i < 40; i++) {
        sut.pop();
      }

      expect(sut.getItemCount()).toEqual(0);
      expect(sut.getCapacity()).toEqual(10);
    });
  });
});
