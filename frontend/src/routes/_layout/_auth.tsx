import { isLoggedIn } from "@/hooks/useAuth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_auth")({
  component: Auth,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})


function Auth() {
  return <Outlet />
}