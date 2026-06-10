import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";

interface AdminNavMobileContextValue {
  registerOpenHandler: (handler: (() => void) | null) => void;
  openAdminNav: () => void;
}

const AdminNavMobileContext = createContext<AdminNavMobileContextValue | null>(
  null
);

export const AdminNavMobileProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const handlerRef = useRef<(() => void) | null>(null);

  const registerOpenHandler = useCallback((handler: (() => void) | null) => {
    handlerRef.current = handler;
  }, []);

  const openAdminNav = useCallback(() => {
    handlerRef.current?.();
  }, []);

  return (
    <AdminNavMobileContext.Provider
      value={{ registerOpenHandler, openAdminNav }}
    >
      {children}
    </AdminNavMobileContext.Provider>
  );
};

export const useAdminNavMobile = () => useContext(AdminNavMobileContext);
