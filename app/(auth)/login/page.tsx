"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Formik } from "formik";
import { schema } from "./schema";
import { useRouter } from "next/navigation";
import { AuthService } from "@/service/client/auth.service";
import { Routes } from "@/enum/routes";
import Logo from "@/components/common/logo/logo";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import type { LoginFormValues } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formInitState: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await AuthService.login(values.email, values.password);
      router.replace(Routes.HOME);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Logo />
      <div className="py-4"></div>

      <Card className="py-0 sm:py-6 bg-transparent shadow-none border-none sm:bg-white sm:shadow-xl sm:border-border/50">
        <CardHeader className="px-6 hidden sm:block">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Formik
            initialValues={formInitState}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold" htmlFor="password">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            )}
          </Formik>

          <AuthDivider />
          <SocialAuthButtons />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <span className="mr-2">Don&#39;t have an account?</span>
            <Link
              href={Routes.SIGN_UP}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
