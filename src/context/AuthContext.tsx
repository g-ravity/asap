import React from "react";
import { InitialAuthValues } from "../components/auth/AuthForm";
import { User } from "../../types";

type ReqMethod = "GET" | "POST" | "PUT" | "DELETE";

interface State {
  userData: User | undefined | null;
}

export interface ReqInit<B> extends Omit<RequestInit, "body"> {
  method?: ReqMethod;
  body?: B;
}

interface Actions {
  signIn: (values: InitialAuthValues) => Promise<void>;
  signUp: (values: InitialAuthValues) => Promise<void>;
  signOut: () => Promise<void>;
  request: <B, R>(endpoint: RequestInfo, config: ReqInit<B>) => Promise<R>;
}

export interface AuthContextType {
  state?: State;
  actions?: Actions;
}

const AuthContext = React.createContext<AuthContextType>(null);
export const useAuth = (): AuthContextType => React.useContext(AuthContext);

export default AuthContext;
