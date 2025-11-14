import { useEffect, useRef } from "react";

import type { OrderFormValues } from "@/schemas/orderForm";
import type { UseFormSetValue } from "react-hook-form";
import { parseFloatSafe } from "@/lib/generalUtils";

export function useOrderFormInputCalculations(
  price: string | undefined,
  quantity: string | undefined,
  notional: string | undefined,
  setValue: UseFormSetValue<OrderFormValues>
) {
  const lastModifiedRef = useRef<"price" | "quantity" | "notional" | null>(
    null
  );

  useEffect(() => {
    const priceNum = parseFloatSafe(price);
    const quantityNum = parseFloatSafe(quantity);
    const notionalNum = parseFloatSafe(notional);

    if (
      lastModifiedRef.current === "price" &&
      priceNum > 0 &&
      quantityNum > 0
    ) {
      const calculatedNotional = priceNum * quantityNum;
      setValue("notional", calculatedNotional.toFixed(2), {
        shouldValidate: false,
      });
    } else if (
      lastModifiedRef.current === "quantity" &&
      priceNum > 0 &&
      quantityNum > 0
    ) {
      const calculatedNotional = priceNum * quantityNum;
      setValue("notional", calculatedNotional.toFixed(2), {
        shouldValidate: false,
      });
    } else if (
      lastModifiedRef.current === "notional" &&
      priceNum > 0 &&
      notionalNum > 0
    ) {
      const calculatedQuantity = notionalNum / priceNum;
      setValue("quantity", calculatedQuantity.toFixed(6), {
        shouldValidate: false,
      });
    }
  }, [price, quantity, notional, setValue]);

  return { lastModifiedRef };
}
