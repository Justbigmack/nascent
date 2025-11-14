import { ORDER_SIDE, ORDER_TYPE } from "@/types/trading";

import type { TFunction } from "i18next";
import { z } from "zod";

export type OrderFormInput = z.input<ReturnType<typeof createOrderFormSchema>>;

const numericString = (t: TFunction, requiredKey: string) =>
  z
    .string()
    .min(1, { message: t(requiredKey) })
    .refine((val) => !isNaN(parseFloat(val)), {
      message: t("orderForm.validation.mustBeANumber"),
    })
    .refine((val) => parseFloat(val) > 0, {
      message: t("orderForm.validation.mustBePositive"),
    });

export const createLimitOrderSchema = (t: TFunction) =>
  z.object({
    orderType: z.literal(ORDER_TYPE.LIMIT),
    orderSide: z.enum([ORDER_SIDE.BUY, ORDER_SIDE.SELL], {
      message: t("orderForm.validation.invalidOrderSide"),
    }),
    price: numericString(t, "orderForm.validation.priceRequired"),
    quantity: numericString(t, "orderForm.validation.quantityRequired"),
    notional: numericString(t, "orderForm.validation.totalRequired"),
  });

export const createMarketOrderSchema = (t: TFunction) =>
  z.object({
    orderType: z.literal(ORDER_TYPE.MARKET),
    orderSide: z.enum([ORDER_SIDE.BUY, ORDER_SIDE.SELL], {
      message: t("orderForm.validation.invalidOrderSide"),
    }),
    quantity: numericString(t, "orderForm.validation.quantityRequired"),
    price: z.string().optional(),
    notional: z.string().optional(),
  });

export const createOrderFormSchema = (t: TFunction) =>
  z.discriminatedUnion("orderType", [
    createLimitOrderSchema(t),
    createMarketOrderSchema(t),
  ]);

export type OrderFormValues = z.infer<ReturnType<typeof createOrderFormSchema>>;
