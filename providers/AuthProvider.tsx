import { Session } from "@supabase/supabase-js";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { supabase } from "~/lib/supabase";

export type AuthContextType = {
  session: Session | null
  isAuthentificated: boolean
  userId?: string
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthentificated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, []);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider value={{
      session,
      isAuthentificated: !!session?.user,
      userId: session?.user?.id,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);