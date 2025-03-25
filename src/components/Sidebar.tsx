import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;
  return <div>Sidebar</div>;
}

export default Sidebar;

//* UnAuthenticated User Sidebar:
