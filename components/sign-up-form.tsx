"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { Form } from "./ui/form";
import { createUser } from "@/lib/actions/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type FormData = z.infer<typeof userAuthSchema>;

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      // Create FormData for server action
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("sex", data.sex);

      // First create the user with server action
      const result = await createUser(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      // Then sign in with email
      const signInResult = await signIn("resend", {
        email: data.email,
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      });

      setIsLoading(false);

      if (!signInResult?.ok) {
        return toast.error("Something went wrong!", {
          description: "Your sign in request failed. Please try again.",
        });
      }

      // Redirect to verify email page
      router.push("/verify-email");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return toast.error("Something went wrong!", {
        description: error instanceof Error ? error.message : "Your sign up request failed. Please try again.",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label className="" htmlFor="firstName">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="firstName"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("firstName")}
                  />
                  {form.formState.errors?.firstName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label className="" htmlFor="lastName">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="lastName"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...form.register("lastName")}
                  />
                  {form.formState.errors?.lastName && (
                    <p className="px-1 text-xs text-red-600">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...form.register("email")}
                />
                {form.formState.errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
                </div>
                <div className="grid gap-1">
                <Label htmlFor="sex">
                  Gender
                </Label>
                <Select 
                  value={form.watch('sex')} 
                  onValueChange={(value) => {
                    form.setValue('sex', value as "male" | "female");
                    form.trigger('sex');
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...form.register("sex")}
                />
                {form.formState.errors?.sex && (
                  <p className="px-1 text-xs text-red-600">
                    {form.formState.errors.sex.message}
                  </p>
                )}
                </div>
              </div>
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up with email
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
