describe('たし算', () => {
  it('1たす3は4です', () => {
    const result = 1 + 3;
    expect(result).toBe(4);
  });
});

describe('たし算', () => {
  describe('変数を使います', () => {
    let beforeAllSumResult = 100;
    let beforeEachSumResult = 100;

    // このテストファイルのすべてのテストが実行される前1回だけ実行される
    beforeAll(() => {
      beforeAllSumResult = beforeAllSumResult + 33;
    });

    // このテストファイルのすべてのテストが実行された後1回だけ実行される
    afterAll(() => {
      beforeAllSumResult = 100;
    });

    // このテストファイルにあるテスト(it)が実行される前に毎回実行される
    beforeEach(() => {
      beforeEachSumResult = beforeEachSumResult + 33;
    });

    // このテストファイルにあるテスト(it)が実行された後に毎回実行される
    afterEach(() => {
      beforeEachSumResult = beforeEachSumResult - 33;
    });

    it('100に33をたすと133です', () => {
      expect(beforeAllSumResult).toBe(133);
    });

    it('100に33をたすと133です', () => {
      expect(beforeEachSumResult).toBe(133);
    });
  });
});
