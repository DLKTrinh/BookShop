import Layout from "@/shared/components/Layout";
import { useAuth } from "@/features/auth/context/AuthContext";

const roleBadgeStyles: Record<string, string> = {
  admin: "bg-accent-amber-bg text-accent-amber-text",
  user: "bg-accent-blue-bg text-accent-blue-text",
};

const Profile: React.FC = () => {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const initial = user?.username?.[0]?.toUpperCase() ?? "?";
  const roleStyle = roleBadgeStyles[user?.role ?? "user"] ?? roleBadgeStyles.user;

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your profile</h1>
          <p className="text-muted-foreground">Account details tied to your login.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-semibold shrink-0">
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.username ?? "—"}</h2>
              {user?.role && (
                <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${roleStyle}`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>

          <dl className="space-y-5">
            <div className="flex justify-between items-center pb-5 border-b border-border">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="text-sm text-foreground font-medium">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="text-sm text-foreground font-medium">{memberSince ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;