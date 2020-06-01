import * as Sentry from "@sentry/browser";
import React, { useCallback, useEffect, useState } from "react";
import { isUndefined } from "util";
import { User } from "../../types";
import { InitialAuthValues } from "../components/auth/AuthForm";
import AuthContext, { AuthContextType, ReqInit } from "./AuthContext";
import { Loader } from "../components/widgets";

export const AuthProvider: React.FC = props => {
  const [userData, setUserData] = useState<User | undefined | null>(undefined);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const user = await request<null, User | null>("/");
      setUserData(user);
    } catch (err) {
      Sentry.captureException(err);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (values: InitialAuthValues): Promise<void> => {
    const user = await request<InitialAuthValues, User>("/auth/signIn", { body: values });
    setUserData(user);
  };

  const signUp = async (values: InitialAuthValues): Promise<void> => {
    const user = await request<InitialAuthValues, User>("/auth/signUp", { body: values });
    setUserData(user);
  };

  const signOut = async (): Promise<void> => {
    await request("/auth/signUp");
    setUserData(null);
  };

  const request = async <B, R>(endpoint: RequestInfo, config: ReqInit<B> = {}): Promise<R> => {
    const { body, ...customConfig } = config;

    const reqConfig: RequestInit = {
      method: body ? "POST" : "GET",
      ...customConfig,
      body: body ? JSON.stringify(body) : null,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...customConfig.headers
      }
    };

    return window.fetch(`${process.env.REACT_APP_SERVER}/api${endpoint}`, reqConfig).then(async response => {
      const data = await response.json();

      if (response.status === 401) {
        setUserData(null);
        return null;
      }

      if (response.ok) {
        return data;
      }

      return Promise.reject(data);
    });
  };

  const values: AuthContextType = {
    state: { userData },
    actions: { signIn, signUp, signOut, request }
  };

  if (isUndefined(userData)) return <Loader />;

  return <AuthContext.Provider value={values} {...props} />;
};
