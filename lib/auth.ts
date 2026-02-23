
const useStubAuth = true;

async function getStubUser() {
  return { email: "dev@example.com", role: "admin", purchasedPresets: [] };
}

export async function getCurrentAppUser() {
  if (useStubAuth) {
    return getStubUser();
  }

  return null;
}

export async function requireAdmin() {
  const user = await getCurrentAppUser();
  if (!user || user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return user;
}
