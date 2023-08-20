import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const handle = formData.get("handle");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/tournaments");
  const remember = formData.get("remember");

  if (typeof handle !== "string" || handle.length === 0) {
    return json(
      { errors: { handle: "Handle is required", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { handle: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(handle, password);

  if (!user) {
    return json(
      { errors: { handle: "Invalid handle or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo,
  });
}

// export const meta = () => {
//   return {
//     title: "Login",
//   };
// };

export default function _authLogin() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/tournaments";
  const actionData = useActionData<typeof action>();
  const handleRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.handle) {
      handleRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <div>
        {/*<img*/}
        {/*  className="mx-auto h-20 w-auto"*/}
        {/*  src="/ball.svg"*/}
        {/*  alt="Bsky Tools App"*/}
        {/*/>*/}
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <Form method="post" className="space-y-6 p-8 bg-white rounded-xl drop-shadow-md">
        <div className="rounded-md">
          <label
            htmlFor="handle"
            className="block text-sm font-medium text-gray-700"
          >
            Handle
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              ref={handleRef}
              id="handle"
              required
              autoFocus
              name="handle"
              type="text"
              aria-invalid={actionData?.errors?.handle ? true : undefined}
              aria-describedby="handle-error"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300"
            />
            {actionData?.errors?.handle && (
              <div className="pt-1 text-red-700" id="handle-error">
                {actionData.errors.handle}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              className="w-full rounded border border-gray-300"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Log in
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
        </div>
      </Form>
    </>
  );
}
