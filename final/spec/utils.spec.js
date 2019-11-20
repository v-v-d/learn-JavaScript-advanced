const sum = function (a, b) {
  return +a + +b;
};

describe('Module: sum', () => {
  it('should sum(5, 3) be equal to 8', () => {
    expect(sum(5, 3)).toBe(8);
  });

  it('should sum("5", 3) be equal to 8', () => {
    expect(sum("5", 3)).toBe(8);
  });
});