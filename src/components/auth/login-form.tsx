import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "The password must be at most 20 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { login } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setAuth } = useAuth();

  // const onSubmit = async (data: LoginFormValues) => {
  //   try {
  //     const response = await login(data.email, data.password);

  //     console.log("Success:", response);

  //     setAuth(response.token, {
  //       userId: response.userId,
  //       email: response.email,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data.email, data.password);

      setAuth(response.token, {
        userId: response.userId,
        email: response.email,
      });
    } catch (error: any) {
      form.setError("root.serverError", {
        message: error.response?.data?.message ?? "Invalid email or password",
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="max-w-200">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 md:p-8"
            noValidate
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Zaki account
                </p>
              </div>
              {form.formState.errors.root?.serverError && (
                <div className="text-destructive text-sm font-medium">
                  {form.formState.errors.root.serverError.message}
                </div>
              )}

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Z@ahmedzaki.me"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-center">
                      <FieldLabel htmlFor="form-rhf-demo-password">
                        Password
                      </FieldLabel>
                      <a
                        href="/error"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                      <Input
                        {...field}
                        id="form-rhf-demo-password"
                        aria-invalid={fieldState.invalid}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="text-white/90"
                >
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>

              <FieldSeparator>Or</FieldSeparator>

              <FieldDescription className="text-center">
                Don&apos;t have an account?
                <Link to="/auth/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
