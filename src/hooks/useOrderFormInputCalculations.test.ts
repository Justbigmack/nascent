import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderHook } from "@testing-library/react";
import { useOrderFormInputCalculations } from "./useOrderFormInputCalculations";

describe("useOrderFormInputCalculations", () => {
  const mockSetValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when price is modified", () => {
    it("should calculate notional from price and quantity", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "100",
            quantity: "2.5",
            notional: "",
          },
        }
      );

      result.current.lastModifiedRef.current = "price";

      rerender({
        price: "150",
        quantity: "2.5",
        notional: "",
      });

      expect(mockSetValue).toHaveBeenCalledWith("notional", "375.00", {
        shouldValidate: false,
      });
    });

    it("should not calculate if quantity is zero", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "100",
            quantity: "",
            notional: "",
          },
        }
      );

      result.current.lastModifiedRef.current = "price";

      rerender({
        price: "150",
        quantity: "0",
        notional: "",
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it("should handle decimal quantities", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "40000",
            quantity: "0.05",
            notional: "",
          },
        }
      );

      result.current.lastModifiedRef.current = "price";

      rerender({
        price: "50000",
        quantity: "0.05",
        notional: "",
      });

      expect(mockSetValue).toHaveBeenCalledWith("notional", "2500.00", {
        shouldValidate: false,
      });
    });
  });

  describe("when quantity is modified", () => {
    it("should calculate notional from price and quantity", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "100",
            quantity: "2",
            notional: "",
          },
        }
      );

      result.current.lastModifiedRef.current = "quantity";

      rerender({
        price: "100",
        quantity: "5",
        notional: "",
      });

      expect(mockSetValue).toHaveBeenCalledWith("notional", "500.00", {
        shouldValidate: false,
      });
    });

    it("should not calculate if price is zero", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "0",
            quantity: "5",
            notional: "",
          },
        }
      );

      result.current.lastModifiedRef.current = "quantity";

      rerender({
        price: "0",
        quantity: "10",
        notional: "",
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe("when notional is modified", () => {
    it("should calculate quantity from notional and price", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "100",
            quantity: "",
            notional: "500",
          },
        }
      );

      result.current.lastModifiedRef.current = "notional";

      rerender({
        price: "100",
        quantity: "",
        notional: "1000",
      });

      expect(mockSetValue).toHaveBeenCalledWith("quantity", "10.000000", {
        shouldValidate: false,
      });
    });

    it("should not calculate if price is zero", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "0",
            quantity: "",
            notional: "500",
          },
        }
      );

      result.current.lastModifiedRef.current = "notional";

      rerender({
        price: "0",
        quantity: "",
        notional: "1000",
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it("should handle decimal prices", () => {
      const { result, rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "2500.50",
            quantity: "",
            notional: "200000",
          },
        }
      );

      result.current.lastModifiedRef.current = "notional";

      rerender({
        price: "2500.50",
        quantity: "",
        notional: "250050",
      });

      expect(mockSetValue).toHaveBeenCalledWith("quantity", "100.000000", {
        shouldValidate: false,
      });
    });
  });

  describe("when no field is modified", () => {
    it("should not calculate anything", () => {
      const { rerender } = renderHook(
        ({ price, quantity, notional }) =>
          useOrderFormInputCalculations(
            price,
            quantity,
            notional,
            mockSetValue
          ),
        {
          initialProps: {
            price: "100",
            quantity: "5",
            notional: "",
          },
        }
      );

      rerender({
        price: "100",
        quantity: "5",
        notional: "",
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });
});
