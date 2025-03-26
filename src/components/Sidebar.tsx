import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Link2, LinkIcon, MapIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;
  return (
    <div className="sticky top-20">
      {/* <div className="rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:bg-opacity-80"> */}
      <div
        className="relative rounded-lg p-[1px] transition-all duration-300 
      bg-gradient-to-r from-green-400 to-blue-500 
      
      hover:animate-borderGlow"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Link
                href={`/profile/${user.username}`}
                className="flex flex-col items-center justify-center"
              >
                <Avatar className="size-20 border-2">
                  <AvatarImage src={user.image || "/modern.webp"} />
                </Avatar>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </Link>

              {/* Bio Start Here */}
              {user.bio && (
                <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>
              )}

              {/* Bio End Here */}
              <div className="w-full">
                <Separator className="my-4" />
                <div className="flex justify-between">
                  <div>
                    <p
                      className={`font-medium ${
                        user._count.following === 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {user._count.following}
                    </p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  {/* <Separator orientation="vertical" /> */}
                  <div>
                    <p
                      className={`font-medium ${
                        user._count.posts === 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {user._count.posts}
                    </p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        user._count.followers === 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {user._count.followers}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="size-4 mr-2 text-green-500" />
                  <p>{user.location || "No Location Available!"}</p>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Link2 className="size-4 mr-2 text-blue-500" />
                  {user.website ? (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="size-4 mr-2 text-blue-500" />
                    </a>
                  ) : (
                    <p>No Website Available!</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Sidebar;

//* UnAuthenticated User Sidebar:
