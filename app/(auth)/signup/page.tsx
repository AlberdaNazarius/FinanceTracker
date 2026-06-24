"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Formik } from "formik";
import { schema } from "./schema";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/client/auth.service";
import { Routes } from "@/enum/routes";
import Logo from "@/components/common/logo/logo";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import type { SignUpFormValues } from "@/types/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formInitState: SignUpFormValues = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await AuthService.signup(values.username, values.email, values.password);
      router.replace(Routes.HOME);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign up"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Logo />
      <div className='py-3'></div>

      <Card className="py-0 sm:py-6 bg-transparent shadow-none border-none sm:bg-card sm:shadow-xl sm:border-border/50">
        <CardHeader className='hidden sm:block'>
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className='px-6'>
          <Formik
            initialValues={formInitState}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="username">
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="John Doe"
                    value={values.username}
                    onChange={handleChange}
                  />
                  {touched.username && errors.username && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange}
                  />
                  {touched.email && errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <Label className="font-semibold" htmlFor="confirm_password">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm your password"
                    value={values.confirm_password}
                    onChange={handleChange}
                  />
                  {touched.confirm_password && errors.confirm_password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.confirm_password}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}
          </Formik>

          <AuthDivider />
          <SocialAuthButtons />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <span className="mr-2">Already have an account?</span>
            <Link
              href={Routes.LOGIN}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
