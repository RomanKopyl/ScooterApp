import { Redirect, Slot } from "expo-router";
import { useAuth } from "~/providers/AuthProvider";

export default function HomeLayout() {
  const { isAuthentificated } = useAuth();

  console.log('isAuthentificated', isAuthentificated);

  if (!isAuthentificated) {
    return <Redirect href="/auth" />
  }

  return (
    <Slot />
  );
}