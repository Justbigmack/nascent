import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ORDER_SIDE, ORDER_TYPE } from "@/types/trading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { OrderFormValues } from "@/schemas/orderForm";
import type { UseFormReturn } from "react-hook-form";
import { clsx } from "clsx";
import { useOrderFormInputCalculations } from "@/hooks/useOrderFormInputCalculations";
import { useTranslation } from "react-i18next";

interface OrderFormProps {
  form: UseFormReturn<OrderFormValues>;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function OrderForm({ form, isPending, onSubmit }: OrderFormProps) {
  const { t } = useTranslation();

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const orderSideWatch = watch("orderSide");
  const price = watch("price");
  const quantity = watch("quantity");
  const notional = watch("notional");

  const isBuyOrderSide = orderSideWatch === ORDER_SIDE.BUY;

  const { lastModifiedRef } = useOrderFormInputCalculations(
    price,
    quantity,
    notional,
    setValue
  );

  return (
    <form onSubmit={onSubmit}>
      <Controller
        name="orderSide"
        control={control}
        render={({ field }) => {
          const error = errors.orderSide?.message;
          return (
            <Field data-invalid={!!error}>
              <Tabs
                value={field.value}
                onValueChange={field.onChange}
                className="mb-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value={ORDER_SIDE.BUY}
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    {t("general.buy")}
                  </TabsTrigger>
                  <TabsTrigger
                    value={ORDER_SIDE.SELL}
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    {t("general.sell")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {error && <FieldError errors={[{ message: error }]} />}
            </Field>
          );
        }}
      />

      <Controller
        name="orderType"
        control={control}
        render={({ field }) => {
          const error = errors.orderType?.message;
          return (
            <Field data-invalid={!!error}>
              <Tabs
                value={field.value}
                onValueChange={field.onChange}
                className="mb-4"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value={ORDER_TYPE.LIMIT}>
                    {t("general.limit")}
                  </TabsTrigger>
                  <TabsTrigger value={ORDER_TYPE.MARKET}>
                    {t("general.market")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={ORDER_TYPE.LIMIT} className="space-y-4">
                  <FieldGroup>
                    <Field data-invalid={!!errors.price}>
                      <FieldLabel htmlFor="price">
                        {t("general.price")}
                      </FieldLabel>
                      <Input
                        id="price"
                        type="text"
                        placeholder={t("orderForm.enterPrice")}
                        autoComplete="off"
                        {...register("price", {
                          onChange: () => {
                            lastModifiedRef.current = "price";
                          },
                        })}
                      />
                      {errors.price?.message && (
                        <FieldError
                          errors={[{ message: errors.price.message }]}
                        />
                      )}
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field data-invalid={!!errors.quantity}>
                      <FieldLabel htmlFor="quantity-limit">
                        {t("general.quantity")}
                      </FieldLabel>
                      <Input
                        id="quantity-limit"
                        type="text"
                        placeholder={t("orderForm.enterQuantity")}
                        autoComplete="off"
                        {...register("quantity", {
                          onChange: () => {
                            lastModifiedRef.current = "quantity";
                          },
                        })}
                      />
                      {errors.quantity?.message && (
                        <FieldError
                          errors={[{ message: errors.quantity.message }]}
                        />
                      )}
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field data-invalid={!!errors.notional}>
                      <FieldLabel htmlFor="notional">
                        {t("general.notional")}
                      </FieldLabel>
                      <Input
                        id="notional"
                        type="text"
                        placeholder={t("orderForm.enterNotional")}
                        autoComplete="off"
                        {...register("notional", {
                          onChange: () => {
                            lastModifiedRef.current = "notional";
                          },
                        })}
                      />
                      {errors.notional?.message && (
                        <FieldError
                          errors={[{ message: errors.notional.message }]}
                        />
                      )}
                    </Field>
                  </FieldGroup>
                </TabsContent>

                <TabsContent value={ORDER_TYPE.MARKET}>
                  <FieldGroup>
                    <Field data-invalid={!!errors.quantity}>
                      <FieldLabel htmlFor="quantity-market">
                        {t("general.quantity")}
                      </FieldLabel>
                      <Input
                        id="quantity-market"
                        type="text"
                        placeholder={t("orderForm.enterQuantity")}
                        autoComplete="off"
                        {...register("quantity")}
                      />
                      {errors.quantity?.message && (
                        <FieldError
                          errors={[{ message: errors.quantity.message }]}
                        />
                      )}
                    </Field>
                  </FieldGroup>
                </TabsContent>
              </Tabs>
              {error && <FieldError errors={[{ message: error }]} />}
            </Field>
          );
        }}
      />

      <Button
        type="submit"
        className={clsx("w-full", {
          "bg-green-600 hover:bg-green-700": isBuyOrderSide,
          "bg-red-600 hover:bg-red-700": !isBuyOrderSide,
        })}
        disabled={isPending}
      >
        {isBuyOrderSide ? t("general.buy") : t("general.sell")}
      </Button>
    </form>
  );
}
