import * as Yup from "yup";

export const budgetSchema = Yup.object().shape({
  categoryId: Yup.string().required("Category is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  periodStart: Yup.string().required("Start date is required"),
  periodEnd: Yup.string()
    .required("End date is required")
    .test("is-after-start", "End date must be after start date", function (value) {
      const { period_start } = this.parent;
      if (!period_start || !value) return true;
      return new Date(value) >= new Date(period_start);
    }),
});