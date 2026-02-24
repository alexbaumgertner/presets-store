
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
  return true;
}
