import { getSuggestedUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

async function SuggestedUser() {
  const randomUsers = await getSuggestedUsers();
  if (randomUsers.length === 0) return null;
  if (randomUsers.length > 0) {
    return (
      <div
        className="relative rounded-lg p-[2px] transition-all duration-300
              bg-gradient-to-r from-green-400 to-blue-500 hover:animate-borderGlow"
      >
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="capitalize flex items-center gap-2">
              <CornerDownRight className="sixe-5 text-green-600" />{" "}
              <span className="text-lg">Pepole You May Know</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {randomUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex gap-2 items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${user.username}`}>
                      <Avatar>
                        <AvatarImage src={user.image ?? "/avatar.png"} />
                      </Avatar>
                    </Link>
                    <div className="text-xs">
                      <Link
                        href={`/profile/${user.username}`}
                        className="font-medium cursor-pointer"
                      >
                        {user.name}
                      </Link>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground italic">
                          <span
                            className={`${
                              user._count.followers === 0
                                ? "text-red-500"
                                : "text-green-500"
                            } not-italic`}
                          >
                            {user._count.followers}
                          </span>{" "}
                          Followers
                        </p>
                        <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                        <p className="text-muted-foreground italic">
                          <span
                            className={`${
                              user._count.following === 0
                                ? "text-red-500"
                                : "text-green-500"
                            } not-italic`}
                          >
                            {user._count.following}
                          </span>{" "}
                          Following
                        </p>
                      </div>
                    </div>
                  </div>
                  <FollowButton userId={user.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default SuggestedUser;
