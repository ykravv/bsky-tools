import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserId } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect('/app');
  } else {
    return redirect('/login')
  }
}

export default function _index() {
  return null;
}

