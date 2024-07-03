import { Redirect, Slot } from "expo-router";
import { useAuth } from "~/providers/AuthProvider";

export default function AuthLayout() {
  const { isAuthentificated } = useAuth();

  if (isAuthentificated) {
    return <Redirect href="/" />
  }

  return (
    <Slot />
  );
}