import { describe, expect, it } from "vitest";
import {
  formatMarketCap,
  formatNotional,
  formatPrice,
  formatQuantity,
  formatTime,
  formatTotal,
} from "./formattingUtils";

describe("formatQuantity", () => {
  it("should format number to 4 decimal places", () => {
    expect(formatQuantity(1.23456789)).toBe("1.2346");
    expect(formatQuantity(0.123456)).toBe("0.1235");
    expect(formatQuantity(100)).toBe("100.0000");
  });

  it("should handle zero", () => {
    expect(formatQuantity(0)).toBe("0.0000");
  });

  it("should handle very small numbers", () => {
    expect(formatQuantity(0.00001)).toBe("0.0000");
    expect(formatQuantity(0.00009)).toBe("0.0001");
  });

  it("should handle very large numbers", () => {
    expect(formatQuantity(1000000.123456)).toBe("1000000.1235");
  });

  it("should handle negative numbers", () => {
    expect(formatQuantity(-5.6789)).toBe("-5.6789");
  });
});

describe("formatTotal", () => {
  it("should format number to 2 decimal places", () => {
    expect(formatTotal(1.23456)).toBe("1.23");
    expect(formatTotal(0.999)).toBe("1.00");
    expect(formatTotal(100)).toBe("100.00");
  });

  it("should handle zero", () => {
    expect(formatTotal(0)).toBe("0.00");
  });

  it("should handle very small numbers", () => {
    expect(formatTotal(0.001)).toBe("0.00");
    expect(formatTotal(0.005)).toBe("0.01");
  });

  it("should handle very large numbers", () => {
    expect(formatTotal(1000000.999)).toBe("1000001.00");
  });

  it("should handle negative numbers", () => {
    expect(formatTotal(-99.999)).toBe("-100.00");
  });
});

describe("formatPrice", () => {
  describe("prices less than 1", () => {
    it("should format to 4 decimal places", () => {
      expect(formatPrice(0.5)).toBe("0.5000");
      expect(formatPrice(0.12345)).toBe("0.1235");
      expect(formatPrice(0.9999)).toBe("0.9999");
    });

    it("should handle very small prices", () => {
      expect(formatPrice(0.0001)).toBe("0.0001");
      expect(formatPrice(0.00001)).toBe("0.0000");
    });
  });

  describe("prices between 1 and 100", () => {
    it("should format to 2 decimal places", () => {
      expect(formatPrice(1)).toBe("1.00");
      expect(formatPrice(1.5)).toBe("1.50");
      expect(formatPrice(50.12345)).toBe("50.12");
      expect(formatPrice(99.999)).toBe("100.00");
    });
  });

  describe("prices 100 and above", () => {
    it("should format with comma separators and 2 decimal places", () => {
      expect(formatPrice(100)).toBe("100.00");
      expect(formatPrice(1000)).toBe("1,000.00");
      expect(formatPrice(1234.5678)).toBe("1,234.57");
      expect(formatPrice(1000000)).toBe("1,000,000.00");
    });

    it("should handle large prices", () => {
      expect(formatPrice(50000.123)).toBe("50,000.12");
      expect(formatPrice(999999.99)).toBe("999,999.99");
    });
  });

  it("should handle zero", () => {
    expect(formatPrice(0)).toBe("0.0000");
  });

  it("should handle negative prices", () => {
    expect(formatPrice(-5)).toBe("-5.0000");
    expect(formatPrice(-150)).toBe("-150.0000");
  });
});

describe("formatMarketCap", () => {
  describe("values in billions", () => {
    it("should format with B suffix", () => {
      expect(formatMarketCap(1000000000)).toBe("$1.00B");
      expect(formatMarketCap(1500000000)).toBe("$1.50B");
      expect(formatMarketCap(50000000000)).toBe("$50.00B");
      expect(formatMarketCap(1234567890)).toBe("$1.23B");
    });

    it("should handle very large values", () => {
      expect(formatMarketCap(999999999999)).toBe("$1000.00B");
    });
  });

  describe("values in millions", () => {
    it("should format with M suffix", () => {
      expect(formatMarketCap(1000000)).toBe("$1.00M");
      expect(formatMarketCap(5500000)).toBe("$5.50M");
      expect(formatMarketCap(999000000)).toBe("$999.00M");
      expect(formatMarketCap(123456789)).toBe("$123.46M");
    });

    it("should handle edge cases near boundaries", () => {
      expect(formatMarketCap(999999999)).toBe("$1000.00M");
      expect(formatMarketCap(1000000)).toBe("$1.00M");
    });
  });

  describe("values less than 1 million", () => {
    it("should format with comma separators", () => {
      expect(formatMarketCap(1000)).toBe("$1,000");
      expect(formatMarketCap(50000)).toBe("$50,000");
      expect(formatMarketCap(999999)).toBe("$999,999");
    });

    it("should handle small values", () => {
      expect(formatMarketCap(100)).toBe("$100");
      expect(formatMarketCap(1)).toBe("$1");
    });
  });

  it("should handle zero", () => {
    expect(formatMarketCap(0)).toBe("$0");
  });

  it("should handle negative values", () => {
    expect(formatMarketCap(-1000000)).toBe("$-1,000,000");
  });

  describe("boundary values", () => {
    it("should correctly handle billion threshold", () => {
      expect(formatMarketCap(999999999)).toBe("$1000.00M");
      expect(formatMarketCap(1000000000)).toBe("$1.00B");
      expect(formatMarketCap(1000000001)).toBe("$1.00B");
    });

    it("should correctly handle million threshold", () => {
      expect(formatMarketCap(999999)).toBe("$999,999");
      expect(formatMarketCap(1000000)).toBe("$1.00M");
      expect(formatMarketCap(1000001)).toBe("$1.00M");
    });
  });
});

describe("formatNotional", () => {
  it("should format to 2 decimal places by default", () => {
    expect(formatNotional(1234.5678)).toBe("1234.57");
    expect(formatNotional(100)).toBe("100.00");
    expect(formatNotional(0.999)).toBe("1.00");
  });

  it("should format with custom decimal places", () => {
    expect(formatNotional(1234.5678, 4)).toBe("1234.5678");
    expect(formatNotional(100, 0)).toBe("100");
    expect(formatNotional(5.6789, 3)).toBe("5.679");
  });

  it("should handle zero", () => {
    expect(formatNotional(0)).toBe("0.00");
    expect(formatNotional(0, 4)).toBe("0.0000");
  });

  it("should handle negative values", () => {
    expect(formatNotional(-1234.56)).toBe("-1234.56");
    expect(formatNotional(-99.999)).toBe("-100.00");
  });
});

describe("formatTime", () => {
  it("should format timestamp to HH:MM:SS format", () => {
    const timestamp = new Date("2024-01-01T14:30:45Z").getTime();
    const result = formatTime(timestamp);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} (AM|PM)/);
  });

  it("should handle midnight", () => {
    const timestamp = new Date("2024-01-01T00:00:00Z").getTime();
    const result = formatTime(timestamp);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} (AM|PM)/);
  });

  it("should handle noon", () => {
    const timestamp = new Date("2024-01-01T12:00:00Z").getTime();
    const result = formatTime(timestamp);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} (AM|PM)/);
  });

  it("should format with leading zeros", () => {
    const timestamp = new Date("2024-01-01T09:05:03Z").getTime();
    const result = formatTime(timestamp);
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} (AM|PM)/);
  });
});
