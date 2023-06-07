import { createContext, useState  } from "react";

const SidebarContext = createContext(false);

const SidebarProvider = ({ children }) => {
    const [isCollapsedSidebar, toggleSidebarCollapse] = useState(false);

  const toggleSidebarCollapseHandler = () => {
    toggleSidebarCollapse(!isCollapsedSidebar);}

  return (
    <SidebarContext.Provider value={{ isCollapsedSidebar, toggleSidebarCollapseHandler }}>
      {children}
    </SidebarContext.Provider>
  );

}

export { SidebarProvider, SidebarContext };