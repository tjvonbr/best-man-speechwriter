"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import { Form } from "./ui/form";
import { Icons } from "./icons";
import { loginAuthSchema } from "@/lib/validations/auth";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof loginAuthSchema>;

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(loginAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const signInResult = await signIn("resend", {
        email: data.email.toLowerCase().trim(),
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      });

      setIsLoading(false);

      if (!signInResult?.ok) {
        return toast.error("Something went wrong.", {
          description: "Your sign in request failed. Please try again.",
        });
      }

      return toast.success("Check your email", {
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });
    } catch (error) {
      console.error(error);
      return toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGoogleLoading}
                {...form.register("email")}
              />
              {form.formState.errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Email
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            setIsGoogleLoading(true);
            signIn("google");
          }}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Google"
          )}
        </button>
      </Form>
    </div>
  );
}
